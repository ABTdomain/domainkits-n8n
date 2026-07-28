import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
	ageRangeFilter,
	compositionFilter,
	excludeKeywordsFilter,
	keywordPositionProperty,
	keywordProperty,
	lengthFilter,
	newFilter,
	noHyphensFilter,
	noNumbersFilter,
	paginationProperties,
	returnAllProperties,
	sortFilter,
	tldFilter,
} from '../../../shared/filters';

const showForDeleted = {
	resource: ['deleted'],
	operation: ['search'],
};

export const deletedDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['deleted'] } },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search deleted domains',
				description:
					'Search domains that dropped and became available again. Keyword search only; there is no TLD browse mode for this type.',
				routing: {
					request: {
						method: 'GET',
						url: '/search/deleted',
					},
					output: {
						postReceive: [parseDomainKitsResponse],
					},
				},
			},
		],
		default: 'search',
	},

	keywordProperty(showForDeleted, 'crypto'),

	...returnAllProperties(showForDeleted),
	...paginationProperties(showForDeleted),

	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showForDeleted },
		options: [
			ageRangeFilter('<code>0-5</code>, <code>5-10</code>, <code>10-20</code>, <code>20+</code>'),
			compositionFilter,
			excludeKeywordsFilter,
			{
				displayName: 'Hold Status',
				name: 'hold',
				type: 'options',
				default: 'no_hold',
				description: 'Whether the domain carries a registry hold',
				options: [
					{ name: 'No Hold', value: 'no_hold' },
					{ name: 'Has Hold', value: 'has_hold' },
				],
				routing: { request: { qs: { hold: '={{$value}}' } } },
			},
			lengthFilter,
			newFilter('domains that dropped recently'),
			noHyphensFilter,
			noNumbersFilter,
			sortFilter(
				[
					{ name: 'Age (Oldest First)', value: 'age_desc' },
					{ name: 'Age (Youngest First)', value: 'age_asc' },
					{ name: 'Length (Longest First)', value: 'length_desc' },
					{ name: 'Length (Shortest First)', value: 'length_asc' },
				],
				'age_desc',
			),
			tldFilter,
		],
	},

	keywordPositionProperty(showForDeleted),
];
