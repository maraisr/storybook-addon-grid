/**
 * Defines parameters for the column guides
 */
export interface GridParameters {
	/**
	 * Number of columns, default: 12
	 */
	columns?: number | undefined;
	/**
	 * Gap between columns
	 */
	gap?: string | undefined;
	/**
	 * Gutter (margin) on the left and/or right.
	 */
	gutter?: string | [string, string] | undefined;

	/**
	 * maximum allowed width
	 */
	maxWidth?: string | undefined;

	/**
	 * Enable or Disable the guides from fading in or out when toggling the state
	 */
	animation?: boolean | undefined;

	/**
	 * Sets the color used for the column guides, defaults to red (rgba(255, 0, 0, 0.1))
	 */
	color?: string | undefined;
}

export type AddonParameters = {
	disable?: boolean,
} & GridParameters;

export type AddonState = {
	/**
	 * Should the column guides be on by default here?
	 */
	 visible: boolean;
}
