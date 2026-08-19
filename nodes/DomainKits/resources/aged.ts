import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
	ageMinFilter,
	ageMaxFilter,
	compositionFilter,
	excludeKeywordsFilter,
	hasSaleFilter,
	keywordPositionProperty,
	keywordProperty,
	lengthMinFilter,
	lengthMaxFilter,
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
			ageMinFilter,
			ageMaxFilter,
			compositionFilter,
			excludeKeywordsFilter,
			hasSaleFilter,
			lengthMinFilter,
			lengthMaxFilter,
			sortFilter(
				[
					{ name: 'Age (Oldest First)', value: 'age_desc' },
					{ name: 'Age (Youngest First)', value: 'age_asc' },
					{ name: 'Length (Longest First)', value: 'length_desc' },
					{ name: 'Length (Shortest First)', value: 'length_asc' },
					{ name: 'Registered (Newest First)', value: 'reg_date_desc' },
					{ name: 'Registered (Oldest First)', value: 'reg_date_asc' },
					{ name: 'TLD Count (High to Low)', value: 'tld_count_desc' },
					{ name: 'TLD Count (Low to High)', value: 'tld_count_asc' },
				],
				'age_desc',
			),
			tldFilter,
		],
	},

	keywordPositionProperty(showForKeywordMode),
];
