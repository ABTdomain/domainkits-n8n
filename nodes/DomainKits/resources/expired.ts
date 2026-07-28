import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
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
				type: 'string',
				default: '',
				placeholder: '10-20',
				description:
					'Age of the domain in years. Accepts a preset band (<code>0-5</code>, <code>5-10</code>, <code>10-20</code>, <code>20+</code>), an exact age (<code>25</code>), or a range (<code>20-25</code>, inclusive of both ends). Combine with a comma to widen the search: <code>0-5,20+</code>.',
				routing: { request: { qs: { age_range: '={{$value}}' } } },
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
			newFilter(
				'domains that entered the expired pool recently. Applies to the expired stage only',
			),
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
