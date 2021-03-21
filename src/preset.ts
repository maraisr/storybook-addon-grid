export function config(entry: any[] = []) {
	return [...entry, require.resolve('./config')];
}

export function managerEntries(entry: any[] = []) {
	return [...entry, require.resolve('./register')];
}
