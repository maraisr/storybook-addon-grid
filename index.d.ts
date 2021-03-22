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
	 * system's gutter (margin)
	 */
	gutter?: string;
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
