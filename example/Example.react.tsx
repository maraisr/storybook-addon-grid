import * as React from 'react';

export default () => (
	<div
		style={{
			borderRadius: '14px',
			padding: '24px',
			backgroundColor: 'aquamarine',
		}}
	>
		Rendered at {new Date().toISOString()}
	</div>
);
