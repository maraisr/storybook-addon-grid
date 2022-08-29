import { useAddonState, useParameter, useStorybookState } from '@storybook/api';
import type { DecoratorFn } from '@storybook/react';
import { CacheProvider, createCache } from '@storybook/theming';
import deepmerge from 'deepmerge';
import {
	type FunctionComponent,
	memo,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import type {
	AddonParameters,
	AddonState,
	GridConfig,
	GridParameters,
} from 'storybook-addon-grid';
import { ADDON_ID, PARAM_KEY } from '../constants';

import { Grids } from './ui';

const useFirstOverride = (params: GridParameters, window: Window) => {
	const configTuples = useMemo(() => {
		if ('overrides' in params) {
			return Object.entries(params.overrides!).map(([key, config]) => {
				const matcher = window.matchMedia(key);
				return {
					matcher,
					config,
				};
			});
		}

		return undefined;
	}, [params]);

	const firstMatched = useCallback(
		() => configTuples?.find((i) => i.matcher.matches)?.config,
		[configTuples],
	);

	const [current, setCurrent] = useState(firstMatched);
	const x = useStorybookState(); // required so cleanup methods run, try do better

	// TODO: probably we can skip this in chromatic?
	useEffect(() => {
		const handles: Array<() => void> = [];

		configTuples?.forEach((item) => {
			const changeHandle = () => {
				setCurrent(firstMatched()); // TODO: resize causes lots of renders
			};

			item.matcher.addEventListener('change', changeHandle, {
				passive: true,
			});
			handles.push(
				() =>
					void item.matcher.removeEventListener(
						'change',
						changeHandle,
					),
			);
		});

		return () => {
			handles.forEach((item) => item());
		};
	}, [configTuples, firstMatched]);

	// TODO: try do better, when the story changes we need to reset the first matched
	useLayoutEffect(() => {
		setCurrent(firstMatched());
	}, [x.storyId]);

	return current;
};

const useResolvedGridConfig = (
	params: GridParameters,
	window: Window = globalThis.window,
): GridConfig => {
	const firstOverride = useFirstOverride(params, window);

	return useMemo(() => {
		let config = params;
		if (firstOverride) config = deepmerge(params, firstOverride);
		return {
			columns: config.columns,
			gap: config.gap,
			gutter: config.gutter,
			maxWidth: config.maxWidth,
			color: config.color,
		};
	}, [params, firstOverride]);
};

const ManagerRenderedGrids: FunctionComponent<{
	window: globalThis.Window;
}> = ({ window }) => {
	const gridParams = useParameter<AddonParameters>(PARAM_KEY, undefined);
	const [state] = useAddonState<AddonState>(ADDON_ID, {
		visible: false,
	});

	const config = useResolvedGridConfig(gridParams, window);

	return gridParams != null ? (
		<Grids
			visible={state.visible}
			animation={gridParams.animation ?? true}
			{...config}
		/>
	) : null;
};

// ~> Public API

const styleCache = new WeakMap();

export const ManagerRenderedGridsContainer = memo(() => {
	const previewIframe = document.querySelector<HTMLIFrameElement>(
		'#storybook-preview-iframe',
	);
	if (!previewIframe) return null;

	const iframeDocument = previewIframe.contentWindow?.document;
	if (!iframeDocument) return null;

	const head = iframeDocument.head;
	if (!head || !iframeDocument.body) return null;

	if (!styleCache.has(head))
		styleCache.set(
			head,
			createCache({
				key: ADDON_ID,
				container: head,
			}),
		);

	return createPortal(
		<CacheProvider value={styleCache.get(head)}>
			<ManagerRenderedGrids window={previewIframe.contentWindow!} />
		</CacheProvider>,
		iframeDocument.body,
	);
});

export const withGrid: DecoratorFn = (StoryFn, context) => {
	const { grid: gridParams } = context.parameters;

	const config = useResolvedGridConfig(gridParams);

	return (
		<>
			{StoryFn()}
			{gridParams != null && gridParams.disable !== true ? (
				<Grids
					visible
					animation={gridParams.animation ?? true}
					{...config}
				/>
			) : null}
		</>
	);
};
