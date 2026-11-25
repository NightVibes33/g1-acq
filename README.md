# g1-acq

[![Telegram](https://img.shields.io/badge/Telegram-AI%20Deals%20Discussion-26A5E4?logo=telegram&logoColor=white)](https://t.me/muihbb)

> **AI deals discussion group:** https://t.me/muihbb. Discussion of AI promotions and subscription deals.

A tool for collecting and rewriting product IDs in Google One's iOS subscription entry points, designed for **Shadowrocket**.

**One G1 ACQ module supports one-month Ultra trial testing, 12-month 2TB offer testing, passive collection of original SKUs, diagnostics for the last 10 responses, new and duplicate IDs, and JSON export.** The original iOS 2TB product is mapped to the user-specified candidate `g1.2tb.ai.12months_ip_90p`. The 20TB and 30TB tiers default to `g1.20tb.1month_eft.acq` and `g1.ai.ultra.1month_eft.acq`, with separate three-month 90p fallbacks. Current module version: `v7.6.0`; response script: `g1-acq-v7.6`. A separate scanner or repeated module switching is unnecessary. Collection only reads matching responses actually received by the phone; it does not actively query a complete SKU catalog. Repeated IDs increment counts without adding rows. See [Pro 12-month offer testing and SKU scanning](docs/pro-annual-test.md) for the full operational guide.

This release incorporates [PR #3](https://github.com/crhywun/g1-acq/pull/3) to add the two Ultra trial mappings. Whether a trial is available to the current account, the billing interval and renewal amount must be checked in the App Store purchase sheet. Benefits must be checked in the Google One account.

> Finding a product ID in a response proves only that the string was present, not that it is a verified App Store catalog entry. A rewrite does not establish purchase eligibility. Verify the actual product, billing interval, initial and renewal prices, and account benefits independently.

## Main module installation URL

**G1 ACQ: Ultra trial and 2TB offer testing, passive collection and response diagnostics.**

```text
https://raw.githubusercontent.com/NightVibes33/g1-acq/main/g1-acq-v7.sgmodule
```

The URL above loads the English fork. Its module and scripts use the main branch of this repository. Upstream version tags remain unchanged. The English fork preserves the original source version and local data format.

Only one G1 ACQ module needs to be enabled. Disable old standalone G1 SKU Scan, G1 Pro Annual Test or other rewrite copies to prevent duplicate counting or rewriting. There is no additional disabling step if only the main module is installed. Historical tags `v7.0.0`, `v7.1.0`, `v7.2.0`, `v7.3.0`, `v7.4.0`, `v7.5.0`, `pro-annual-test-v1` and `pro-annual-test-v2` remain unchanged.

The last-ten-response diagnostics come from `g1-acq-v7.6`. G1 Pro Annual Test also uses this script, but only matches `/ai?`. The standalone G1 SKU Scan compatibility entry only updates its download pin. It still writes collector version `pro-annual-test-v2` and has no new activity diagnostics. The newer report shows this as legacy collection records with an empty response history.

## Three-tier mapping

The script first collects SKUs from original text responses under `one.google.com/`, then maps complete source IDs only in responses matching `one.google.com/ai?`:

| Complete source SKU in the body | Default target | Fallback target |
|---|---|---|
| Complete SKU beginning with `g1.ios.2tb.` | `g1.2tb.ai.12months_ip_90p` (user-specified candidate) | None |
| `g1.ios.20tb.m.v2` | `g1.20tb.1month_eft.acq` (one-month Ultra trial) | `g1.20tb.3months_ip_90p.acq` (three-month 90p offer) |
| `g1.ios.30tb.ai.pro.m` | `g1.ai.ultra.1month_eft.acq` (one-month Ultra trial) | `g1.ai.ultra.3months_ip_90p.acq` (three-month 90p offer) |

The 2TB source is the original iOS 2TB product and has a fixed target with no fallback. The 20TB and 30TB tiers choose independently based on their own target strings in the original response. A present default takes priority even if the fallback also appears. If only the fallback appears, use it. If neither appears, the default is still selected. Historical 75p targets `g1.20tb.3months_ip_75p.acq` and `g1.ai.ultra.3months_ip_75p.acq` remain in old records, but are not current fallbacks. This is string matching, not a store query. If all three source tiers fail to match, the original response is returned unchanged.

The 2TB candidate has no `.acq` suffix. The first item in the user's screenshot supplied the candidate and the label `$1.99 x 12 months = $23.88/year`. The label describes twelve discounted monthly payments; `90p` is described as 90% off, not paying 90% of the price. The yearly total is not evidence of a single annual charge. The screenshot is titled **Pro 5TB**, but the source remains an original iOS 2TB SKU, not a new 5TB prefix. The screenshot does not establish verified iOS pricing, billing or 5TB benefits. Offline tests verify string matching and report behavior only.

## Installation (Shadowrocket)

Open **Config > (i) beside the active configuration > HTTPS Decryption**.

![Configuration example: tap the information icon next to the active configuration](docs-config-entry-example.png)

The configuration name is an example. Personal file listings, modification times, sizes and the status bar were removed from the screenshot.

1. Enable G1 ACQ installed from the versioned module URL. Upgrade older copies once and keep the VPN connected.
2. In the active configuration's information screen, enable HTTPS Decryption. Reuse an existing trusted Shadowrocket certificate or generate and install one if necessary.
3. For first-time certificate configuration, install the profile in iOS Settings > General > VPN & Device Management.
4. Enable trust for the corresponding Shadowrocket root certificate in Settings > General > About > Certificate Trust Settings.
5. Confirm `one.google.com` in the active configuration's HTTPS decryption hostname list. `%APPEND%` appends this domain. This is not the DNS Hosts list.
6. Reconnect Shadowrocket after changing the module or decryption configuration, then reopen the Google app subscription page.

## Phone workflow

1. Keep the updated G1 ACQ module enabled and Shadowrocket connected. Collection and rewriting run in order when matching responses arrive.
2. In the Google app (multicolored G), open Google One management. The original documentation describes the 2TB / Pro and actual 20TB / 30TB plan entry points.
3. Verify the App Store purchase sheet's product name, billing period, initial price and renewal price. Open the local report in Safari and use **Export JSON** to retain the original candidate IDs and rewrite records.

![Example of an Ultra plan selection panel and 20TB entry point](docs-ultra-plans-example.png)

The example shows a 20TB entry point. The 2TB offer test concerns the 2TB / Pro plan. Account, region and app version determine which plans are actually displayed. Native StoreKit itself is not part of the web response rewrite scope.

The main module reads `g1.*` and `com.google.one.*` IDs from original responses before any rewriting. It deduplicates IDs, counts occurrences and retains up to 300 distinct IDs. At capacity, existing IDs continue to update and new omitted IDs are counted. The local report page is excluded. The phone stores IDs, counts, times, scan status and up to ten sanitized response events. It does not store full response bodies, query the App Store or transmit collected data.

When reviewing available monthly, annual or offer pages, a string can be collected even if the corresponding offer is not visible. IDs that the server did not send are absent from the original collection. See [SKU collection and candidate validation](docs/pro-annual-test.md#6-sku-collection-and-validation-on-ios).

## Local report and troubleshooting

Open the [local report](https://one.google.com/g1-sku-report) in Safari while G1 ACQ and Shadowrocket are active. The page should display **Local script active**, `v7.6.0`, and **Export JSON** in the action area. [Direct JSON export](https://one.google.com/g1-sku-report?format=json) is also available.

The domain is `one.google.com`, but the report is produced locally by a Shadowrocket `http-request` script, not Google. It intercepts `/g1-sku-report`, including the optional trailing slash and query, and returns HTML or JSON without forwarding the report request to Google.

A normal Google page, 404 or missing local badge/export button indicates the expected local report is not being shown. Check module activation, VPN connection, HTTPS decryption in the active configuration, hostname and certificate trust. Paste the complete report URL into Safari.

`reportVersion=v7.6.0` identifies the report script only. The actual saved collector version is `scan.version`. Current collector: `g1-acq-v7.6`. Old records show **Legacy collection records; no responses from this collector version have been saved yet**. If the version is unknown or records are absent, the report says no responses from the current collector version have been saved. It does not fabricate response history when older data lacks `recentResponses`, nor diagnose a device fault from that alone.

| Collection field | Meaning |
|---|---|
| `scan.scannedResponses` | Cumulative text responses processed |
| `scan.matchedResponses` | Cumulative text responses containing at least one candidate ID, including repeats |
| `scan.nonTextResponses` | Cumulative non-text responses; excluded from `scannedResponses` |
| `scan.recentResponses` | Up to ten events. JSON is oldest to newest; HTML is newest to oldest. Each event contains `{at, path, bodyType, status, candidateCount, addedCount, omittedCount}`. |

Each event counts distinct candidates, newly retained IDs and IDs omitted due to capacity. Statuses: `new-skus` (new retained IDs), `known-skus` (duplicates), `no-skus` (no IDs), `limit-reached` (nothing retained and at least one omitted), `non-text` (non-text response). `new-skus` takes precedence if `addedCount>0`, even when `omittedCount>0`; `limit-reached` applies only when `addedCount=0` and `omittedCount>0`. Only `/`, `/ai`, `/plans`, `/_/…/data/batchexecute` and `[Other one.google.com paths]` are stored; no query, full URL, body or headers are retained.

`configuredTarget=g1.2tb.ai.12months_ip_90p` is the current configuration. `test.version` and `test.target` come from the latest saved execution, including old records retained through upgrades. The current response script is `g1-acq-v7.6`, and its new candidate origin is `user-specified`.

| Recorded version | Recorded 2TB target | Origin |
|---|---|---|
| v7.6 / v7.5 | `g1.2tb.ai.12months_ip_90p` | `user-specified` |
| v7.3 / v7.4 | `g1.2tb.ai.annual_ip_90p.acq` | `user-specified` |
| v7.2 | `g1.2tb.ai.annual.3months_ip_90p.acq` | `pattern-derived` |
| v1 / v7.1 | `g1.2tb.ai.annual` | `legacy` |

No record means an empty origin. Identical targets do not establish identical script versions. Upgrading does not relabel historical targets or origins. `test.target` describes the configured 2TB target for that execution, while each 20TB or 30TB row's `to` describes its actual target.

`test.hitCount` totals all three tiers. `test.annualHitCount` retains a compatibility name but counts only 2TB / Pro rewrites; the log calls it `annualHits`, and the report displays **of which 2TB**. These names do not prove annual billing. Each `test.matchedFrom` row contains `{id, to, count, fallback}`. `fallback=true` means the execution selected that version's fallback. Current fallbacks are 90p; old records may retain 75p. HTML shows the actual discount, `No` for no fallback, or `Yes` if fallback details are unavailable. Check `test.version` and `to` even when fallback is false.

`status=no-match` means none of the three tiers matched; the original response remains unchanged. `rewritten` can mean that only 20TB or 30TB matched. Use `annualHitCount` to identify 2TB activity. Check the execution time and original collected ID instead of inventing a new SKU. The report supports old v1 2TB-only records: when `to` is missing it fills the original annual target `g1.2tb.ai.annual`, and derives missing `annualHitCount` from old row counts. All historical targets, origins and versions listed above remain unchanged.

| Log marker | Meaning |
|---|---|
| `g1-acq-v7.6 status=... addedCount=N candidates=N omittedCount=N occurrences=N saved=yes/no` | Collector status, new retained IDs, distinct candidates, omitted IDs, total occurrences and storage result. `saved=yes` confirms writing the record. |
| `saved=no` / `SKU collection unavailable` | Writing failed or collection did not finish; the report may still show old counts and times. |
| `g1-acq-v7.6 hits=N annualHits=N` | Version, total rewrites and 2TB / Pro rewrites; not proof of annual billing. |
| `source SKU -> actual target xN` | Complete source ID, actual target and number of replacements. |
| `fallback=actual complete target ID` | 20TB / 30TB used its fallback, matching the row's `to`. Older `fallback=75p` is historical format. |

To diagnose an unchanged SKU list, record the report version, actual collector version, response counts and latest event time; reopen actual plan pages; then refresh the report. Increased text counts with `known-skus` indicate duplicates, `no-skus` indicates no recognized IDs, and increased `nonTextResponses` indicates non-text responses. If counts and latest event time are all unchanged, no new record was saved. Check `saved=no` and `SKU collection unavailable`, cache, matching domain, VPN, module, HTTPS decryption, trust and hostname. Updating a report version alone does not mean a collector ran.

Diagnostics cannot guarantee new IDs. Reinstalling or repeatedly clearing history does not cause the server to send new identifiers. `?clear=1` remains a manual two-key reset for when history really needs to be cleared. See the [detailed guide](docs/pro-annual-test.md) for field definitions, diagnostic cases and a device record template.

## Scope and local storage

| Tool | Match scope | Behavior |
|---|---|---|
| Passive collection | Responses under `^https://one\.google\.com/`, except the report | Reads original text IDs; counts non-text separately; saves last ten response events |
| Three-tier rewrite | Responses matching `^https://one\.google\.com/ai\?` | Rewrites complete IDs after collection; independent fallbacks; latest execution record |
| Local results page | `/g1-sku-report`, optional trailing slash and query | Local collection and rewrite results or JSON export |

- **Processing:** The collector reads matching response bodies and saves IDs, counts, times, status and up to ten sanitized events. It does not read request headers or bodies, or store full responses. Events contain time, category, body type, status and counts only. Rewriting changes IDs, not price fields; page prices do not replace App Store prices.
- **Transmission:** The scripts contain no network reporting calls. Logs and collection/rewrite/report storage use local `$persistentStore`. The Shadowrocket host can provide networking APIs even though these scripts do not call them. Downloads use GitHub or jsDelivr.
- **MITM scope:** The module appends only `one.google.com`; its entire domain traffic enters the decryption scope, while rewriting is path-limited. Certificate generation, installation and trust occur on the device. HTTPS decryption belongs to the active configuration.
- **System permissions:** The scripts do not request location, photo library or notification permission. Operation uses Shadowrocket's VPN, iOS profile and root-certificate trust configuration.
- **Global rule:** Blocking UDP 443 encourages compatible QUIC traffic to fall back to TCP. This can affect other apps' HTTP/3, performance and connectivity.
- **Versions and storage:** Original downloads are pinned to `@v7.6.0`; historical tags are not moved. Storage keys are `g1.sku.scan.v1` and `g1.pro.annual.test.v1`, with `schemaVersion: 1`. Times are UTC. The report's `?clear=1` clears only these two keys.

## Files

| File | Purpose |
|---|---|
| [g1-acq-v7.sgmodule](g1-acq-v7.sgmodule) | Single main module |
| [g1-acq.js](g1-acq.js) | Current response script and collection activity |
| [g1-pro-annual-test.sgmodule](g1-pro-annual-test.sgmodule) | Legacy compatibility entry with `/ai?` scope; not needed in the main workflow |
| [g1-sku-scan.sgmodule](g1-sku-scan.sgmodule) | Legacy standalone scanner compatibility entry |
| [g1-sku-scan.js](g1-sku-scan.js) | Historical scanner with deduplication, counts and time, without new response diagnostics |
| [g1-sku-report.js](g1-sku-report.js) | Local HTML report, actual collector version, activity, JSON export and manual two-key reset |
| [docs/pro-annual-test.md](docs/pro-annual-test.md) | Detailed single-module guide and field definitions |

## Offline verification

With Node.js 18 or later, run from the repository root:

```sh
node --test tests/sku-tools.test.cjs
```

The original suite covers complete-ID matching for all three tiers, fixed 2TB candidate, all sixteen combinations of independent default and fallback availability, default choice when neither is present, removal of 75p from current fallbacks, pages containing only 20TB / 30TB, URL scope, no matches, total and 2TB counts, current vs historical fallback labels and targets, historical report compatibility from v1 through v7.5, storage errors, deduplication and capacity, local report, export fields and module version pins. Test IDs are synthetic and are not evidence of App Store listings or successful device purchases.

## Credits

Thanks to [@cehomecambodia-lang](https://github.com/cehomecambodia-lang) for contributing the two Ultra trial SKU mappings and three-month 90p fallbacks in [PR #3](https://github.com/crhywun/g1-acq/pull/3).