import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { accountDescription } from './resources/account';
import { activeDescription } from './resources/active';
import { agedDescription } from './resources/aged';
import { ctDescription } from './resources/ct';
import { deletedDescription } from './resources/deleted';
import { expiredDescription } from './resources/expired';
import { lookupDescription } from './resources/lookup';
import { marketDescription } from './resources/market';
import { monitorDescription } from './resources/monitor';
import { nrdDescription } from './resources/nrds';
import { trendsDescription } from './resources/trends';

const resources = [
	{
		name: 'Account',
		value: 'account',
		description: 'Quota and usage for your key',
		properties: accountDescription,
	},
	{
		name: 'Active Domain',
		value: 'active',
		description: 'Search currently registered domains',
		properties: activeDescription,
	},
	{
		name: 'Aged Domain',
		value: 'aged',
		description: 'Search domains with 5 to 20+ years of history',
		properties: agedDescription,
	},
	{
		name: 'Certificate Transparency',
		value: 'ct',
		description: 'Subdomains, certificates and hostname search from CT logs',
		properties: ctDescription,
	},
	{
		name: 'Deleted Domain',
		value: 'deleted',
		description: 'Search dropped domains that became available again',
		properties: deletedDescription,
	},
	{
		name: 'Domain Lookup',
		value: 'lookup',
		description: 'WHOIS, DNS, safety, typosquat and other single-domain lookups',
		properties: lookupDescription,
	},
	{
		name: 'Domain Monitor',
		value: 'monitor',
		description: 'Domains whose registration changed in the last 7 days',
		properties: monitorDescription,
	},
	{
		name: 'Expired Domain',
		value: 'expired',
		description: 'Search expired, redemption, and pending delete domains',
		properties: expiredDescription,
	},
	{
		name: 'Marketplace Domain',
		value: 'market',
		description: 'Search domains listed for sale on marketplaces',
		properties: marketDescription,
	},
	{
		name: 'Newly Registered Domain',
		value: 'nrd',
		description: 'Search domains registered in the last 60 days',
		properties: nrdDescription,
	},
	{
		name: 'Trend',
		value: 'trends',
		description: 'TLD registration volumes and keyword trends',
		properties: trendsDescription,
	},
];

export class DomainKits implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DomainKits',
		name: 'domainKits',
		icon: 'file:domainkits.svg' as const,
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Query domain data with the DomainKits API',
		defaults: {
			name: 'DomainKits',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'domainKitsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://premium-api.domainkits.com/api/v1',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: resources.map(({ name, value, description }) => ({
					name,
					value,
					description,
				})),
				default: 'nrd',
			},
			...resources.flatMap((resource) => resource.properties),
		],
	};
}
