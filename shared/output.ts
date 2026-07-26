import type {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

function splitCsvLine(line: string): string[] {
	const out: string[] = [];
	let field = '';
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];

		if (inQuotes) {
			if (char === '"') {
				if (line[i + 1] === '"') {
					field += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				field += char;
			}
			continue;
		}

		if (char === '"') {
			inQuotes = true;
		} else if (char === ',') {
			out.push(field);
			field = '';
		} else {
			field += char;
		}
	}

	out.push(field);
	return out;
}

const NUMERIC_COLUMNS = new Set(['tld_count', 'age']);

function parseCsv(raw: string): IDataObject[] {
	const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== '');
	if (lines.length === 0) return [];

	const headers = splitCsvLine(lines[0]).map((h) => h.trim());

	return lines.slice(1).map((line) => {
		const cells = splitCsvLine(line);
		const row: IDataObject = {};
		headers.forEach((h, i) => {
			const value = (cells[i] ?? '').trim();
			if (value === '') return;
			row[h] = NUMERIC_COLUMNS.has(h) && !Number.isNaN(Number(value)) ? Number(value) : value;
		});
		return row;
	});
}

export async function parseDomainKitsResponse(
	this: IExecuteSingleFunctions,
	_items: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	const body = response.body;

	if (typeof body === 'string') {
		const trimmed = body.trim();

		if (trimmed.startsWith('{')) {
			let parsed: IDataObject | undefined;
			try {
				parsed = JSON.parse(trimmed) as IDataObject;
			} catch {
			}
			if (parsed?.success === false) {
				throw new NodeApiError(this.getNode(), parsed as JsonObject, {
					message: String(parsed.error ?? 'DomainKits API returned an error'),
				});
			}
		}

		return parseCsv(body).map((row) => ({ json: row }));
	}

	const envelope = (body ?? {}) as IDataObject;

	if (envelope.success === false) {
		throw new NodeApiError(this.getNode(), envelope as JsonObject, {
			message: String(envelope.error ?? 'DomainKits API returned an error'),
		});
	}

	const rows = (envelope.data ?? []) as IDataObject[];
	const total = envelope.total;

	return rows.map((row) => ({
		json: total === undefined ? row : { ...row, _total: total },
	}));
}
