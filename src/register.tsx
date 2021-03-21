import * as React from 'react';
import addons, { types } from '@storybook/addons';
import { HorizontalColumns } from './components/HorizontalColumns';
import { ADDON_ID, PARAM_KEY } from './constants';

addons.register(ADDON_ID, () => {
	addons.add(`${ADDON_ID}/grid`, {
		title: 'Story Grids',
		type: types.TOOL,
		paramKey: PARAM_KEY,
		match: ({ viewMode }) => viewMode === 'story',
		render: () => <HorizontalColumns />,
	});
});
