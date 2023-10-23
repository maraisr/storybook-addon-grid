import React from 'react';

import { useAddonState, useParameter, useStorybookApi } from '@storybook/api';
import {
	eventToShortcut,
	shortcutMatchesShortcut,
	shortcutToHumanString,
} from '@storybook/manager-api';
import { IconButton } from '@storybook/components';
import { PREVIEW_KEYDOWN, STORY_RENDERED } from '@storybook/core-events';
import type { AddonParameters, AddonState } from 'storybook-addon-grid';
import { ADDON_ID, PARAM_KEY } from '../constants';
import { ManagerRenderedGridsContainer } from './Grids';

let shortcut = ['control', 'G'];

export function Tools() {
	let parameters = useParameter<AddonParameters>(PARAM_KEY, {});
	let [state, setState] = useAddonState<AddonState>(ADDON_ID, {
		visible: false,
	});
	let [ready, setReady] = React.useState(false);
	let api = useStorybookApi();

	let toggleGrid = React.useCallback(() => {
		setState(
			(prev) => ({
				visible: !prev?.visible ?? false,
			}),
			{
				persistence: 'session',
			},
		);
	}, []);

	// Keyboard events
	React.useEffect(() => {
		function handler(event: KeyboardEvent) {
			if (focusInInput(event)) return;
			if (shortcutMatchesShortcut(eventToShortcut(event)!, shortcut)) {
				event.preventDefault?.();
				toggleGrid();
			}
		}

		function previewHandler(data: { event: KeyboardEvent }) {
			handler(data.event);
		}

		document.addEventListener('keydown', handler);

		// KeyDown events from the preview iframe.
		api.on(PREVIEW_KEYDOWN, previewHandler);

		return () => {
			document.removeEventListener('keydown', handler);
			api.off(PREVIEW_KEYDOWN, previewHandler);
		};
	}, [api, toggleGrid]);

	// Avoid some "getting ready" states
	React.useEffect(() => {
		let mounted = true;
		function handler() {
			mounted && setReady(true);
		}

		api.once(STORY_RENDERED, handler);

		return () => {
			mounted = false;
		};
	}, [api]);

	let disabled =
		typeof parameters.disable === 'boolean' ? parameters.disable : false;
	let isActive = disabled ? !disabled : state.visible;

	return (
		<>
			<IconButton
				title={`Turn on Column Grid [${shortcutToHumanString(
					shortcut,
				)}]`}
				disabled={disabled}
				active={isActive}
				onClick={toggleGrid}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>
				</svg>
			</IconButton>
			{ready && !disabled ? <ManagerRenderedGridsContainer /> : null}
		</>
	);
}

function focusInInput(event: any) {
	return event.target
		? /input|textarea/i.test(event.target.tagName) ||
				event.target.getAttribute('contenteditable') !== null
		: false;
}
