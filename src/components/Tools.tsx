import { useAddonState, useParameter, useStorybookApi } from '@storybook/api';
import {
	eventToShortcut,
	shortcutMatchesShortcut,
	shortcutToHumanString,
} from '@storybook/api/shortcut';
import { IconButton } from '@storybook/components';
import { PREVIEW_KEYDOWN } from '@storybook/core-events';
import { useCallback, useEffect } from 'react';
import type { AddonParameters, AddonState } from '../../index';
import { ADDON_ID, PARAM_KEY } from '../constants';
import { Columns } from './Columns.svg';
import { ManagerRenderedGridsContainer } from './Grids';

const shortcut = ['control', 'G'];

export const Tools = () => {
	const parameters = useParameter<AddonParameters>(PARAM_KEY, {});
	const [state, setState] = useAddonState<AddonState>(ADDON_ID, { visible: false });

	const api = useStorybookApi();

	const isActive = typeof parameters.disable === 'boolean' ? !parameters.disable : state.visible;

	const toggleGrid = useCallback(() => {
		setState(
			(prev) => ({
				...prev,
				visible: !prev.visible
			}),
			{
				persistence: 'session',
			},
		);
	}, []);

	// Keyboard events
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (focusInInput(event)) return;
			if (shortcutMatchesShortcut(eventToShortcut(event)!, shortcut)) {
				event.preventDefault?.();
				toggleGrid();
			}
		};

		const previewHandler = (data: { event: KeyboardEvent }) =>
			void handler(data.event);

		document.addEventListener('keydown', handler);

		// KeyDown events from the preview iframe.
		api.on(PREVIEW_KEYDOWN, previewHandler);

		return () => {
			document.removeEventListener('keydown', handler);
			api.off(PREVIEW_KEYDOWN, previewHandler);
		};
	}, [api, toggleGrid]);

	return (
		<>
			<IconButton
				title={`Turn on Column Grid [${shortcutToHumanString(
					shortcut,
				)}]`}
				active={isActive}
				onClick={toggleGrid}
			>
				{Columns}
			</IconButton>
			<ManagerRenderedGridsContainer />
		</>
	);
};

function focusInInput(event: any) {
	return event.target
		? /input|textarea/i.test(event.target.tagName) ||
		event.target.getAttribute('contenteditable') !== null
		: false;
}
