import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
	compositionFilter,
	keywordPositionProperty,
	keywordProperty,
	hasSaleFilter,
	lengthMinFilter,
	lengthMaxFilter,
	paginationProperties,
	returnAllProperties,
	searchModeProperty,
	sortFilter,
	tldFilter,
	tldProperty,
} from '../../../shared/filters';

const showForActive = {
	resource: ['active'],
	operation: ['search'],
};

const showForKeywordMode = {
	...showForActive,
	searchMode: ['keyword'],
};

const showForTldMode = {
	...showForActive,
	searchMode: ['tld'],
};

export const activeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['active'] } },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search active domains',
				description:
					'Search currently registered domains by keyword, or browse every active domain under a gTLD',
				routing: {
					request: {
						method: 'GET',
						url: '/search/active',
					},
					output: {
						postReceive: [parseDomainKitsResponse],
					},
				},
			},
		],
		default: 'search',
	},

	searchModeProperty(showForActive),
	keywordProperty(showForKeywordMode, 'cloud'),
	tldProperty(showForTldMode),

	...returnAllProperties(showForActive),
	...paginationProperties(showForActive),

	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showForActive },
		options: [
			compositionFilter,
			hasSaleFilter,
			lengthMinFilter,
			lengthMaxFilter,
			sortFilter(
				[
					{ name: 'Alphabetical', value: 'alpha' },
					{ name: 'Length (Longest First)', value: 'length_desc' },
					{ name: 'Length (Shortest First)', value: 'length_asc' },
				],
				'length_asc',
			),
			tldFilter,
		],
	},

	keywordPositionProperty(showForKeywordMode),
];
