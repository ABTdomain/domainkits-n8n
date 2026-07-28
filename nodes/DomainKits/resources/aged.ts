import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
	ageRangeFilter,
	compositionFilter,
	excludeKeywordsFilter,
	hasSaleFilter,
	keywordPositionProperty,
	keywordProperty,
	lengthFilter,
	noHyphensFilter,
	noNumbersFilter,
	paginationProperties,
	returnAllProperties,
	searchModeProperty,
	sortFilter,
	tldFilter,
	tldProperty,
} from '../../../shared/filters';

const showForAged = {
	resource: ['aged'],
	operation: ['search'],
};

const showForKeywordMode = {
	...showForAged,
	searchMode: ['keyword'],
};

const showForTldMode = {
	...showForAged,
	searchMode: ['tld'],
};

export const agedDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['aged'] } },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search aged domains',
				description:
					'Search registered domains with 5 to 20+ years of history by keyword, or browse every aged domain under a gTLD',
				routing: {
					request: {
						method: 'GET',
						url: '/search/aged',
					},
					output: {
						postReceive: [parseDomainKitsResponse],
					},
				},
			},
		],
		default: 'search',
	},

	searchModeProperty(showForAged),
	keywordProperty(showForKeywordMode, 'travel'),
	tldProperty(showForTldMode),

	...returnAllProperties(showForAged),
	...paginationProperties(showForAged),

	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showForAged },
		options: [
			ageRangeFilter('<code>5-10</code>, <code>10-15</code>, <code>15-20</code>, <code>20+</code>'),
			compositionFilter,
			excludeKeywordsFilter,
			hasSaleFilter,
			lengthFilter,
			noHyphensFilter,
			noNumbersFilter,
			sortFilter(
				[
					{ name: 'Age (Oldest First)', value: 'age_desc' },
					{ name: 'Age (Youngest First)', value: 'age_asc' },
					{ name: 'Alphabetical', value: 'alpha' },
					{ name: 'Length (Longest First)', value: 'length_desc' },
					{ name: 'Length (Shortest First)', value: 'length_asc' },
					{ name: 'TLD Count (High to Low)', value: 'tld_counter_desc' },
					{ name: 'TLD Count (Low to High)', value: 'tld_counter_asc' },
				],
				'age_desc',
			),
			tldFilter,
		],
	},

	keywordPositionProperty(showForKeywordMode),
];
