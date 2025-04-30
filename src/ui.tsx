import React from 'react';

import { Global, styled } from '@storybook/theming';

import type { AddonState, GridConfig } from 'storybook-addon-grid';

import { ADDON_ID } from './constants';

let MAX_COLUMNS = 24;

let Wrapper = styled.div({
	position: 'relative',
	zIndex: 1,
	opacity: 0,
	pointerEvents: 'none',

	'&[data-visible="true"]': {
		opacity: 1,
	},
});

let Grid = styled.div<Omit<Required<GridConfig>, 'color'>>(
	({ gap, gutter, maxWidth, columns }) => {
		let gutterRight = '0',
			gutterLeft = '0';
		if (Array.isArray(gutter)) {
			[gutterLeft, gutterRight] = gutter;
		} else if (gutter != null) {
			gutterLeft = gutterRight = gutter;
		}

		return {
			position: 'fixed',
			inset: '0',

			display: 'grid',
			gridTemplateColumns: `repeat(min(${columns}, ${MAX_COLUMNS}), 1fr)`,
			gridTemplateRows: '100%',
			gridColumnGap: gap,

			width: '100%',
			height: '100%',

			margin: '0 auto',
			maxWidth,
			padding: `0 ${gutterRight} 0 ${gutterLeft}`,

			boxSizing: 'border-box',
		};
	},
);

let Column = styled.div<{ color: string }>(({ color }) => ({
	width: '100%',
	height: '100%',

	backgroundColor: color,
}));

export function Grids({
	visible,
	columns = 12,
	gap = '20px',
	color = 'rgba(255, 0, 0, 0.1)',
	gutter = '50px',
	maxWidth = '1024px',
}: GridConfig & AddonState) {
	let columnDivs = React.useMemo(
		() =>
			Array.from({
				length: typeof columns === 'number' ? columns : MAX_COLUMNS,
			}).map((_, index) => <Column key={index} color={color} />),
		[columns, color],
	);

	let gridNodes = (
		<Grid gap={gap} gutter={gutter} maxWidth={maxWidth} columns={columns}>
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
			<Wrapper data-addon-id={ADDON_ID} data-visible={visible}>
				{gridNodes}
			</Wrapper>
		</>
	);
}
