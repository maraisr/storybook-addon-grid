module.exports = {
	stories: ['../*.stories.*'],
	addons: ['../../preset'],

	webpackFinal(config) {
		config.module.rules.push({
		  test: /\.svelte$/,
		  use: ['svelte-loader'],
		});

		return config;
	  },
};
