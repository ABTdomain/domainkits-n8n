import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
	compositionFilter,
	excludeKeywordsFilter,
	hasSaleFilter,
	keywordPositionProperty,
	keywordProperty,
	lengthMinFilter,
	lengthMaxFilter,
	paginationProperties,
	createDateStartFilter,
	createDateEndFilter,
	returnAllProperties,
	searchModeProperty,
	sortFilter,
	tldFilter,
	tldProperty,
} from '../../../shared/filters';

const showForNrds = {
	resource: ['nrd'],
	operation: ['search'],
};

const showForKeywordMode = {
	...showForNrds,
	searchMode: ['keyword'],
};

const showForTldMode = {
	...showForNrds,
	searchMode: ['tld'],
};

const showForLive = {
	resource: ['nrd'],
	operation: ['searchLive'],
};

export const nrdDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['nrd'] } },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search newly registered domains',
				description:
					'Search newly registered domains by keyword, or browse every new registration under a gTLD. Reads the zone files, so a name appears once the zone publishes it and stays available for 60 days.',
				routing: {
					request: {
						method: 'GET',
						url: '/search/nrds',
					},
					output: {
						postReceive: [parseDomainKitsResponse],
					},
				},
			},
			{
				name: 'Search Live',
				value: 'searchLive',
				action: 'Search the live newly registered feed',
				description:
					'Search the last three days with live updates: names registered hours ago that the daily search cannot show yet. Covers .ai and .io alongside the generic TLDs. TLD takes a single value here.',
				routing: {
					request: {
						method: 'GET',
						url: '/search/nrds-live',
					},
					output: {
						postReceive: [parseDomainKitsResponse],
					},
				},
			},
		],
		default: 'search',
	},

	searchModeProperty(showForNrds),
	keywordProperty(showForKeywordMode, 'dental'),
	tldProperty(showForTldMode),

	...returnAllProperties(showForNrds),
	...paginationProperties(showForNrds),

	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showForNrds },
		options: [
			compositionFilter,
			excludeKeywordsFilter,
			hasSaleFilter,
			lengthMinFilter,
			lengthMaxFilter,
			createDateStartFilter,
			createDateEndFilter,
			{
				displayName: 'Term Min (Years)',
				name: 'period_min',
				type: 'number',
				default: 1,
				typeOptions: { minValue: 1, maxValue: 10 },
				description:
					'Minimum registration term in years. Multi-year registrations often signal a more serious registrant.',
				routing: { request: { qs: { period_min: '={{$value}}' } } },
			},
			{
				displayName: 'Term Max (Years)',
				name: 'period_max',
				type: 'number',
				default: 10,
				typeOptions: { minValue: 1, maxValue: 10 },
				description: 'Maximum registration term in years',
				routing: { request: { qs: { period_max: '={{$value}}' } } },
			},
			sortFilter(
				[
					{ name: 'Alphabetical', value: 'alpha' },
					{ name: 'Length (Longest First)', value: 'length_desc' },
					{ name: 'Length (Shortest First)', value: 'length_asc' },
					{ name: 'Registered (Newest First)', value: 'reg_date_desc' },
					{ name: 'Registered (Oldest First)', value: 'reg_date_asc' },
					{ name: 'Term (Longest First)', value: 'period_desc' },
					{ name: 'Term (Shortest First)', value: 'period_asc' },
					{ name: 'TLD Count (High to Low)', value: 'tld_count_desc' },
					{ name: 'TLD Count (Low to High)', value: 'tld_count_asc' },
				],
				'reg_date_desc',
			),
			tldFilter,
		],
	},

	keywordProperty(showForLive, 'dental'),
	...paginationProperties(showForLive),

	{
		displayName: 'Filters',
		name: 'liveFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showForLive },
		options: [
			compositionFilter,
			excludeKeywordsFilter,
			lengthMinFilter,
			lengthMaxFilter,
			createDateStartFilter,
			createDateEndFilter,
			sortFilter(
				[
					{ name: 'Alphabetical (A-Z)', value: 'alpha' },
					{ name: 'Alphabetical (Z-A)', value: 'alpha_desc' },
					{ name: 'Length (Longest First)', value: 'length_desc' },
					{ name: 'Length (Shortest First)', value: 'length_asc' },
					{ name: 'Registered (Newest First)', value: 'reg_date_desc' },
					{ name: 'Registered (Oldest First)', value: 'reg_date_asc' },
				],
				'reg_date_desc',
			),
			tldFilter,
		],
	},

	keywordPositionProperty(showForKeywordMode),
	keywordPositionProperty(showForLive),
];
