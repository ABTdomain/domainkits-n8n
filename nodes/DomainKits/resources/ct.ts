import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsResponse } from '../../../shared/output';

const showForCt = { resource: ['ct'] };

const certTypeOption: INodeProperties = {
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
};

const fingerprintOption: INodeProperties = {
	displayName: 'Fingerprint',
	name: 'fingerprint',
	type: 'string',
	default: '',
	placeholder: '7352ff2d7c55bbcbf6143bad085eb075...',
	description:
		'SHA-256 fingerprint of one certificate, 64 hex characters. Use instead of a domain to look up a single record.',
	routing: { request: { qs: { fingerprint: '={{$value}}' } } },
};

const issuerOption: INodeProperties = {
	displayName: 'Issuer',
	name: 'issuer',
	type: 'string',
	default: '',
	placeholder: 'R11',
	description: 'Restrict to certificates from one issuer',
	routing: { request: { qs: { issuer: '={{$value}}' } } },
};

function limitOption(maxValue: number): INodeProperties {
	return {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue },
		description: 'Max number of results to return',
		routing: { request: { qs: { limit: '={{$value}}' } } },
	};
}

const loggedAfterOption: INodeProperties = {
	displayName: 'Logged After',
	name: 'after',
	type: 'string',
	default: '',
	placeholder: 'YYYY-MM-DD',
	description:
		'Only records logged on or after this date. Use it to ask for recent activity instead of relying on the result order.',
	routing: { request: { qs: { after: '={{$value}}' } } },
};

const loggedBeforeOption: INodeProperties = {
	displayName: 'Logged Before',
	name: 'before',
	type: 'string',
	default: '',
	placeholder: 'YYYY-MM-DD',
	description: 'Only records logged on or before this date',
	routing: { request: { qs: { before: '={{$value}}' } } },
};

function ctOptions(operation: string, options: INodeProperties[]): INodeProperties {
	return {
		displayName: 'Options',
		name: 'ctOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showForCt, operation: [operation] } },
		options,
	};
}

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

	ctOptions('certs', [
		certTypeOption,
		fingerprintOption,
		issuerOption,
		limitOption(5000),
		loggedAfterOption,
		loggedBeforeOption,
	]),
	ctOptions('subdomains', [limitOption(5000), loggedAfterOption, loggedBeforeOption]),
];
