import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsObject, parseDomainKitsResponse } from '../../../shared/output';

const showForLookup = { resource: ['lookup'] };

function domainProperty(operations: string[]): INodeProperties {
	return {
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com',
		description: 'Full domain name to look up. Works on any domain, ccTLDs included.',
		displayOptions: { show: { ...showForLookup, operation: operations } },
		routing: { request: { qs: { domain: '={{$value}}' } } },
	};
}

export const lookupDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForLookup },
		options: [
			{
				name: 'DNS Records',
				value: 'dns',
				action: 'Get DNS records',
				description: 'Resolve every record type for a domain at request time',
				routing: {
					request: { method: 'GET', url: '/dns' },
					output: { postReceive: [parseDomainKitsObject] },
				},
			},
			{
				name: 'DNS Records (Bulk)',
				value: 'dnsBulk',
				action: 'Get DNS records for many domains',
				description:
					'Resolve nameservers for up to 20 domains in one request, with a for-sale or parking label where the nameservers identify one',
				routing: {
					request: { method: 'POST', url: '/bulk/dns' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
			{
				name: 'EPP Status Guide',
				value: 'statusGuide',
				action: 'Explain an EPP status code',
				description: 'Explain what a domain status code such as clientHold means',
				routing: {
					request: { method: 'GET', url: '/status-guide' },
					output: { postReceive: [parseDomainKitsObject] },
				},
			},
			{
				name: 'IP Lookup',
				value: 'ipLookup',
				action: 'Look up an IP address',
				description: 'Geolocation, ASN and network operator for an IP address or hostname',
				routing: {
					request: { method: 'GET', url: '/ip-lookup' },
					output: { postReceive: [parseDomainKitsObject] },
				},
			},
			{
				name: 'Registrar Lookup',
				value: 'registrar',
				action: 'Look up a registrar',
				description: 'Find accredited registrars by name, with RDAP endpoints',
				routing: {
					request: { method: 'GET', url: '/registrar' },
					output: { postReceive: [parseDomainKitsObject] },
				},
			},
			{
				name: 'Reverse Nameserver',
				value: 'nsReverse',
				action: 'List domains on a nameserver',
				description: 'List every indexed domain that resolves through a nameserver',
				routing: {
					request: { method: 'GET', url: '/ns-reverse' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
			{
				name: 'Safety Check',
				value: 'safety',
				action: 'Check domain safety',
				description: 'Google Safe Browsing verdict and search index presence for a domain',
				routing: {
					request: { method: 'GET', url: '/safety' },
					output: { postReceive: [parseDomainKitsObject] },
				},
			},
			{
				name: 'TLD Availability',
				value: 'tldCheck',
				action: 'Check availability of a name',
				description: 'Check whether a name is registered across popular TLDs',
				routing: {
					request: { method: 'GET', url: '/tld-check' },
					output: { postReceive: [parseDomainKitsObject] },
				},
			},
			{
				name: 'Typosquat Scan',
				value: 'typosquat',
				action: 'Scan for typosquats',
				description: 'Generate 13 classes of lookalike variants of a domain and report which are registered',
				routing: {
					request: { method: 'GET', url: '/typosquat' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
			{
				name: 'WHOIS',
				value: 'whois',
				action: 'Get WHOIS record',
				description:
					'Registrar, dates, status codes and nameservers for a domain. No registrant personal data is returned.',
				routing: {
					request: { method: 'GET', url: '/whois' },
					output: { postReceive: [parseDomainKitsObject] },
				},
			},
			{
				name: 'WHOIS (Bulk)',
				value: 'whoisBulk',
				action: 'Get WHOIS records for many domains',
				description:
					'Registrar, dates, status codes and nameservers for up to 30 domains in one request. No registrant personal data is returned.',
				routing: {
					request: { method: 'POST', url: '/bulk/whois' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
		],
		default: 'whois',
	},

	domainProperty(['dns', 'safety', 'typosquat', 'whois']),

	{
		displayName: 'Domains',
		name: 'domains',
		type: 'string',
		required: true,
		default: '',
		placeholder: '={{ $json.domains }}',
		description:
			'Domains to look up in one request. Accepts an array from an earlier node or a comma-separated list. Aggregate the items first so this node runs once for the whole batch instead of once per domain.',
		displayOptions: { show: { ...showForLookup, operation: ['dnsBulk', 'whoisBulk'] } },
		routing: {
			send: {
				type: 'body',
				property: 'domains',
				value:
					'={{ Array.isArray($value) ? $value : String($value).split(",").map(d => d.trim()).filter(Boolean) }}',
			},
		},
	},

	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		placeholder: '8.8.8.8',
		description: 'IP address or hostname to look up',
		displayOptions: { show: { ...showForLookup, operation: ['ipLookup'] } },
		routing: { request: { qs: { query: '={{$value}}' } } },
	},
	{
		displayName: 'Registrar Name',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'godaddy',
		description: 'Registrar name or fragment to search for',
		displayOptions: { show: { ...showForLookup, operation: ['registrar'] } },
		routing: { request: { qs: { query: '={{$value}}' } } },
	},
	{
		displayName: 'Status Code',
		name: 'query',
		type: 'string',
		default: '',
		placeholder: 'clientHold',
		description: 'EPP status code to explain. Leave empty to list every code.',
		displayOptions: { show: { ...showForLookup, operation: ['statusGuide'] } },
		routing: { request: { qs: { query: '={{$value}}' } } },
	},
	{
		displayName: 'Name Prefix',
		name: 'prefix',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'yourbrand',
		description: 'The name to check across TLDs, without a dot or TLD',
		displayOptions: { show: { ...showForLookup, operation: ['tldCheck'] } },
		routing: { request: { qs: { prefix: '={{$value}}' } } },
	},
	{
		displayName: 'Nameserver',
		name: 'ns',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'ns1.example.com',
		description: 'Nameserver hostname to reverse-look up',
		displayOptions: { show: { ...showForLookup, operation: ['nsReverse'] } },
		routing: { request: { qs: { ns: '={{$value}}' } } },
	},

	{
		displayName: 'Options',
		name: 'nsReverseOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showForLookup, operation: ['nsReverse'] } },
		options: [
			{
				displayName: 'Composition',
				name: 'type',
				type: 'options',
				default: 'all_alpha',
				description: 'Restrict by the characters the name is made of',
				options: [
					{
						name: 'Letters Only',
						value: 'all_alpha',
						routing: { request: { qs: { all_alpha: 'true' } } },
					},
					{
						name: 'Numbers Only',
						value: 'all_number',
						routing: { request: { qs: { all_number: 'true' } } },
					},
				],
			},
			{
				displayName: 'Keyword',
				name: 'keyword',
				type: 'string',
				default: '',
				description: 'Substring the name portion must contain, minimum 2 characters',
				routing: { request: { qs: { query: '={{$value}}' } } },
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
				description: 'Restrict results to one gTLD, without a leading dot',
				routing: { request: { qs: { tld: '={{$value}}' } } },
			},
		],
	},

	{
		displayName: 'Options',
		name: 'typosquatOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showForLookup, operation: ['typosquat'] } },
		options: [
			{
				displayName: 'Registration Status',
				name: 'registered',
				type: 'options',
				default: 'true',
				description: 'Keep only registered or only unregistered variants; the default response carries both',
				options: [
					{ name: 'Registered Only', value: 'true' },
					{ name: 'Unregistered Only', value: 'false' },
				],
				routing: { request: { qs: { registered: '={{$value}}' } } },
			},
			{
				displayName: 'Include WHOIS',
				name: 'whois',
				type: 'boolean',
				default: false,
				description: 'Whether to attach a WHOIS summary to each registered variant',
				routing: { request: { qs: { whois: '={{$value}}' } } },
			},
		],
	},
];
