# n8n-nodes-domainkits

Query the [DomainKits](https://domainkits.com) domain data API from inside [n8n](https://n8n.io/).

DomainKits is one API with a shared key across every endpoint — expiring domains, newly registered domains, DNS and WHOIS lookups, and more. One credential in n8n covers all of them. This node exposes every endpoint: six domain search types, WHOIS, DNS, safety, typosquat and other lookups, Certificate Transparency, domain change monitoring, trends and account usage.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Coverage](#coverage) · [Examples](#examples) · [Rate limits](#rate-limits)

## Why query instead of download

Domains move through the expiry lifecycle daily, so an export is out of date as soon as you have it. Point a Schedule Trigger at this node and the same question gets asked against current data every run.

Every filter the API supports is a node parameter, so a query can be as narrow as you need — see [Operations](#operations).

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation-and-management/) in the n8n docs.

Package name: `n8n-nodes-domainkits`

## Credentials

You need a DomainKits API key. Sign up at [domainkits.com](https://domainkits.com/pricing) — API access requires a Premium or higher plan, and Premium includes a trial period. The same key works for the DomainKits MCP server.

In n8n, create a new **DomainKits API** credential and paste the key (it starts with `dk_`). The credential test hits `/usage`, which has no daily quota, so testing never burns a search request.

## Operations

| Resource | Operations |
|---|---|
| Newly Registered Domain (default) | Search domains registered in the last 60 days, filterable by registration date, term, length and more |
| Expired Domain | Search the expired, redemption and pending delete stages |
| Aged Domain | Search domains with 5 to 20+ years of history |
| Active Domain | Search currently registered domains |
| Deleted Domain | Search dropped domains (keyword required) |
| Marketplace Domain | Search for-sale listings, filterable by marketplace and listing recency |
| Domain Lookup | WHOIS, DNS records, safety check, IP lookup, registrar lookup, EPP status guide, TLD availability, typosquat scan, reverse nameserver |
| Certificate Transparency | Subdomains, certificates, hostname search |
| Domain Monitor | Domains whose registration changed in the last 7 days |
| Trend | TLD registration volumes, hot and emerging keywords, prefix trends |
| Account | Per-endpoint quota and usage |

Search resources share the same shape: keyword or TLD-browse mode, paging up to 500 rows per request, a Return All export toggle, and filters that match the REST parameters. `length` and `age_range` accept a preset band (`5-10`), an exact value (`10`), or a range (`8-12`).

### Expired Domain → Search

Search domains moving through the expiry lifecycle — expired, redemption, pending delete. Two modes:

| Mode | What it does |
|---|---|
| **By Keyword** | Matches a keyword (min 3 chars) across every indexed gTLD. Optionally narrow to one gTLD. |
| **Browse a TLD** | Lists every expiring domain under one gTLD. |

**Filters**: expiry stage, domain age, auction or drop date, registry hold status, keyword position, name length, letters-only or digits-only, exclude hyphens, exclude digits, negative keywords, sort order. Age and length accept a preset band (`5-10`), an exact value (`10`), or a range (`8-12`); age also combines with a comma (`0-5,20+`).

**Output**: one n8n item per domain, with `domain`, `registered_date`, `age`, `tld_count`, and `status`.

**Paging**: up to 500 results per request. Use **Offset** to walk through a larger result set — the `total` field on every response tells you how far it goes.

### Return All

A **Return All** toggle is available for one-off bulk pulls: it returns up to 50,000 domains in a single request instead of paging.

Note that 50,000 is a cap, not a promise of completeness — browsing `.com` matched 4,847,613 expiring domains on 27 July 2026, so an unfiltered export returns the first 50,000 of them. Narrow the query with filters if you need the result set to fit.

It runs on a small export quota, separate from your search allowance — 10 per day and 100 per month on Premium, 3 and 9 during the trial. That is enough for occasional research, not for a workflow on a schedule. Leave it off for anything recurring; a daily export would spend a third of the monthly allowance. The export also returns fewer columns (`registered_date` is the year only, and `age` is dropped), so paged mode is the better output in almost every case.

### One API, one credential

The key you configure here authenticates every DomainKits endpoint, and this node exposes all of them as resources. A new capability arrives as a node update, not a second credential. See the [API reference](https://domainkits.com/dev/api-docs) for parameter details.

## Coverage

**gTLDs only.** The index covers generic TLDs — `.com`, `.net`, `.org`, `.info`, `.biz`, `.xyz`, `.online`, `.site`, `.top`, `.club`, `.live`, `.app`, `.dev` and others. Country-code TLDs are not indexed: a query for `.de`, `.io`, `.co` or `.us` returns an empty result set, not an error.

**No PII.** Responses contain no personal data: domain name, dates, lifecycle status and TLD counts only. No registrant names, emails, addresses or phone numbers.

Scale, measured on 27 July 2026 by browsing `.com` with no other filter:

| Stage | `.com` domains |
|---|---|
| Expired | 1,597,469 |
| Redemption | 2,754,494 |
| Pending delete | 495,650 |

Counts move daily as names progress through the lifecycle and drop. Every response carries a `total` field, so you can see the size of any result set before paging through it.

## Examples

**Pending delete watchlist** — Schedule Trigger (daily) → DomainKits (Expired, browse TLD `com`, stage `Pending Delete`, age 10-20 and 20+, no hyphens, no digits, limit 200) → Filter → Google Sheets.

**Drop-day alert** — Schedule Trigger (daily) → DomainKits (Expired, keyword `clinic`, auction date `tomorrow`, sort age oldest first) → If (matches your list) → Slack.

**Brand watch** — Schedule Trigger (daily) → DomainKits (Expired, keyword `yourbrand`, stage `Redemption`) → If (new since last run) → Slack.

**Aged shortlist** — Schedule Trigger (weekly) → DomainKits (Expired, browse TLD `com`, age 20+, letters only, length under 10) → Google Sheets.

## Using it with AI Agents

The node is exposed as a tool, so an n8n AI Agent can call it directly. Ask the agent for "expired .com domains over 15 years old containing 'clinic'" and it will fill in the parameters itself.

## Rate limits

Quotas follow your account and vary by plan. Search and export are metered separately.

| | Search | Export |
|---|---|---|
| Premium trial | 60/min, 2,000/day | 2/min, 3/day, 9/month |
| Premium | 60/min, 2,000/day | 2/min, 10/day, 100/month |
| Platinum | unlimited | 10/min, 100/day, 1,000/month |

Every metered response carries `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. Daily quotas reset at 00:00 UTC, monthly quotas on the 1st.

For a workflow that runs on a schedule, page through results rather than exporting on every run — a daily export burns a third of the monthly Premium allowance in a month, and an hourly one exhausts it the first day. If you're building a loop that could hit the ceiling, turn on **Retry On Fail** in the node's Settings tab.

Current limits: [domainkits.com/dev/api-docs](https://domainkits.com/dev/api-docs)

## Compatibility

Verified on n8n 2.31.6. Requires an n8n instance that supports community nodes.

## Resources

- [DomainKits API reference](https://domainkits.com/dev/api-docs)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
