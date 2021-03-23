/**
 * Defines parameters for the grid system
 */
export interface GridParameters {
	/**
	 * Number of columns, default: 12
	 */
	columns?: number;
	/**
	 * Gap between columns
	 */
	gap?: string;
	/**
	 * System's gutter (margin) for both left and right
	 */
	gutter?: string;

	/**
	 * Define to override the {@link gutter} defined on the left-hand-side
	 */
	gutterLeft?: string;

	/**
	 * Define to override the {@link gutter} defined on the right-hand-side
	 */
	gutterRight?: string;

	/**
	 * maximum allowed width
	 */
	maxWidth?: string;

	/**
	 * Enable or Disable grid fade-in and fade-out when toggling the state
	 */
	animation?: boolean;
}

interface State {
	/**
	 * Should the grid be on by default here?
	 */
	gridOn: boolean;
}

export type AddonParameters = GridParameters & Partial<State>;

export type AddonState = State;
