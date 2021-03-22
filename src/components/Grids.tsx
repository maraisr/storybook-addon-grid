import createCache from '@emotion/cache';
import type { Parameters, StoryContext } from '@storybook/addons';
import { useAddonState, useParameter } from '@storybook/api';
import { DecoratorFn } from '@storybook/react';
import { CacheProvider, styled, Global } from '@storybook/theming';
import { diary } from 'diary';
import type { FunctionComponent } from 'react';
import * as React from 'react';
import { useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { AddonParameters, AddonState } from '../../index';
import { ADDON_ID, PARAM_KEY } from '../constants';

const { info } = diary(`${ADDON_ID}:Grids`);

const Wrapper = styled.div<{ active: boolean }>(({ active }) => ({
	position: 'relative',
	zIndex: 1,
	opacity: active ? '1' : '0',
	transition: 'opacity 0.08s linear',
}));

const Grid = styled.div<{
	columns: number;
	gap: string;
	gutter: string;
	maxWidth: string;
}>(({ columns, gap, gutter, maxWidth }) => ({
	position: 'fixed',
	top: '0',
	bottom: '0',
	left: '0',
	right: '0',

	display: 'grid',
	gridTemplateColumns: `repeat(${columns}, 1fr)`,
	gridColumnGap: gap,

	width: '100%',
	height: '100%',

	margin: '0 auto',
	maxWidth,
	padding: `0 ${gutter}`,

	boxSizing: 'border-box',
	pointerEvents: 'none',
}));

const Column = styled.div(() => ({
	width: '100%',
	height: '100%',

	backgroundColor: 'rgba(255, 0, 0, 0.1)',
}));

export const Grids: FunctionComponent<AddonParameters & AddonState> = ({
	columns = 12,
	gap = '20px',
	gutter = '50px',
	maxWidth = '1024px',
	gridOn,
}) => {
	info('grid painted with %o', {
		columns,
		gap,
		gutter,
		maxWidth,
	});

	const columnDivs = useMemo(
		() =>
			Array.from({ length: columns }).map((_, index) => (
				<Column key={index} />
			)),
		[columns],
	);

	return (
		<>
			<Global
				styles={{
					[`#root`]: {
						position: 'relative',
						zIndex: 0,
					},
				}}
			/>
			<Wrapper active={gridOn} data-addon-id={ADDON_ID}>
				<Grid
					columns={columns}
					gap={gap}
					maxWidth={maxWidth}
					gutter={gutter}
				>
					{columnDivs}
				</Grid>
			</Wrapper>
		</>
	);
};

const ManagerRenderedGrids = () => {
	const { columns, gap, gutter, maxWidth } = useParameter<AddonParameters>(
		PARAM_KEY,
		{},
	);
	const [state] = useAddonState<AddonState>(ADDON_ID);

	return (
		<Grids
			gridOn={state?.gridOn}
			gap={gap}
			maxWidth={maxWidth}
			gutter={gutter}
			columns={columns}
		/>
	);
};

const styleCache = new WeakMap();

export const ManagerRenderedGridsContainer = () => {
	const previewIframe: HTMLIFrameElement = document.querySelector(
		'#storybook-preview-iframe',
	);
	if (!previewIframe) return null;

	const iframeDocument = previewIframe.contentWindow.document;
	if (!iframeDocument) return null;

	const head = iframeDocument.head;
	if (!head) return null;

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

const PreviewRenderedGridsContainer: FunctionComponent<{
	context: StoryContext;
}> = ({ context }) => {
	const cacheRef = useRef(null);

	if (cacheRef.current === null)
		cacheRef.current = createCache({
			key: ADDON_ID,
			container: document.head,
		});

	const {
		grid: { columns, gap, gutter, maxWidth, gridOn } = {},
	} = context.parameters as Parameters & { grid: AddonParameters };

	return (
		<CacheProvider value={cacheRef.current}>
			<Grids
				gridOn={gridOn}
				gap={gap}
				maxWidth={maxWidth}
				gutter={gutter}
				columns={columns}
			/>
		</CacheProvider>
	);
};

export const withGrid: DecoratorFn = (StoryFn, context) => {
	return (
		<>
			{StoryFn()}
			<PreviewRenderedGridsContainer context={context} />
		</>
	);
};
