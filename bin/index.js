// Copyright @lukeed https://github.com/lukeed/worktop/blob/master/bin/index.js

const { parse, format } = require('path');
const { copyFileSync, existsSync } = require('fs');
const pkg = require('../package.json');
const esbuild = require('./esbuild');

const externals = [
	...Object.keys(pkg.peerDependencies || {}),
	...Object.keys(pkg.dependencies || {}),
];

async function bundle(input, output) {
	await esbuild.build(input, output, externals);

	let dts = input.replace(/\.[mc]?[tj]sx?$/, '.d.ts');
	if (!existsSync(dts)) return;

	let info = parse(input);
	info.base = `${info.name}.d.ts`;
	info.dir = 'dist';

	copyFileSync(dts, format(info));
}

bundle('src/preset.ts', pkg.exports['./preset']);
bundle('src/chromatic.ts', pkg.exports['./chromatic']);
bundle('src/register.tsx', {
	require: './dist/register.js',
	import: './dist/register.mjs',
});
bundle('src/config/index.ts', {
	require: './dist/config/index.js',
	import: './dist/config/index.mjs',
});
bundle('src/config/chromatic.ts', {
	require: './dist/config/chromatic.js',
	import: './dist/config/chromatic.mjs',
});
