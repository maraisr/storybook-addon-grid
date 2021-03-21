import type { Meta, Story } from '@storybook/react';
import * as React from 'react';

const ComponentTest = () => (
	<h1>Hello World ~ {Math.ceil(Math.random() * 5)}</h1>
);

export default {
	title: 'Example',
	component: ComponentTest,
} as Meta;

export const Default: Story = () => <ComponentTest />;

export const GridOn: Story = () => <ComponentTest />;
GridOn.parameters = {
	grid: {
		gridOn: true,
	},
};

export const SixColumnGrid: Story = () => <ComponentTest />;
SixColumnGrid.parameters = {
	grid: {
		columns: 6,
	},
};
