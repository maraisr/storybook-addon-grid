import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: ['../*.stories.*'],
	addons: ['storybook-addon-grid'],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
};
export default config;
