import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
	compositionFilter,
	excludeKeywordsFilter,
	hasSaleFilter,
	keywordPositionProperty,
	keywordProperty,
	lengthFilter,
	noHyphensFilter,
	noNumbersFilter,
	paginationProperties,
	regDateFilter,
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
				action: 'Search newly registered domains seen in certificate logs',
				description:
					'Search names from the last three days that were seen in Certificate Transparency logs before the zone files carried them. Reaches names the zone based search cannot show yet, and covers .ai and .io alongside the generic TLDs.',
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
			lengthFilter,
			noHyphensFilter,
			noNumbersFilter,
			{
				displayName: 'Registered Within',
				name: 'days_range',
				type: 'options',
				default: '0-10',
				description: 'How recently the domain was registered, in days',
				options: [
					{ name: '0 to 10 Days', value: '0-10' },
					{ name: '10 to 20 Days', value: '10-20' },
					{ name: '20 Days and Over', value: '20+' },
				],
				routing: { request: { qs: { days_range: '={{$value}}' } } },
			},
			regDateFilter,
			{
				displayName: 'Registration Term',
				name: 'period',
				type: 'options',
				default: '1',
				description:
					'Registration term in years. Multi-year registrations often signal a more serious registrant.',
				options: [
					{ name: '1 Year', value: '1' },
					{ name: '2 to 5 Years', value: '2-5' },
					{ name: '6 Years and Over', value: '6+' },
				],
				routing: { request: { qs: { period: '={{$value}}' } } },
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
					{ name: 'TLD Count (High to Low)', value: 'tld_counter_desc' },
					{ name: 'TLD Count (Low to High)', value: 'tld_counter_asc' },
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
			lengthFilter,
			noHyphensFilter,
			noNumbersFilter,
			{
				displayName: 'Seen Within',
				name: 'days_range',
				type: 'options',
				default: '0-10',
				description: 'How recently the name was seen, in days. The live feed holds three days.',
				options: [
					{ name: '0 to 10 Days', value: '0-10' },
					{ name: '10 to 20 Days', value: '10-20' },
					{ name: '20 Days and Over', value: '20+' },
				],
				routing: { request: { qs: { days_range: '={{$value}}' } } },
			},
			sortFilter(
				[
					{ name: 'Alphabetical', value: 'alpha' },
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
