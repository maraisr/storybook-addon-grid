import { addons, types } from '@storybook/manager-api';
import { ADDON_ID, PARAM_KEY } from './constants';

import { Tool } from './Tool';

addons.register(ADDON_ID, () => {
	addons.add(ADDON_ID, {
		type: types.TOOL,
		title: 'Column Grid',
		paramKey: PARAM_KEY,
		match: ({ viewMode, tabId }) => !!(viewMode && viewMode.match(/^(story|docs)$/)) && !tabId,
		render: Tool,
	});
});
