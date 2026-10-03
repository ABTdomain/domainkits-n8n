import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';

const showForHostname = { resource: ['hostname'] };

export const hostnameDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForHostname },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search hostnames by keyword',
				description: 'Hostnames seen in certificates within a time window whose name contains the keyword',
				routing: {
					request: { method: 'GET', url: '/search/hostname' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
		],
		default: 'search',
	},

	{
		displayName: 'Keyword',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'paypal',
		description: 'Text the hostname must contain, 3 to 64 characters',
		displayOptions: { show: { ...showForHostname, operation: ['search'] } },
		routing: { request: { qs: { q: '={{$value}}' } } },
	},

	{
		displayName: 'Options',
		name: 'hostnameOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showForHostname, operation: ['search'] } },
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				typeOptions: { minValue: 1, maxValue: 500 },
				description: 'Max number of results to return',
				routing: { request: { qs: { limit: '={{$value}}' } } },
			},
			{
				displayName: 'Match In',
				name: 'field',
				type: 'options',
				default: 'reg',
				description: 'Where the keyword must appear. Leave unset to match anywhere in the hostname.',
				options: [
					{ name: 'Registered Domain', value: 'reg' },
					{ name: 'Subdomain', value: 'sub' },
				],
				routing: { request: { qs: { field: '={{$value}}' } } },
			},
			{
				displayName: 'Since',
				name: 'since',
				type: 'string',
				default: '',
				placeholder: '24h',
				description:
					'Start of the time window, for example 24h or 2026-10-03T00:00:00Z. Defaults to 6 hours ago; the window spans at most 24 hours.',
				routing: { request: { qs: { since: '={{$value}}' } } },
			},
			{
				displayName: 'TLD',
				name: 'tld',
				type: 'string',
				default: '',
				placeholder: 'com',
				description: 'Restrict to one public suffix, for example com or co.uk',
				routing: { request: { qs: { tld: '={{$value}}' } } },
			},
			{
				displayName: 'TLD Type',
				name: 'tld_type',
				type: 'options',
				default: 'gtld',
				description: 'Restrict to generic or country-code TLDs',
				options: [
					{ name: 'ccTLD', value: 'cctld' },
					{ name: 'gTLD', value: 'gtld' },
				],
				routing: { request: { qs: { tld_type: '={{$value}}' } } },
			},
			{
				displayName: 'Until',
				name: 'until',
				type: 'string',
				default: '',
				placeholder: '2026-10-03T12:00:00Z',
				description: 'End of the time window. Defaults to now.',
				routing: { request: { qs: { until: '={{$value}}' } } },
			},
		],
	},
];
