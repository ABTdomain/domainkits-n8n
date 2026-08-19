import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
	compositionFilter,
	excludeKeywordsFilter,
	keywordProperty,
	keywordPositionProperty,
	lengthMinFilter,
	lengthMaxFilter,
	listedWithinFilter,
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
	keywordProperty(showForKeywordMode, 'shop'),
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
			lengthMinFilter,
			lengthMaxFilter,
			platformFilter,
			listedWithinFilter,
			sortFilter(
				[
					{ name: 'Alphabetical', value: 'alpha' },
					{ name: 'Length (Longest First)', value: 'length_desc' },
					{ name: 'Length (Shortest First)', value: 'length_asc' },
					{ name: 'TLD Count (High to Low)', value: 'tld_count_desc' },
					{ name: 'TLD Count (Low to High)', value: 'tld_count_asc' },
				],
				'length_asc',
			),
			tldFilter,
		],
	},

	keywordPositionProperty(showForKeywordMode),
];
