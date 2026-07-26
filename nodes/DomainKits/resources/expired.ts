import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
	compositionFilter,
	excludeKeywordsFilter,
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

const showForExpired = {
	resource: ['expired'],
	operation: ['search'],
};

const showForKeywordMode = {
	...showForExpired,
	searchMode: ['keyword'],
};

const showForTldMode = {
	...showForExpired,
	searchMode: ['tld'],
};

export const expiredDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['expired'] } },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search expired domains',
				description:
					'Search expired domains by keyword, or browse every expiring domain under a gTLD. Covers the expired, redemption, and pending delete stages.',
				routing: {
					request: {
						method: 'GET',
						url: '/search/expired',
					},
					output: {
						postReceive: [parseDomainKitsResponse],
					},
				},
			},
		],
		default: 'search',
	},

	searchModeProperty(showForExpired),
	keywordProperty(showForKeywordMode, 'tech'),
	tldProperty(showForTldMode),

	...returnAllProperties(showForExpired),
	...paginationProperties(showForExpired),

	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showForExpired },
		options: [
			{
				displayName: 'Age',
				name: 'age_range',
				type: 'multiOptions',
				default: [],
				description:
					'Age of the domain in years. Select more than one range to widen the search.',
				options: [
					{ name: '0 to 5 Years', value: '0-5' },
					{ name: '5 to 10 Years', value: '5-10' },
					{ name: '10 to 20 Years', value: '10-20' },
					{ name: '20 Years and Over', value: '20+' },
				],
				routing: { request: { qs: { age_range: '={{$value.join(",")}}' } } },
			},
			{
				displayName: 'Auction Date',
				name: 'auction_date',
				type: 'string',
				default: '',
				placeholder: 'today',
				description:
					'Filter by drop or auction date. Accepts <code>today</code>, <code>tomorrow</code>, or a date in YYYY-MM-DD format.',
				routing: { request: { qs: { auction_date: '={{$value}}' } } },
			},
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
			{
				displayName: 'Stage',
				name: 'status',
				type: 'options',
				default: 'expired',
				description:
					'Stage of the expiry lifecycle. Names move from expired to redemption to pending delete before dropping.',
				options: [
					{ name: 'Expired', value: 'expired' },
					{ name: 'Redemption', value: 'redemption' },
					{ name: 'Pending Delete', value: 'pending_delete' },
				],
				routing: { request: { qs: { status: '={{$value}}' } } },
			},
			tldFilter,
		],
	},

	keywordPositionProperty(showForKeywordMode),
];
