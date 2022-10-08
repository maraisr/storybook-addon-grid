import { useAddonState, useParameter, useStorybookApi } from '@storybook/api';
import {
	eventToShortcut,
	shortcutMatchesShortcut,
	shortcutToHumanString,
} from '@storybook/api/shortcut';
import { IconButton } from '@storybook/components';
import { PREVIEW_KEYDOWN, STORY_RENDERED } from '@storybook/core-events';
import { useCallback, useEffect, useState } from 'react';
import type { AddonParameters, AddonState } from 'storybook-addon-grid';
import { ADDON_ID, PARAM_KEY } from '../constants';
import { ManagerRenderedGridsContainer } from './Grids';

const shortcut = ['control', 'G'];

export const Tools = () => {
	const parameters = useParameter<AddonParameters>(PARAM_KEY, {});
	const [state, setState] = useAddonState<AddonState>(ADDON_ID, {
		visible: false,
	});
	const [ready, setReady] = useState(false);
	const api = useStorybookApi();

	const toggleGrid = useCallback(() => {
		setState(
			(prev) => ({
				...prev,
				visible: !prev?.visible,
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

	// Avoid some "getting ready" states
	useEffect(() => {
		const handler = () => {
			api.off(STORY_RENDERED, handler); // api.once doesnt work in strict mode here
			setReady(true);
		};

		api.on(STORY_RENDERED, handler);

		return () => api.off(STORY_RENDERED, handler);
	}, [api]);

	const disabled =
		typeof parameters.disable === 'boolean' ? parameters.disable : false;
	const isActive = disabled ? !disabled : state.visible;

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
			{!disabled && ready ? <ManagerRenderedGridsContainer /> : null}
		</>
	);
};

function focusInInput(event: any) {
	return event.target
		? /input|textarea/i.test(event.target.tagName) ||
				event.target.getAttribute('contenteditable') !== null
		: false;
}
