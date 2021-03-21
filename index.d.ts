export interface GridParameters {
	columns?: number;
	gap?: string;
	gutter?: string;
	maxWidth?: string;
}

export interface AddonParameters extends GridParameters {
	gridOn?: boolean;
}

export interface AddonState {
	gridOn: boolean;
}
