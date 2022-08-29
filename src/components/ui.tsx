import { Global, keyframes, styled } from '@storybook/theming';
import { ContinuousContainer } from '@theuiteam/continuous-container';
import { FunctionComponent, useMemo } from 'react';
import { ADDON_ID } from 'src/constants';
import type { AddonState, GridConfig } from 'storybook-addon-grid';

const ANIMATION_DURATION = 130;

const fadeIn = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;

const fadeOut = keyframes`
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
`;

const Wrapper = styled.div<{ active: boolean; animation: boolean }>(
	({ active, animation }) => ({
		position: 'relative',
		zIndex: 1,
		animation: animation
			? `${
					active ? fadeIn : fadeOut
			  } ${ANIMATION_DURATION}ms ease 1 normal forwards`
			: undefined,
	}),
);

const Grid = styled.div<Exclude<GridConfig, 'color' | 'animation'> & {grid: string}>(
	({ gap, gutter, maxWidth, grid }) => {
		let gutterRight = '0',
			gutterLeft = '0';
		if (Array.isArray(gutter)) {
			([gutterLeft, gutterRight] = gutter)
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
			gridTemplateColumns: grid,
			gridTemplateRows: '100%',
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
);

const Column = styled.div<{ color: string }>(({ color }) => ({
	width: '100%',
	height: '100%',

	backgroundColor: color,
}));

export const Grids: FunctionComponent<
	GridConfig & { animation?: boolean } & AddonState
> = ({
	visible,
	animation = true,
	columns = 12,
	gap = '20px',
	color = 'rgba(255, 0, 0, 0.1)',
	gutter = '50px',
	maxWidth = '1024px',
	maxColumns = 24
}) => {
	const numberOfColumns = typeof(columns) ==='number' ? columns : maxColumns;
	const grid = typeof(columns) ==='number' ? `repeat(${columns}, 1fr)` : `repeat(var(${columns.match(/var\((.*)\)/)![1]}), 1fr)`

	const columnDivs = useMemo(
		() =>
			Array.from({ length: numberOfColumns }).map((_, index) => (
				<Column key={index} color={color} />
			)),
		[numberOfColumns, color],
	);

	const gridNodes = (
		<Grid grid={grid} gap={gap} gutter={gutter} maxWidth={maxWidth} >
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
								{gridNodes}
							</Wrapper>
						) : null
					}
				</ContinuousContainer>
			) : visible ? (
				<Wrapper active data-addon-id={ADDON_ID} animation={animation}>
					{gridNodes}
				</Wrapper>
			) : null}
		</>
	);
};
