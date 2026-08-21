import type { INodeProperties, IDisplayOptions } from 'n8n-workflow';

type ShowRule = IDisplayOptions['show'];

export function searchModeProperty(show: ShowRule): INodeProperties {
	return {
		displayName: 'Search Mode',
		name: 'searchMode',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'By Keyword',
				value: 'keyword',
				description: 'Match a keyword across every indexed gTLD',
			},
			{
				name: 'Browse a TLD',
				value: 'tld',
				description: 'List every domain under one gTLD',
			},
		],
		default: 'keyword',
	};
}

export function keywordProperty(show: ShowRule, placeholder = 'tech'): INodeProperties {
	return {
		displayName: 'Keyword',
		name: 'keyword',
		type: 'string',
		required: true,
		default: '',
		placeholder,
		description: 'Keyword matched as a substring of the name portion. Minimum 2 characters.',
		displayOptions: { show },
		routing: { request: { qs: { query: '={{$value}}' } } },
	};
}

export function tldProperty(show: ShowRule): INodeProperties {
	return {
		displayName: 'TLD',
		name: 'tld',
		type: 'string',
		required: true,
		default: 'com',
		placeholder: 'com',
		description:
			'The gTLD to browse, without a leading dot. Comma-separated for several. Only gTLDs are indexed; ccTLDs are not supported.',
		displayOptions: { show },
		routing: { request: { qs: { tld: '={{$value}}' } } },
	};
}

export function keywordPositionProperty(show: ShowRule): INodeProperties {
	return {
		displayName: 'Keyword Position',
		name: 'position',
		type: 'options',
		default: '',
		description: 'Where the keyword must appear in the name portion',
		displayOptions: { show },
		options: [
			{ name: 'Anywhere', value: '' },
			{ name: 'At the Start', value: 'start' },
			{ name: 'At the End', value: 'end' },
			{ name: 'In the Middle', value: 'middle' },
		],
		routing: { request: { qs: { position: '={{$value}}' } } },
	};
}

export function returnAllProperties(show: ShowRule): INodeProperties[] {
	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			default: false,
			displayOptions: { show },
			description:
				'Whether to fetch every match in one export request (up to 50,000 domains) instead of a single page. Export draws on a small separate quota with a monthly cap, so prefer paging for workflows that run on a schedule.',
		},
		{
			displayName: 'Export Format',
			name: 'exportFormat',
			type: 'hidden',
			default: 'csv',
			displayOptions: { show: { ...show, returnAll: [true] } },
			routing: { request: { qs: { export: '={{$value}}' } } },
		},
	];
}

export function paginationProperties(show: ShowRule): INodeProperties[] {
	const pagedOnly = { ...show, returnAll: [false] };

	return [
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			default: 40,
			typeOptions: { minValue: 1, maxValue: 500 },
			description: 'Max number of results to return',
			displayOptions: { show: pagedOnly },
			routing: { request: { qs: { limit: '={{$value}}' } } },
		},
		{
			displayName: 'Offset',
			name: 'offset',
			type: 'number',
			default: 0,
			typeOptions: { minValue: 0 },
			description: 'Number of results to skip, for paging through a large result set',
			displayOptions: { show: pagedOnly },
			routing: { request: { qs: { offset: '={{$value}}' } } },
		},
	];
}

export const compositionFilter: INodeProperties = {
	displayName: 'Composition',
	name: 'type',
	type: 'options',
	default: 'all_alpha',
	description: 'Restrict by the characters the name is made of',
	options: [
		{
			name: 'Letters Only',
			value: 'all_alpha',
			routing: { request: { qs: { all_alpha: 'true' } } },
		},
		{
			name: 'Numbers Only',
			value: 'all_number',
			routing: { request: { qs: { all_number: 'true' } } },
		},
		{
			name: 'Has Digits',
			value: 'has_number',
			routing: { request: { qs: { has_number: 'true' } } },
		},
		{
			name: 'No Digits',
			value: 'no_number',
			routing: { request: { qs: { has_number: 'false' } } },
		},
		{
			name: 'Has Hyphen',
			value: 'has_hyphen',
			routing: { request: { qs: { has_hyphen: 'true' } } },
		},
		{
			name: 'No Hyphens',
			value: 'no_hyphen',
			routing: { request: { qs: { has_hyphen: 'false' } } },
		},
	],
};

export const excludeKeywordsFilter: INodeProperties = {
	displayName: 'Exclude Keywords',
	name: 'exclude',
	type: 'string',
	default: '',
	placeholder: 'shop,store',
	description: 'Negative keywords to drop from the results',
	routing: { request: { qs: { exclude_query: '={{$value}}' } } },
};

