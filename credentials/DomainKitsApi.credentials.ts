import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DomainKitsApi implements ICredentialType {
	name = 'domainKitsApi';

	displayName = 'DomainKits API';

	icon: Icon = 'file:domainkits.svg';

	documentationUrl = 'https://domainkits.com/dev/api-docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			placeholder: 'Your DomainKits API key',
			description:
				'Your DomainKits API key. Requires a Premium or higher plan. The same key works for the DomainKits MCP server.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://premium-api.domainkits.com/api/v1',
			url: '/usage',
			method: 'GET',
		},
	};
}
