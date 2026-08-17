import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';

const showForCt = { resource: ['ct'] };

export const ctDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForCt },
		options: [
			{
				name: 'Certificates',
				value: 'certs',
				action: 'List certificates for a domain',
				description: 'List certificates issued for a domain from Certificate Transparency logs',
				routing: {
					request: { method: 'GET', url: '/ct/certs' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search certificate transparency logs',
				description: 'Search hostnames observed in Certificate Transparency logs by keyword',
				routing: {
					request: { method: 'GET', url: '/ct/search' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
			{
				name: 'Subdomains',
				value: 'subdomains',
				action: 'List subdomains of a domain',
				description: 'List subdomains observed in Certificate Transparency logs',
				routing: {
					request: { method: 'GET', url: '/ct/subdomains' },
					output: { postReceive: [parseDomainKitsResponse] },
				},
			},
		],
		default: 'subdomains',
	},

	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com',
		description: 'Domain to inspect. Works on any domain, ccTLDs included.',
		displayOptions: { show: { ...showForCt, operation: ['certs', 'subdomains'] } },
		routing: { request: { qs: { domain: '={{$value}}' } } },
	},
	{
		displayName: 'Keyword',
		name: 'keyword',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'login',
		description: 'Search keyword, minimum 3 characters',
		displayOptions: { show: { ...showForCt, operation: ['search'] } },
		routing: { request: { qs: { keyword: '={{$value}}' } } },
	},
	{
		displayName: 'Match Against',
		name: 'field',
		type: 'options',
		default: 'reg',
		description:
			'Where the keyword has to appear. Registered domain returns every hostname under a matching registration, so one busy site can fill the result set. Subdomain only skips those and leaves the cases where the keyword sits in front of an unrelated registration.',
		displayOptions: { show: { ...showForCt, operation: ['search'] } },
		options: [
			{ name: 'Full Hostname', value: 'domain' },
			{ name: 'Registered Domain', value: 'reg' },
			{ name: 'Subdomain Only', value: 'sld' },
		],
		routing: { request: { qs: { field: '={{$value}}' } } },
	},

	{
		displayName: 'Options',
		name: 'ctOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showForCt },
		options: [
			{
				displayName: 'Certificate Type',
				name: 'cert_type',
				type: 'options',
				default: 'DV',
				description: 'Validation level of the certificate',
				options: [
					{ name: 'DV', value: 'DV' },
					{ name: 'EV', value: 'EV' },
					{ name: 'OV', value: 'OV' },
				],
				routing: { request: { qs: { cert_type: '={{$value}}' } } },
			},
			{
				displayName: 'Fingerprint',
				name: 'fingerprint',
				type: 'string',
				default: '',
				placeholder: '7352ff2d7c55bbcbf6143bad085eb075...',
				description:
					'SHA-256 fingerprint of one certificate, 64 hex characters. Use instead of a domain to look up a single record.',
				routing: { request: { qs: { fingerprint: '={{$value}}' } } },
			},
			{
				displayName: 'Issuer',
				name: 'issuer',
				type: 'string',
				default: '',
				placeholder: 'R11',
				description: 'Restrict to certificates from one issuer',
				routing: { request: { qs: { issuer: '={{$value}}' } } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				typeOptions: { minValue: 1, maxValue: 5000 },
				description: 'Max number of results to return',
				routing: { request: { qs: { limit: '={{$value}}' } } },
			},
			{
				displayName: 'Logged After',
				name: 'after',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description:
					'Only records logged on or after this date. Use it to ask for recent activity instead of relying on the result order.',
				routing: { request: { qs: { after: '={{$value}}' } } },
			},
			{
				displayName: 'Logged Before',
				name: 'before',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'Only records logged on or before this date',
				routing: { request: { qs: { before: '={{$value}}' } } },
			},
			{
				displayName: 'Scope',
				name: 'scope',
				type: 'options',
				default: 'valid',
				description:
					'How far back to read. Current period covers the running half year and answers quickly. Full history reaches back to 2020.',
				options: [
					{ name: 'Current Period', value: 'valid' },
					{ name: 'Full History', value: 'all' },
				],
				routing: { request: { qs: { scope: '={{$value}}' } } },
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				default: 'newest',
				description: 'Order of the returned records',
				options: [
					{ name: 'Last Logged', value: 'newest' },
					{ name: 'Latest Expiry', value: 'latest' },
				],
				routing: { request: { qs: { sort: '={{$value}}' } } },
			},
			{
				displayName: 'TLD',
				name: 'tld',
				type: 'string',
				default: '',
				placeholder: 'com',
				description:
					'Restrict search results to one TLD, without a leading dot. Search covers generic TLDs; two letter country TLDs are not returned.',
				routing: { request: { qs: { tld: '={{$value}}' } } },
			},
		],
	},
];
