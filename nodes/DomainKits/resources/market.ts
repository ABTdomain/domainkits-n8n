import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
	compositionFilter,
	excludeKeywordsFilter,
	lengthFilter,
	newFilter,
	noHyphensFilter,
	noNumbersFilter,
	paginationProperties,
	platformFilter,
	returnAllProperties,
	searchModeProperty,
	sortFilter,
	tldFilter,
	tldProperty,
} from '../../../shared/filters';

const showForMarket = {
	resource: ['market'],
	operation: ['search'],
};

const showForKeywordMode = {
	...showForMarket,
	searchMode: ['keyword'],
};

const showForTldMode = {
	...showForMarket,
	searchMode: ['tld'],
};

export const marketDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['market'] } },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search marketplace domains',
				description:
					'Search domains listed for sale on marketplaces by keyword, or browse every listing under a gTLD',
				routing: {
					request: {
						method: 'GET',
						url: '/search/market',
					},
					output: {
						postReceive: [parseDomainKitsResponse],
					},
				},
			},
		],
		default: 'search',
	},

	searchModeProperty(showForMarket),
	{
		displayName: 'Keyword',
		name: 'keyword',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'shop',
		description:
			'Keyword to match, no minimum length. Matches the start of the name by default; use Keyword Position to match anywhere.',
		displayOptions: { show: showForKeywordMode },
		routing: { request: { qs: { keyword: '={{$value}}' } } },
	},
	tldProperty(showForTldMode),

	...returnAllProperties(showForMarket),
	...paginationProperties(showForMarket),

	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showForMarket },
		options: [
			compositionFilter,
			excludeKeywordsFilter,
			lengthFilter,
			platformFilter,
			newFilter('listings that first appeared on a marketplace recently'),
			noHyphensFilter,
			noNumbersFilter,
			sortFilter(
				[
					{ name: 'Alphabetical', value: 'alpha' },
					{ name: 'Length (Longest First)', value: 'length_desc' },
					{ name: 'Length (Shortest First)', value: 'length_asc' },
					{ name: 'TLD Count (High to Low)', value: 'tld_counter_desc' },
					{ name: 'TLD Count (Low to High)', value: 'tld_counter_asc' },
				],
				'length_asc',
			),
			tldFilter,
		],
	},

	{
		displayName: 'Keyword Position',
		name: 'position',
		type: 'options',
		default: 'start',
		description:
			'Where the keyword must appear in the domain name. This endpoint defaults to the start of the name.',
		displayOptions: { show: showForKeywordMode },
		options: [
			{ name: 'Anywhere', value: 'contain' },
			{ name: 'At the End', value: 'end' },
			{ name: 'At the Start', value: 'start' },
		],
		routing: { request: { qs: { position: '={{$value}}' } } },
	},
];
