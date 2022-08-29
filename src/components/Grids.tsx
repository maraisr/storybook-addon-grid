import { useAddonState, useParameter } from '@storybook/api';
import type { DecoratorFn } from '@storybook/react';
import { CacheProvider, createCache } from '@storybook/theming';
import { createPortal } from 'react-dom';
import type { AddonParameters, AddonState } from 'storybook-addon-grid';
import { ADDON_ID, PARAM_KEY } from '../constants';

import { Grids } from './ui';

const ManagerRenderedGrids = () => {
	const { animation, columns, gap, color, gutter, maxWidth, disable, maxColumns } =
		useParameter<AddonParameters>(PARAM_KEY, {});
	const [state] = useAddonState<AddonState>(ADDON_ID);

	return (
		<Grids
			animation={animation ?? true}
			columns={columns}
			color={color}
			gap={gap}
			visible={disable != null ? !disable : state?.visible ?? false}
			gutter={gutter}
			maxWidth={maxWidth}
			maxColumns={maxColumns}
		/>
	);
};

const styleCache = new WeakMap();

export const ManagerRenderedGridsContainer = () => {
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
			<ManagerRenderedGrids />
		</CacheProvider>,
		iframeDocument.body,
	);
};

export const withGrid: DecoratorFn = (StoryFn, context) => {
	const { grid: gridParams } = context.parameters;

	return (
		<>
			{StoryFn()}
			{gridParams != null && gridParams.disable !== true ? (
				<Grids
					visible
					animation={gridParams.animation ?? true}
					{...gridParams}
				/>
			) : null}
		</>
	);
};
