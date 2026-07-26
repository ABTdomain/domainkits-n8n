# n8n-nodes-domainkits

Search **expired domains** from inside n8n.

This is an [n8n](https://n8n.io/) community node for the [DomainKits](https://domainkits.com) API. It lets you query domains moving through the expiry lifecycle — expired, redemption, pending delete — and pipe the matches straight into Slack, Sheets, a CRM, or anywhere else n8n can reach.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Examples](#examples) · [Rate limits](#rate-limits)

## What you can build with it

- **Drop catching** — search `.com` names entering pending delete, narrowed to 10+ years old, no hyphens, no digits. Run it every morning and only the new matches reach your sheet.
- **Backorder shortlists** — watch names expiring on a given auction date and alert when one matches your keyword list.
- **Brand recovery** — catch an expiring domain that contains your brand before someone else does.
- **Aged domain sourcing** — filter by registration year to find names with real history, not last month's registrations.

These are all *queries*, not downloads. The data changes daily, so the value is in asking again tomorrow — point a Schedule Trigger at the node and let it run.

## Installation

Follow the [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation-and-management/) in the n8n docs.

Package name: `n8n-nodes-domainkits`

## Credentials

You need a DomainKits API key. Sign up at [domainkits.com](https://domainkits.com/pricing) — API access requires a Premium or higher plan, and Premium includes a trial period. The same key works for the DomainKits MCP server.

In n8n, create a new **DomainKits API** credential and paste the key (it starts with `dk_`). The credential test hits `/usage`, which has an unlimited daily quota, so testing never burns a search request.

## Operations

### Expired Domain → Search

Search domains moving through the expiry lifecycle. Two modes:

| Mode | What it does |
|---|---|
| **By Keyword** | Matches a keyword (min 3 chars) across all TLDs. Optionally narrow to one TLD. |
| **Browse a TLD** | Lists every expiring domain under one gTLD. ccTLDs are not supported in this mode. |

**Filters**: expiry stage (expired / redemption / pending delete), domain age (multi-select), auction or drop date, registry hold status, keyword position, name length, letters-only or digits-only, exclude hyphens, exclude digits, negative keywords, sort order.

**Output**: one n8n item per domain, with `domain`, `registered_date`, `age`, `tld_count`, and `status`.

### Return All

A **Return All** toggle is available for one-off bulk pulls: it fetches up to 50,000 domains in a single request instead of paging.

It runs on a small export quota, separate from your search allowance — 10 per day and 100 per month on Premium, 3 and 9 during the trial. That is enough for occasional research, not for a workflow on a schedule. Leave it off for anything recurring; a daily export would spend a third of the monthly allowance. The export also returns fewer columns (`registered_date` is the year only, and `age` is dropped), so paged mode is the better output in almost every case.

## Examples

**Pending delete watchlist** — Schedule Trigger (daily) → DomainKits (Expired, browse TLD `com`, stage `Pending Delete`, age 10-20 and 20+, no hyphens, no digits, limit 200) → Filter → Google Sheets.

**Drop-day alert** — Schedule Trigger (daily) → DomainKits (Expired, keyword `clinic`, auction date `tomorrow`, sort age oldest first) → If (matches your list) → Slack.

**Brand watch** — Schedule Trigger (daily) → DomainKits (Expired, keyword `yourbrand`, stage `Redemption`) → If (new since last run) → Slack.

**Aged shortlist** — Schedule Trigger (weekly) → DomainKits (Expired, browse TLD `com`, age 20+, letters only, length under 10) → Google Sheets.

## Using it with AI Agents

The node is exposed as a tool, so an n8n AI Agent can call it directly. Ask the agent for "expired .com domains over 15 years old containing 'clinic'" and it will fill in the parameters itself.

## Rate limits

Quotas follow your account and vary by plan. Search is generous; export is not.

| | Search | Export |
|---|---|---|
| Premium trial | 60/min, 2,000/day | 2/min, 3/day, 9/month |
| Premium | 60/min, 2,000/day | 2/min, 10/day, 100/month |
| Platinum | unlimited | 10/min, 100/day, 1,000/month |

Every metered response carries `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. Daily quotas reset at 00:00 UTC, monthly quotas on the 1st.

For a workflow that runs on a schedule, page through results rather than exporting on every run — a daily export burns a third of the monthly Premium allowance in a month, and an hourly one exhausts it the first day. If you're building a loop that could hit the ceiling, turn on **Retry On Fail** in the node's Settings tab.

Current limits: [domainkits.com/dev/api-docs](https://domainkits.com/dev/api-docs)

## Compatibility

Tested against n8n 1.x. Requires an n8n instance that supports community nodes.

## Resources

- [DomainKits API reference](https://domainkits.com/dev/api-docs)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
