export function config(entry: any[] = []) {
	return [...entry, require.resolve('./config/chromatic')];
}
