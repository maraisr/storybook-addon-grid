import React from 'react';
import { createPortal } from 'react-dom';

import type { DecoratorFunction } from '@storybook/types';
import { useAddonState, useParameter } from '@storybook/manager-api';
import { CacheProvider, createCache } from '@storybook/theming';

import type { AddonParameters, AddonState } from 'storybook-addon-grid';

import { ADDON_ID, PARAM_KEY } from './constants';

import { Grids } from './ui';

function ManagerRenderedGrids() {
	let { columns, gap, color, gutter, maxWidth, disable } =
		useParameter<AddonParameters>(PARAM_KEY, {});
	let [state] = useAddonState<AddonState>(ADDON_ID);

	return (
		<Grids
			columns={columns}
			color={color}
			gap={gap}
			visible={disable != null ? !disable : state?.visible ?? false}
			gutter={gutter}
			maxWidth={maxWidth}
		/>
	);
}

let styleCache = new WeakMap();

export let ManagerRenderedGridsContainer = React.memo(
	function ManagerRenderedGridsContainer() {
		let previewIframe = document.querySelector<HTMLIFrameElement>(
			'#storybook-preview-iframe',
		);
		if (!previewIframe) return null;

		let iframeDocument = previewIframe.contentWindow?.document;
		if (!iframeDocument) return null;

		let head = iframeDocument.head;
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
	},
);

export let withGrid: DecoratorFunction = (StoryFn, context) => {
	let { grid: gridParams } = context.parameters;

	return (
		<>
			{StoryFn()}
			{gridParams != null && gridParams.disable !== true && (
				<Grids visible {...gridParams} />
			)}
		</>
	);
};
