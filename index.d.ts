/**
 * defines parameters for a grid system
 */
export interface GridParameters {
	/**
	 * number of columns, default 12
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

export interface AddonParameters extends GridParameters {
	gridOn?: boolean;
}

export interface AddonState {
	gridOn: boolean;
}
