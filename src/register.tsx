import addons, { types } from '@storybook/addons';
import * as React from 'react';
import { Tools } from './components/Tools';
import { ADDON_ID, PARAM_KEY } from './constants';

addons.register(ADDON_ID, () => {
	addons.add(`${ADDON_ID}/grid`, {
		title: 'Story Column Guides',
		type: types.TOOL,
		paramKey: PARAM_KEY,
		match: ({ viewMode }) => viewMode === 'story',
		render: () => <Tools />,
	});
});
