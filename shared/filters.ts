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
		description: 'Keyword to match. Minimum 3 characters.',
		displayOptions: { show },
		routing: { request: { qs: { keyword: '={{$value}}' } } },
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
			'The gTLD to browse, without a leading dot. Only gTLDs are indexed; ccTLDs are not supported.',
		displayOptions: { show },
		routing: { request: { qs: { tld: '={{$value}}' } } },
	};
}

export function keywordPositionProperty(show: ShowRule): INodeProperties {
	return {
		displayName: 'Keyword Position',
		name: 'position',
		type: 'options',
		default: 'contain',
		description: 'Where the keyword must appear in the domain name',
		displayOptions: { show },
		options: [
			{ name: 'Anywhere', value: 'contain' },
			{ name: 'At the Start', value: 'start' },
			{ name: 'At the End', value: 'end' },
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
				'Whether to fetch every match in one export request (up to 50,000 domains) instead of a single page. Export draws on a small separate quota (10 per day and 100 per month on Premium), so prefer paging for workflows that run on a schedule.',
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
	description: 'Restrict to names made up only of letters or only of digits',
	options: [
		{ name: 'Letters Only', value: 'all_alpha' },
		{ name: 'Numbers Only', value: 'all_number' },
	],
	routing: { request: { qs: { type: '={{$value}}' } } },
};

export const excludeKeywordsFilter: INodeProperties = {
	displayName: 'Exclude Keywords',
	name: 'exclude',
	type: 'string',
	default: '',
	placeholder: 'shop,store',
	description: 'Negative keywords to drop from the results',
	routing: { request: { qs: { exclude: '={{$value}}' } } },
};

export const lengthFilter: INodeProperties = {
	displayName: 'Length',
	name: 'length',
	type: 'string',
	default: '',
	placeholder: '5-10',
	description:
		'Length of the domain name, excluding the TLD. Accepts a preset band (<code>&lt;5</code>, <code>5-10</code>, <code>10-15</code>, <code>15+</code>), an exact length (<code>10</code>), or a range (<code>8-12</code>, inclusive of both ends).',
	routing: { request: { qs: { length: '={{$value}}' } } },
};

export const noHyphensFilter: INodeProperties = {
	displayName: 'No Hyphens',
	name: 'no_hyphen',
	type: 'boolean',
	default: false,
	description: 'Whether to exclude domains containing hyphens',
	routing: { request: { qs: { no_hyphen: '={{$value}}' } } },
};

export const noNumbersFilter: INodeProperties = {
	displayName: 'No Numbers',
	name: 'no_number',
	type: 'boolean',
	default: false,
	description: 'Whether to exclude domains containing digits',
	routing: { request: { qs: { no_number: '={{$value}}' } } },
};

export const tldFilter: INodeProperties = {
	displayName: 'TLD',
	name: 'tld',
	type: 'string',
	default: '',
	placeholder: 'com',
	description:
		'Restrict keyword results to a single gTLD, without a leading dot. Only gTLDs are indexed; a ccTLD such as de or io returns no results.',
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

export function ageRangeFilter(bands: string): INodeProperties {
	return {
		displayName: 'Age',
		name: 'age_range',
		type: 'string',
		default: '',
		placeholder: '10-20',
		description: `Age of the domain in years. Accepts a preset band (${bands}), an exact age (<code>25</code>), or a range (<code>20-25</code>, inclusive of both ends). Combine with a comma to widen the search.`,
		routing: { request: { qs: { age_range: '={{$value}}' } } },
	};
}

export function newFilter(subject: string): INodeProperties {
	return {
		displayName: 'New Within',
		name: 'new',
		type: 'options',
		default: '3',
		description: `Only ${subject}, based on the most recent observed day`,
		options: [
			{ name: 'Last 2 Days', value: '2' },
			{ name: 'Last 3 Days', value: '3' },
			{ name: 'Last Day', value: '1' },
		],
		routing: { request: { qs: { new: '={{$value}}' } } },
	};
}

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
	placeholder: 'Sedo,Godaddy',
	description:
		'Marketplace the domain is listed on. Case-insensitive; combine with a comma. Values include Afternic, Atom, BuyDomains, Dan, DDD, DN.com, Godaddy, Hugedomains, SawSells, Sedo, Venture and 4.cn.',
	routing: { request: { qs: { platform: '={{$value}}' } } },
};

export const regDateFilter: INodeProperties = {
	displayName: 'Registration Date',
	name: 'reg_date',
	type: 'string',
	default: '',
	placeholder: '2026-07-10',
	description:
		'Registration date. Accepts a day (<code>2026-07-10</code>), a month (<code>2026-07</code>), a year (<code>2026</code>), or a <code>from:to</code> range, where either side may be omitted.',
	routing: { request: { qs: { reg_date: '={{$value}}' } } },
};
