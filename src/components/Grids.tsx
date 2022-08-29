import type { Parameters, StoryContext } from '@storybook/addons';
import { useAddonState, useParameter } from '@storybook/api';
import type { DecoratorFn } from '@storybook/react';
import {
	Global,
	keyframes,
	styled,
	createCache,
	CacheProvider,
} from '@storybook/theming';
import { ContinuousContainer } from '@theuiteam/continuous-container';
import type { FunctionComponent } from 'react';
import { memo, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { AddonParameters, AddonState, GridParameters } from '../../index';
import { ADDON_ID, PARAM_KEY } from '../constants';

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
	styled.div<{ active: boolean; animation: boolean }>(
		({ active, animation }) => ({
			position: 'relative',
			zIndex: 1,
			animation: animation
				? `${
						active ? fadeIn : fadeOut
				  } ${ANIMATION_DURATION}ms ease 1 normal forwards`
				: undefined,
		}),
	),
);

const Grid = memo(
	styled.div<Exclude<GridParameters, 'color' | 'animation'>>(
		({ columns, gap, gutter, maxWidth }) => {
			let gutterRight = '0',
				gutterLeft = '0';
			if (Array.isArray(gutter)) {
				gutterLeft = gutter[0];
				gutterRight = gutter[0];
			} else if (gutter != null) {
				gutterLeft = gutterRight = gutter;
			}

			return {
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
				padding: `0 ${gutterRight} 0 ${gutterLeft}`,

				boxSizing: 'border-box',
				pointerEvents: 'none',
			};
		},
	),
);

const Column = styled.div<{ color: string }>(({ color }) => ({
	width: '100%',
	height: '100%',

	backgroundColor: color,
}));

export const Grids: FunctionComponent<GridParameters & AddonState> = ({
	visible,
	animation = true,
	columns = 12,
	gap = '20px',
	color = 'rgba(255, 0, 0, 0.1)',
	gutter = '50px',
	maxWidth = '1024px',
}) => {
	const columnDivs = useMemo(
		() =>
			Array.from({ length: columns }).map((_, index) => (
				<Column key={index} color={color} />
			)),
		[columns, color],
	);

	const grids = (
		<Grid
			animation={animation}
			columns={columns}
			gap={gap}
			gutter={gutter}
			maxWidth={maxWidth}
		>
			{columnDivs}
		</Grid>
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
			{animation ? (
				<ContinuousContainer<boolean>
					value={visible}
					exitTimeout={ANIMATION_DURATION}
				>
					{({ past, present, future }) =>
						past || present || future ? (
							<Wrapper
								active={present}
								data-addon-id={ADDON_ID}
								animation={animation}
							>
								{grids}
							</Wrapper>
						) : null
					}
				</ContinuousContainer>
			) : visible ? (
				<Wrapper active data-addon-id={ADDON_ID} animation={animation}>
					{grids}
				</Wrapper>
			) : null}
		</>
	);
};

const ManagerRenderedGrids = () => {
	const { animation, columns, gap, color, gutter, maxWidth, disable } =
		useParameter<AddonParameters>(PARAM_KEY, {});
	const [state] = useAddonState<AddonState>(ADDON_ID);

	return (
		<Grids
			animation={animation}
			columns={columns}
			color={color}
			gap={gap}
			visible={disable != null ? !disable : (state?.visible ?? false)}
			gutter={gutter}
			maxWidth={maxWidth}
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

const PreviewRenderedGridsContainer: FunctionComponent<{
	context: StoryContext;
}> = ({ context }) => {
	const emotionCache = useMemo(
		() =>
			createCache({
				key: ADDON_ID,
				container: document.head,
			}),
		[],
	);

	const {
		grid: { animation, columns, gap, color, gutter, maxWidth, disable } = {},
	} = context.parameters as Parameters & { grid: AddonParameters };

	return (
		<CacheProvider value={emotionCache}>
			<Grids
				visible={disable != null ? !disable : true}
				animation={animation}
				columns={columns}
				gap={gap}
				color={color}
				gutter={gutter}
				maxWidth={maxWidth}
			/>
		</CacheProvider>
	);
};

export const withGrid: DecoratorFn = (StoryFn, context) => (
	<>
		{StoryFn()}
		<PreviewRenderedGridsContainer context={context as StoryContext} />
	</>
);
