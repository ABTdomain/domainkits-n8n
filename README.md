# n8n-nodes-domainkits

Query the [DomainKits](https://domainkits.com) domain data API from inside [n8n](https://n8n.io/).

This is the official node for the DomainKits API, published and maintained by the DomainKits team. DomainKits is built and operated by Lyalpha GmbH, with domain data and infrastructure provided by [ABTdomain](https://abtdomain.com), our domain intelligence and data aggregation platform. This repository is hosted under the ABTdomain GitHub organisation. Learn more about the relationship at [domainkits.com/about](https://domainkits.com/about).

## What you get

One API key, every capability as an n8n resource:

- **Six domain inventories** covering the whole lifecycle: newly registered, active, aged, expired, deleted and for-sale. Search by keyword or browse a whole TLD, then narrow with filters.
- **Two ways to see new registrations**: the zone based search holds 60 days and shows a name once the zone publishes it. The live search reads the last three days from Certificate Transparency, so it reaches names the zone does not carry yet and covers .ai and .io alongside the generic TLDs.
- **Lookups on demand**: RDAP WHOIS, DNS, safety, typosquat scan, reverse nameserver, IP and registrar checks, including bulk WHOIS and bulk DNS for whole result sets.
- **Certificate Transparency**: subdomains, certificates, hostname search. Match the keyword against the registered domain, the full hostname, or subdomains only, which is how you find a brand sitting in front of an unrelated registration. Bound results by log date and choose between the current period and full history.
- **Monitoring and trends**: domains whose registration changed in the last 7 days, TLD volumes, hot and emerging keywords.
- **AI Agent ready**: the node is exposed as a tool, so an n8n AI Agent can call it directly and fill in the parameters itself.

**No PII.** No operation returns registrant personal data.

Fresh data beats exports: domains move through the lifecycle daily, so point a Schedule Trigger at this node and the same question gets answered against current data every run.

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

## Usage notes

- **Bulk lookups**: collect domains into one item first (Code or Aggregate node), then hand the array to the bulk operation. Batches draw from the same daily quota as single lookups.
- **Coverage is gTLDs only** for the zone based searches. Country-code TLDs like `.de` or `.us` return an empty result set, not an error. The live search is the exception and also carries `.ai` and `.io`.
- **Return All** exports up to 50,000 rows in one request on a separate, small export quota. Use paged mode for anything recurring.

Every parameter, filter and current limit is documented in the [API reference](https://domainkits.com/dev/api-docs).

## Examples

**Drop-day alert**: Schedule Trigger (daily) → DomainKits (Expired, keyword `clinic`, auction window set to tomorrow) → If (matches your list) → Slack.

**Brand watch**: Schedule Trigger (daily) → DomainKits (Newly Registered, keyword `yourbrand`) → If (new since last run) → Slack.

**Aged shortlist**: Schedule Trigger (weekly) → DomainKits (Expired, browse TLD `com`, age 20+, letters only) → Google Sheets.

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
