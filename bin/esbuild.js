// Copyright @lukeed https://github.com/lukeed/worktop/blob/master/bin/esbuild.js

const esbuild = require('esbuild');

/** @type {esbuild.CommonOptions} */
const options = {
	target: 'es2015',
	sourcemap: false,
	treeShaking: true,
	minifySyntax: true,
	platform: 'browser',
	minifyIdentifiers: false,
	logLevel: 'info', // summary
};

/**
 * @param {string} input
 * @param {string} output
 * @param {string[]} [externals]
 */
exports.build = function (input, output, externals = []) {
	return Promise.all(
		Object.entries(output).map(([type, outfile]) => {
			esbuild.build({
				...options,
				bundle: true,
				format: type === 'require' ? 'cjs' : 'esm',
				outfile,
				entryPoints: [input],
				external: externals,
			});
		}),
	);
};

/**
 * @param {string} source
 * @param {esbuild.TransformOptions} [overrides]
 */
exports.transform = function (source, overrides = {}) {
	return esbuild.transformSync(source, {
		...options,
		format: 'cjs',
		...overrides,
	});
};
