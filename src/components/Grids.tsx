import createCache from '@emotion/cache';
import { useAddonState, useParameter } from '@storybook/api';
import { diary } from 'diary';
import { useMemo } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import type { AddonParameters, AddonState } from '../../index';
import { ADDON_ID, PARAM_KEY } from '../constants';
import { styled, CacheProvider } from '@storybook/theming';

const { info } = diary(`${ADDON_ID}:Grids`);

const Wrapper = styled.div<{ active: bolean }>(({ active }) => ({
	opacity: active ? '1' : '0',
	transition: 'opacity 0.08s linear',
	position: 'relative',
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

const Grids = () => {
	const {
		columns = 12,
		gap = '20px',
		gutter = '50px',
		maxWidth = '1024px',
	} = useParameter<AddonParameters>(PARAM_KEY, {});
	const [state] = useAddonState<AddonState>(ADDON_ID, {});

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
		<Wrapper active={state.gridOn} data-addon-id={ADDON_ID}>
			<Grid
				columns={columns}
				gap={gap}
				maxWidth={maxWidth}
				gutter={gutter}
			>
				{columnDivs}
			</Grid>
		</Wrapper>
	);
};

const styleCache = new WeakMap();

export const GridsContainer = () => {
	const previewIframe = document.querySelector('#storybook-preview-iframe');
	if (!previewIframe) return null;

	const iframeDocument = previewIframe.contentWindow.document;

	if (!styleCache.has(previewIframe))
		styleCache.set(
			previewIframe,
			createCache({
				key: ADDON_ID,
				container: iframeDocument.head,
			}),
		);

	return createPortal(
		<CacheProvider value={styleCache.get(previewIframe)}>
			<Grids />
		</CacheProvider>,
		iframeDocument.body,
	);
};
