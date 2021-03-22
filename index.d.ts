/**
 * Defines parameters for the grid system
 */
export interface GridParameters {
	/**
	 * number of columns, default: 12
	 */
	columns?: number;
	/**
	 * gap between columns
	 */
	gap?: string;
	/**
	 * system's gutter (margin) both left and right
	 */
	gutter?: string;

	/**
	 * When set, will override the left hand side {@link gutter}
	 */
	gutterLeft?: string;

	/**
	 * When set, will override the right hand side {@link gutter}
	 */
	gutterRight?: string;
	/**
	 * maximum allowed width
	 */
	maxWidth?: string;
}

interface State {
	/**
	 * Should the grid be on by default here?
	 */
	gridOn: boolean;
}

export type AddonParameters = GridParameters & Partial<State>;

export type AddonState = State;
