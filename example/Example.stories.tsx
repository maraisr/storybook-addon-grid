import type { Meta, StoryObj } from '@storybook/react';

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

export const Default = {} as StoryObj<typeof ComponentTest>;

export const Disabled = {
	parameters: {
		grid: {
			disable: true,
		},
	},
} as StoryObj<typeof ComponentTest>;

export const SixColumnGrid = {
	parameters: {
		grid: {
			columns: 6,
		},
	},
} as StoryObj<typeof ComponentTest>;

export const GapColumnsChanged = {
	parameters: {
		grid: {
			columns: 4,
			gap: '10px',
		},
	},
} as StoryObj<typeof ComponentTest>;

export const ZIndexCheckAbsolute = {
	render() {
		return (
			<div style={{ position: 'absolute', zIndex: 99 }}>
				<ComponentTest />
			</div>
		);
	},
} as StoryObj<typeof ComponentTest>;

export const ZIndexCheckFixed = {
	render() {
		return (
			<div style={{ position: 'fixed', zIndex: 99 }}>
				<ComponentTest />
			</div>
		);
	},
} as StoryObj<typeof ComponentTest>;
export const DifferentGutters = {
	parameters: {
		grid: {
			gutter: ['240px'],
		},
	},
} as StoryObj<typeof ComponentTest>;

export const DifferentColor = {
	parameters: {
		grid: {
			color: 'rgba(0, 0, 255, 0.1)',
		},
	},
} as StoryObj<typeof ComponentTest>;

export const ResponsiveGrid = {
	render() {
		return (
			<>
				<style
					dangerouslySetInnerHTML={{
						__html: `
			 body {
			  --columns: 4;
			  --gap: 8px;
			  --gutter: 16px;
          }

			  @media (min-width: 768px) {
			  body {
			    --columns: 8;
			    --gap: 12px;
			    --gutter: 24px;
			    }
			  }

			  @media (min-width: 1024px) {
			  body {
			    --columns: 12;
			    --gap: 24px;
			    --gutter: 48px;
			    }
			  }

			`,
					}}
				/>
				<ComponentTest />
			</>
		);
	},
	parameters: {
		grid: {
			columns: 'var(--columns)',
			gutter: 'var(--gutter)',
			gap: 'var(--gap)',
		},
	},
} as StoryObj<typeof ComponentTest>;
