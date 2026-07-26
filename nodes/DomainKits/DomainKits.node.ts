import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { expiredDescription } from './resources/expired';

const resources = [
	{
		name: 'Expired Domain',
		value: 'expired',
		description: 'Search expired, redemption, and pending delete domains',
		properties: expiredDescription,
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
		description: 'Search expired domains with the DomainKits API',
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
				default: 'expired',
			},
			...resources.flatMap((resource) => resource.properties),
		],
	};
}
