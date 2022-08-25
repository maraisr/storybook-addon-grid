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

let gridOn: boolean = false;

export const Tools = () => {
	const parameters = useParameter<AddonParameters>(PARAM_KEY, {});
	const [state, setState] = useAddonState<AddonState>(ADDON_ID, {
		gridOn: parameters?.gridOn ?? gridOn,
	});

	const api = useStorybookApi();

	const toggleGrid = useCallback(() => {
		setState(
			(prev) => ({
				...prev,
				gridOn: !prev.gridOn,
			}),
			{
				persistence: 'session',
			},
		);
	}, []);

	// Sync params with addonState (params will prevail)
	useEffect(() => {
		if (
			typeof parameters?.gridOn === 'boolean' &&
			parameters.gridOn !== state.gridOn
		)
			setState(
				(prev) => ({
					...prev,
					gridOn: parameters.gridOn!,
				}),
				{
					persistence: 'session',
				},
			);
	}, [parameters]);

	// Keyboard events
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (focusInInput(event)) return;
			if (shortcutMatchesShortcut(eventToShortcut(event)!, shortcut)) {
				console.log(
					shortcutMatchesShortcut(eventToShortcut(event)!, shortcut),
				);
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
				active={state.gridOn}
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
