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
				description: 'Registration trend for names starting with a given prefix',
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
		description: 'The gTLD to query, without a leading dot. Only gTLDs are supported.',
		displayOptions: { show: { ...showForTrends, operation: tldTrendOps } },
		routing: { request: { qs: { tld: '={{$value}}' } } },
	},
	{
		displayName: 'Days',
		name: 'days',
		type: 'options',
		default: 30,
		description: 'Size of the trend window in days',
		displayOptions: { show: { ...showForTrends, operation: tldTrendOps } },
		options: [
			{ name: '7', value: 7 },
			{ name: '14', value: 14 },
			{ name: '30', value: 30 },
			{ name: '60', value: 60 },
			{ name: '90', value: 90 },
			{ name: '180', value: 180 },
		],
		routing: { request: { qs: { days: '={{$value}}' } } },
	},
	{
		displayName: 'Prefix',
		name: 'prefix',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'ai',
		description: 'Name prefix to get the registration trend for',
		displayOptions: { show: { ...showForTrends, operation: ['kwPrefix'] } },
		routing: { request: { qs: { prefix: '={{$value}}' } } },
	},
];
