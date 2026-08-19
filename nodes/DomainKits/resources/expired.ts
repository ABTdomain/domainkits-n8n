import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import {
	compositionFilter,
	excludeKeywordsFilter,
	keywordPositionProperty,
	keywordProperty,
	lengthMinFilter,
	lengthMaxFilter,
	foundDateStartFilter,
	foundDateEndFilter,
	ageMinFilter,
	ageMaxFilter,
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
			ageMinFilter,
			ageMaxFilter,
			{
				displayName: 'Auction From',
				name: 'auction_date_start',
				type: 'string',
				default: '',
				placeholder: '2026-08-01',
				description: 'Range start for the auction date, in YYYY-MM-DD format, inclusive',
				routing: { request: { qs: { auction_date_start: '={{$value}}' } } },
			},
			{
				displayName: 'Auction To',
				name: 'auction_date_end',
				type: 'string',
				default: '',
				placeholder: '2026-08-15',
				description: 'Range end for the auction date, in YYYY-MM-DD format, inclusive',
				routing: { request: { qs: { auction_date_end: '={{$value}}' } } },
			},
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
			foundDateStartFilter('the domain entered the expired pool'),
			foundDateEndFilter('the domain entered the expired pool'),
			sortFilter(
				[
					{ name: 'Age (Oldest First)', value: 'age_desc' },
					{ name: 'Age (Youngest First)', value: 'age_asc' },
					{ name: 'Length (Longest First)', value: 'length_desc' },
					{ name: 'Length (Shortest First)', value: 'length_asc' },
					{ name: 'TLD Count (High to Low)', value: 'tld_count_desc' },
					{ name: 'TLD Count (Low to High)', value: 'tld_count_asc' },
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
