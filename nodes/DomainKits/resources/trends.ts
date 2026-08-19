import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';

const showForTrends = { resource: ['trends'] };
const tldTrendOps = ['tldActive', 'tldNewly'];

export const trendsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForTrends },
		options: [
			{
				name: 'Emerging Keywords',
				value: 'kwEmerging',
				action: 'List emerging keywords',
				description: 'Keywords with the fastest growth in new registrations over 28 days',
				routing: {
					request: { method: 'GET', url: '/trends/keywords/emerging' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
			{
				name: 'Hot Keywords',
				value: 'kwHot',
				action: 'List hot keywords',
				description: 'Most-registered keywords over the last 28 days',
				routing: {
					request: { method: 'GET', url: '/trends/keywords/hot' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
			{
				name: 'Prefix Trend',
				value: 'kwPrefix',
				action: 'Get trend for a prefix',
				description: 'Trending domain prefixes with 30-day, 7-day and 48-hour registration counts',
				routing: {
					request: { method: 'GET', url: '/trends/keywords/prefix' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
			{
				name: 'TLD Active Volume',
				value: 'tldActive',
				action: 'Get active volume trend for a TLD',
				description: 'Daily total registered volume for a gTLD, with moving averages',
				routing: {
					request: { method: 'GET', url: '/trends/tlds/active' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
			{
				name: 'TLD New Registrations',
				value: 'tldNewly',
				action: 'Get new registration trend for a TLD',
				description: 'Daily new registration counts for a gTLD, with moving averages',
				routing: {
					request: { method: 'GET', url: '/trends/tlds/newly' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
		],
		default: 'tldNewly',
	},

	{
		displayName: 'TLD',
		name: 'tld',
		type: 'string',
		required: true,
		default: 'com',
		placeholder: 'com',
		description: 'The gTLD to query, comma-separated for up to 10. Only gTLDs are supported.',
		displayOptions: { show: { ...showForTrends, operation: tldTrendOps } },
		routing: { request: { qs: { tld: '={{$value}}' } } },
	},
	{
		displayName: 'Days',
		name: 'days',
		type: 'number',
		default: 30,
		typeOptions: { minValue: 1, maxValue: 3650 },
		description: 'Size of the trend window in days, 1-3650',
		displayOptions: { show: { ...showForTrends, operation: tldTrendOps } },
		routing: { request: { qs: { days: '={{$value}}' } } },
	},
];
