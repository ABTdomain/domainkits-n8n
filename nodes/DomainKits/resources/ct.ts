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
				displayName: 'TLD',
				name: 'tld',
				type: 'string',
				default: '',
				placeholder: 'com',
				description: 'Restrict search results to one TLD, without a leading dot',
				routing: { request: { qs: { tld: '={{$value}}' } } },
			},
		],
	},
];