export const lengthMinFilter: INodeProperties = {
	displayName: 'Length Min',
	name: 'length_min',
	type: 'number',
	default: 1,
	typeOptions: { minValue: 1, maxValue: 63 },
	description: 'Minimum length of the name portion, excluding the TLD',
	routing: { request: { qs: { length_min: '={{$value}}' } } },
};

export const lengthMaxFilter: INodeProperties = {
	displayName: 'Length Max',
	name: 'length_max',
	type: 'number',
	default: 63,
	typeOptions: { minValue: 1, maxValue: 63 },
	description: 'Maximum length of the name portion, excluding the TLD',
	routing: { request: { qs: { length_max: '={{$value}}' } } },
};

export const tldFilter: INodeProperties = {
	displayName: 'TLD',
	name: 'tld',
	type: 'string',
	default: '',
	placeholder: 'com',
	description:
		'Restrict keyword results to gTLDs, without a leading dot, comma-separated for several. Only gTLDs are indexed; a ccTLD such as de or io returns no results.',
	routing: { request: { qs: { tld: '={{$value}}' } } },
};

export function sortFilter(
	options: Array<{ name: string; value: string }>,
	defaultValue: string,
): INodeProperties {
	return {
		displayName: 'Sort',
		name: 'sort',
		type: 'options',
		default: defaultValue,
		description: 'Order in which to return results',
		options,
		routing: { request: { qs: { sort: '={{$value}}' } } },
	};
}

export const ageMinFilter: INodeProperties = {
	displayName: 'Age Min',
	name: 'age_min',
	type: 'number',
	default: 0,
	typeOptions: { minValue: 0, maxValue: 100 },
	description: 'Minimum age of the domain in years',
	routing: { request: { qs: { age_min: '={{$value}}' } } },
};

export const ageMaxFilter: INodeProperties = {
	displayName: 'Age Max',
	name: 'age_max',
	type: 'number',
	default: 100,
	typeOptions: { minValue: 0, maxValue: 100 },
	description: 'Maximum age of the domain in years',
	routing: { request: { qs: { age_max: '={{$value}}' } } },
};

export function foundDateStartFilter(subject: string): INodeProperties {
	return {
		displayName: 'Observed From',
		name: 'found_date_start',
		type: 'string',
		default: '',
		placeholder: '2026-08-01',
		description: `Range start for the date ${subject}, in YYYY-MM-DD format, inclusive`,
		routing: { request: { qs: { found_date_start: '={{$value}}' } } },
	};
}

export function foundDateEndFilter(subject: string): INodeProperties {
	return {
		displayName: 'Observed To',
		name: 'found_date_end',
		type: 'string',
		default: '',
		placeholder: '2026-08-15',
		description: `Range end for the date ${subject}, in YYYY-MM-DD format, inclusive`,
		routing: { request: { qs: { found_date_end: '={{$value}}' } } },
	};
}

export const listedWithinFilter: INodeProperties = {
	displayName: 'Listed Within',
	name: 'listed_days_max',
	type: 'options',
	default: 3,
	description: 'Only listings that first appeared on a marketplace in the last N days',
	options: [
		{ name: 'Last Day', value: 1 },
		{ name: 'Last 2 Days', value: 2 },
		{ name: 'Last 3 Days', value: 3 },
	],
	routing: { request: { qs: { listed_days_max: '={{$value}}' } } },
};

export const hasSaleFilter: INodeProperties = {
	displayName: 'Has Marketplace Listing',
	name: 'has_sale',
	type: 'boolean',
	default: false,
	description: 'Whether to return only domains that are listed for sale',
	routing: { request: { qs: { has_sale: '={{$value}}' } } },
};

export const platformFilter: INodeProperties = {
	displayName: 'Marketplace',
	name: 'platform',
	type: 'string',
	default: '',
	placeholder: 'sedo,afternic',
	description:
		'Marketplace the domain is listed on. Case-insensitive; combine with a comma. An unknown name returns 400 with the supported values.',
	routing: { request: { qs: { platform: '={{$value}}' } } },
};

export const createDateStartFilter: INodeProperties = {
	displayName: 'Registered From',
	name: 'create_date_start',
	type: 'string',
	default: '',
	placeholder: '2026-07-01',
	description: 'Range start for the registration date, in YYYY-MM-DD format, inclusive',
	routing: { request: { qs: { create_date_start: '={{$value}}' } } },
};

export const createDateEndFilter: INodeProperties = {
	displayName: 'Registered To',
	name: 'create_date_end',
	type: 'string',
	default: '',
	placeholder: '2026-07-31',
	description: 'Range end for the registration date, in YYYY-MM-DD format, inclusive',
	routing: { request: { qs: { create_date_end: '={{$value}}' } } },
};
