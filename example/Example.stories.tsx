import type { Meta, Story } from '@storybook/react';

const ComponentTest = () => (
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

export default {
	title: 'Example',
	component: ComponentTest,
} as Meta;

export const Default: Story = () => <ComponentTest />;

export const Disabled: Story = () => <ComponentTest />;
Disabled.parameters = {
	grid: {
		disable: true,
	},
};

export const SixColumnGrid: Story = () => <ComponentTest />;
SixColumnGrid.parameters = {
	grid: {
		columns: 6,
	},
};

export const GapColumnsChanged: Story = () => <ComponentTest />;
GapColumnsChanged.parameters = {
	grid: {
		columns: 4,
		gap: '10px',
	},
};

export const ZIndexCheckAbsolute: Story = () => (
	<div style={{ position: 'absolute', zIndex: 99 }}>
		<ComponentTest />
	</div>
);

export const ZIndexCheckFixed: Story = () => (
	<div style={{ position: 'fixed', zIndex: 99 }}>
		<ComponentTest />
	</div>
);

export const DifferentGutters: Story = () => <ComponentTest />;
DifferentGutters.parameters = {
	grid: {
		gutter: ['240px'],
	},
};

export const NoAnimation: Story = () => <ComponentTest />;
NoAnimation.parameters = {
	grid: {
		animation: false,
	},
};

export const DifferentColor: Story = () => <ComponentTest />;
DifferentColor.parameters = {
	grid: {
		color: 'rgba(0, 0, 255, 0.1)',
	},
};
