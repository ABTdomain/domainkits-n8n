import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';
import { compositionFilter } from '../../../shared/filters';

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
					'Change events from the last 7 days: transfers, nameserver changes, expiries and new registrations. Each row is one event.',
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
				type: 'options',
				default: 'nameserver_change',
				description: 'Restrict to one change reason',
				options: [
					{ name: 'Domain Expired', value: 'domain_expired' },
					{ name: 'Domain Transfer', value: 'domain_transfer' },
					{ name: 'Nameserver Change', value: 'nameserver_change' },
					{ name: 'New Registration', value: 'new_registration' },
				],
				routing: { request: { qs: { reason: '={{$value}}' } } },
			},
			compositionFilter,
			{
				displayName: 'Keyword',
				name: 'keyword',
				type: 'string',
				default: '',
				description: 'Substring the name portion must contain, minimum 2 characters',
				routing: { request: { qs: { query: '={{$value}}' } } },
			},
			{
				displayName: 'Length Max',
				name: 'length_max',
				type: 'number',
				default: 63,
				typeOptions: { minValue: 1, maxValue: 63 },
				description: 'Maximum length of the name portion, excluding the TLD',
				routing: { request: { qs: { length_max: '={{$value}}' } } },
			},
			{
				displayName: 'Length Min',
				name: 'length_min',
				type: 'number',
				default: 1,
				typeOptions: { minValue: 1, maxValue: 63 },
				description: 'Minimum length of the name portion, excluding the TLD',
				routing: { request: { qs: { length_min: '={{$value}}' } } },
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
				displayName: 'Observed From',
				name: 'found_date_start',
				type: 'string',
				default: '',
				placeholder: '2026-08-15',
				description:
					'Range start for the date the change was observed, in YYYY-MM-DD format, inclusive. The window holds 7 days.',
				routing: { request: { qs: { found_date_start: '={{$value}}' } } },
			},
			{
				displayName: 'Observed To',
				name: 'found_date_end',
				type: 'string',
				default: '',
				placeholder: '2026-08-19',
				description: 'Range end for the date the change was observed, in YYYY-MM-DD format, inclusive',
				routing: { request: { qs: { found_date_end: '={{$value}}' } } },
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
				description: 'Restrict to gTLDs, without a leading dot, comma-separated for several',
				routing: { request: { qs: { tld: '={{$value}}' } } },
			},
		],
	},
];
