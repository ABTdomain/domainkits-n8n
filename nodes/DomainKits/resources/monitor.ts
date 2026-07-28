import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';

const showForMonitor = { resource: ['monitor'] };

export const monitorDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForMonitor },
		options: [
			{
				name: 'Domain Changes',
				value: 'changes',
				action: 'List recent domain changes',
				description:
					'Domains whose registration changed in the last 7 days: transfers, nameserver changes, expiries and new registrations',
				routing: {
					request: { method: 'GET', url: '/monitor/changes' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
		],
		default: 'changes',
	},

	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showForMonitor },
		options: [
			{
				displayName: 'Change Reason',
				name: 'reason',
				type: 'string',
				default: '',
				placeholder: 'transfer',
				description: 'Restrict to one change reason, such as transfer or nameserver change',
				routing: { request: { qs: { reason: '={{$value}}' } } },
			},
			{
				displayName: 'Digits Only',
				name: 'type',
				type: 'options',
				default: 'all_number',
				description: 'Restrict to names made up only of digits',
				options: [{ name: 'Numbers Only', value: 'all_number' }],
				routing: { request: { qs: { type: '={{$value}}' } } },
			},
			{
				displayName: 'Keyword',
				name: 'keyword',
				type: 'string',
				default: '',
				description: 'Substring the domain names must contain',
				routing: { request: { qs: { keyword: '={{$value}}' } } },
			},
			{
				displayName: 'Length',
				name: 'length',
				type: 'number',
				default: 0,
				typeOptions: { minValue: 0 },
				description: 'Exact length of the domain name, excluding the TLD',
				routing: { request: { qs: { length: '={{$value}}' } } },
			},
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
				displayName: 'No Numbers',
				name: 'no_number',
				type: 'boolean',
				default: true,
				description: 'Whether to exclude domains containing digits',
				routing: { request: { qs: { no_number: '={{$value}}' } } },
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				typeOptions: { minValue: 0 },
				description: 'Number of results to skip, for paging',
				routing: { request: { qs: { offset: '={{$value}}' } } },
			},
			{
				displayName: 'TLD',
				name: 'tld',
				type: 'string',
				default: '',
				placeholder: 'com',
				description: 'Restrict to one gTLD, without a leading dot',
				routing: { request: { qs: { tld: '={{$value}}' } } },
			},
		],
	},
];
