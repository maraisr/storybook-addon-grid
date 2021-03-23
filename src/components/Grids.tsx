import createCache from '@emotion/cache';
import type { Parameters, StoryContext } from '@storybook/addons';
import { useAddonState, useParameter } from '@storybook/api';
import type { DecoratorFn } from '@storybook/react';
import { CacheProvider, Global, keyframes, styled } from '@storybook/theming';
import { ContinuousContainer } from '@theuiteam/continuous-container';
import { diary } from 'diary';
import type { FunctionComponent } from 'react';
import * as React from 'react';
import { memo, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { AddonParameters, AddonState, GridParameters } from '../../index';
import { ADDON_ID, PARAM_KEY } from '../constants';

const { info } = diary(`${ADDON_ID}:Grids`);

const ANIMATION_DURATION = 130;

const fadeIn = keyframes`
 from { opacity: 0; }
 to { opacity: 1; }
`;

const fadeOut = keyframes`
 from { opacity: 1; }
 to { opacity: 0; }
`;

const Wrapper = memo(
	styled.div<{ active: boolean }>(({ active }) => ({
		position: 'relative',
		zIndex: 1,
		animation: `${
			active ? fadeIn : fadeOut
		} ${ANIMATION_DURATION}ms ease 1 normal forwards`,
	})),
);

const Grid = memo(
	styled.div<GridParameters>(
		({ columns, gap, gutter, gutterLeft, gutterRight, maxWidth }) => ({
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
			padding: `0 ${gutterRight ?? gutter} 0 ${gutterLeft ?? gutter}`,

			boxSizing: 'border-box',
			pointerEvents: 'none',
		}),
	),
);

const Column = styled.div(() => ({
	width: '100%',
	height: '100%',

	backgroundColor: 'rgba(255, 0, 0, 0.1)',
}));

export const Grids: FunctionComponent<AddonParameters & AddonState> = ({
	columns = 12,
	gap = '20px',
	gridOn,
	gutter = '50px',
	gutterLeft,
	gutterRight,
	maxWidth = '1024px',
}) => {
	info('grid painted with %o', {
		columns,
		gap,
		gutter,
		gutterLeft,
		gutterRight,
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
			<ContinuousContainer<boolean>
				value={gridOn}
				timeout={ANIMATION_DURATION}
			>
				{(past, present, future) =>
					past || present || future ? (
						<Wrapper active={present} data-addon-id={ADDON_ID}>
							<Grid
								columns={columns}
								gap={gap}
								gutter={gutter}
								gutterLeft={gutterLeft}
								gutterRight={gutterRight}
								maxWidth={maxWidth}
							>
								{columnDivs}
							</Grid>
						</Wrapper>
					) : null
				}
			</ContinuousContainer>
		</>
	);
};

const ManagerRenderedGrids = () => {
	const {
		columns,
		gap,
		gutter,
		gutterLeft,
		gutterRight,
		maxWidth,
	} = useParameter<AddonParameters>(PARAM_KEY, {});
	const [state] = useAddonState<AddonState>(ADDON_ID);

	return (
		<Grids
			columns={columns}
			gap={gap}
			gridOn={state?.gridOn}
			gutter={gutter}
			gutterLeft={gutterLeft}
			gutterRight={gutterRight}
			maxWidth={maxWidth}
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
		grid: {
			columns,
			gap,
			gridOn,
			gutter,
			gutterLeft,
			gutterRight,
			maxWidth,
		} = {},
	} = context.parameters as Parameters & { grid: AddonParameters };

	return (
		<CacheProvider value={cacheRef.current}>
			<Grids
				columns={columns}
				gap={gap}
				gridOn={gridOn}
				gutter={gutter}
				gutterLeft={gutterLeft}
				gutterRight={gutterRight}
				maxWidth={maxWidth}
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
