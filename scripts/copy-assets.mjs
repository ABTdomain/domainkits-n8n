import { cp, mkdir, readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

async function copyByExtension(fromDir, toDir, extensions) {
	let entries;
	try {
		entries = await readdir(fromDir, { withFileTypes: true, recursive: true });
	} catch {
		return;
	}

	for (const entry of entries) {
		if (!entry.isFile()) continue;
		if (!extensions.some((ext) => entry.name.endsWith(ext))) continue;

		const from = join(entry.parentPath ?? entry.path, entry.name);
		const to = join(toDir, relative(fromDir, from));
		await mkdir(dirname(to), { recursive: true });
		await cp(from, to);
		console.log('copied', relative(root, to));
	}
}

await copyByExtension(join(root, 'nodes'), join(root, 'dist', 'nodes'), ['.json', '.svg', '.png']);
await copyByExtension(join(root, 'credentials'), join(root, 'dist', 'credentials'), ['.json', '.svg', '.png']);
