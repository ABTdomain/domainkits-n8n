import type { INodeProperties } from 'n8n-workflow';
import { parseDomainKitsObject } from '../../../shared/output';

const showForAccount = { resource: ['account'] };

export const accountDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForAccount },
		options: [
			{
				name: 'Usage',
				value: 'usage',
				action: 'Get account usage',
				description:
					'Per-endpoint quota and consumption for your key. This call has no daily quota of its own.',
				routing: {
					request: { method: 'GET', url: '/usage' },
					output: { postReceive: [parseDomainKitsObject] },
				},
			},
		],
		default: 'usage',
	},
];
