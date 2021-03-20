// Copyright @lukeed https://github.com/lukeed/worktop/blob/master/bin/index.js

const { parse, format } = require('path');
const { copyFileSync, existsSync } = require('fs');
const pkg = require('../package.json');
const esbuild = require('./esbuild');

const externals = [
	...Object.keys(pkg.dependencies ?? {})
];

async function bundle(input, output) {
	await esbuild.build(input, output, externals);

	let dts = input.replace(/\.[mc]?[tj]s$/, '.d.ts');
	if (!existsSync(dts)) return;

	let info = parse(input);
	info.base = 'index.d.ts';
	info.dir = info.name;

	copyFileSync(dts, format(info));
}

bundle('src/preset.ts', pkg.exports['./preset']);