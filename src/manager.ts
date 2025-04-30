import { addons, types } from '@storybook/manager-api';
import { ADDON_ID, PARAM_KEY, PANEL_ID } from './constants';

import { Tool } from './Tool';

addons.register(ADDON_ID, () => {
	addons.add(PANEL_ID, {
		title: '',
		type: types.TOOL,
		paramKey: PARAM_KEY,
		match: ({ viewMode }) => viewMode === 'story',
		render: Tool,
	});
});
