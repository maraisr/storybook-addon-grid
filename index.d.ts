/**
 * Defines parameters for the column guides
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
	 * Enable or Disable the guides from fading in or out when toggling the state
	 */
	animation?: boolean;

	/**
	 * Sets the colour used for the column guides, defaults to red (rgba(255, 0, 0, 0.1))
	 */
	guidesColour?: string;
}

interface State {
	/**
	 * Should the column guides be on by default here?
	 */
	gridOn: boolean;
}

export type AddonParameters = GridParameters & Partial<State>;

export type AddonState = State;
