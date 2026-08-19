import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
	ageMinFilter,
	ageMaxFilter,
	compositionFilter,
	excludeKeywordsFilter,
	keywordPositionProperty,
	keywordProperty,
	lengthMinFilter,
	lengthMaxFilter,
	foundDateStartFilter,
	foundDateEndFilter,
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
					'Search domains that dropped and became available again by keyword',
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
			ageMinFilter,
			ageMaxFilter,
			compositionFilter,
			excludeKeywordsFilter,
			{
				displayName: 'Hold Status',
				name: 'has_hold',
				type: 'options',
				default: 'false',
				description: 'Whether the domain carries a registry hold',
				options: [
					{ name: 'No Hold', value: 'false' },
					{ name: 'Has Hold', value: 'true' },
				],
				routing: { request: { qs: { has_hold: '={{$value}}' } } },
			},
			lengthMinFilter,
			lengthMaxFilter,
			foundDateStartFilter('the drop was observed'),
			foundDateEndFilter('the drop was observed'),
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
