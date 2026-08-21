# n8n-nodes-domainkits

Query the [DomainKits](https://domainkits.com) domain data API from inside [n8n](https://n8n.io/).

This is the official node for the DomainKits API, published and maintained by the DomainKits team. DomainKits is built and operated by Lyalpha GmbH, with domain data and infrastructure provided by [ABTdomain](https://abtdomain.com), our domain intelligence and data aggregation platform. This repository is hosted under the ABTdomain GitHub organisation. Learn more about the relationship at [domainkits.com/about](https://domainkits.com/about).

One API key, every capability as an n8n resource. Every parameter, response field and current limit is documented in the [API reference](https://domainkits.com/dev/api-docs) and the [OpenAPI spec](https://domainkits.com/dev/openapi.yaml). This README only lists what the node covers.

**AI Agent ready**: the node is exposed as a tool, so an n8n AI Agent can call it directly and fill in the parameters itself.

**No PII.** No operation returns registrant personal data.

## Installation

In the n8n UI:

1. Open **Settings → Community Nodes**.
2. Click **Install a community node**.
3. Enter `n8n-nodes-domainkits`, accept the community node notice and click **Install**.
4. The **DomainKits** node appears in the node panel; search for it in any workflow.

Self-hosted without UI access:

```
npm install n8n-nodes-domainkits
```

in your n8n installation directory, then restart n8n. Details in the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation-and-management/).

## Credentials

You need a DomainKits API key. Sign up at [domainkits.com](https://domainkits.com/pricing). API access requires a Premium or higher plan, and Premium includes a trial period.

In n8n, create a new **DomainKits API** credential and paste the key (it starts with `dk_`). The credential test never burns a search request.

## Resources and operations

| Resource | Operation | Endpoint |
|---|---|---|
| Newly Registered | Search | `/search/nrds` |
| Newly Registered | Search Live | `/search/nrds-live` |
| Expired | Search | `/search/expired` |
| Aged | Search | `/search/aged` |
| Active | Search | `/search/active` |
| Deleted | Search | `/search/deleted` |
| Market | Search | `/search/market` |
| Lookup | WHOIS | `/whois` |
| Lookup | Bulk WHOIS | `/bulk/whois` |
| Lookup | DNS | `/dns` |
| Lookup | Bulk DNS | `/bulk/dns` |
| Lookup | Safety | `/safety` |
| Lookup | IP | `/ip-lookup` |
| Lookup | Registrar | `/registrar` |
| Lookup | Status Guide | `/status-guide` |
| Lookup | TLD Check | `/tld-check` |
| Lookup | Typosquat | `/typosquat` |
| Lookup | Reverse Nameserver | `/ns-reverse` |
| Monitor | Changes | `/monitor/changes` |
| Certificate Transparency | Subdomains | `/ct/subdomains` |
| Certificate Transparency | Certificates | `/ct/certs` |
| Certificate Transparency | Search | `/ct/search` |
| Trends | TLDs | `/trends/tlds/*` |
| Trends | Keywords | `/trends/keywords/*` |
| Account | Usage | `/usage` |

The [API reference](https://domainkits.com/dev/api-docs) is the authority on every filter, field and limit.

## Examples

**Brand watch**: Schedule Trigger (daily) → DomainKits (Newly Registered, keyword `yourbrand`) → If (new since last run) → Slack.

**Drop-day alert**: Schedule Trigger (daily) → DomainKits (Expired, keyword `clinic`) → If (matches your list) → Slack.

**Aged shortlist**: Schedule Trigger (weekly) → DomainKits (Expired, browse TLD `com`) → Google Sheets.

## Compatibility

Verified on n8n 2.31.6. Requires an n8n instance that supports community nodes.

## Resources

- [DomainKits API reference](https://domainkits.com/dev/api-docs)
- [DomainKits developer page](https://domainkits.com/dev)
- [About DomainKits and ABTdomain](https://domainkits.com/about)
- [ABTdomain](https://abtdomain.com)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
