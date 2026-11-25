/**
 * g1-acq.js: Google One subscription page product ID mapping (Shadowrocket http-response script)
 *
 * Design principles:
 *   1. Single responsibility: string mapping from original monthly ID to offer ID only, without diagnostics or reporting;
 *   2. Catalog awareness: first collect offer IDs present in the original response (ending in acq); if the target
 *      is absent and the fallback is present, select the fallback to avoid pointing checkout at a missing product;
 *   3. Externalized data: mappings are centralized in SKU_MAP and FALLBACK; only edit the tables to add or remove tiers.
 *
 * Version: v6
 */
"use strict";

console.log("[g1-acq] v6 loaded");

/* Original iOS in-app purchase ID to target offer */
var SKU_MAP = {
  "g1.ios.20tb.m.v2":     "g1.20tb.3months_ip_90p.acq",
  "g1.ios.30tb.ai.pro.m": "g1.ai.ultra.3months_ip_90p.acq"
};

/* Fallback when the target is absent (community testing reported 75p in Play/iOS catalogs) */
var FALLBACK = {
  "g1.20tb.3months_ip_90p.acq":     "g1.20tb.3months_ip_75p.acq",
  "g1.ai.ultra.3months_ip_90p.acq": "g1.ai.ultra.3months_ip_75p.acq"
};

function occurrences(s, needle) {
  return needle ? s.split(needle).length - 1 : 0;
}

function run() {
  var body = $response && $response.body;
  if (typeof body !== "string" || body === "") {
    $done({});
    return;
  }

  /* Offer IDs actually present in the response */
  var raw = body.match(/g1\.[a-z0-9._]{2,60}acq/g) || [];
  var seen = {};
  var catalog = [];
  for (var r = 0; r < raw.length; r++) {
    if (!seen[raw[r]]) { seen[raw[r]] = 1; catalog.push(raw[r]); }
  }
  console.log("[g1-acq] Catalog offers: " + (catalog.join(", ") || "None"));

  var out = body, total = 0;
  var froms = Object.keys(SKU_MAP);
  for (var k = 0; k < froms.length; k++) {
    var from = froms[k];
    var n = occurrences(out, from);
    if (n === 0) continue;

    var to = SKU_MAP[from];
    if (catalog.indexOf(to) === -1 && FALLBACK[to] && catalog.indexOf(FALLBACK[to]) !== -1) {
      console.log("[g1-acq] Primary offer absent from catalog, falling back " + to + " -> " + FALLBACK[to]);
      to = FALLBACK[to];
    }

    out = out.split(from).join(to);
    total += n;
    console.log("[g1-acq] " + from + " -> " + to + " x" + n);
  }

  console.log(total ? "[g1-acq] Total replacements: " + total + " occurrences" : "[g1-acq] No matches");
  $done(total ? { body: out } : {});
}

run();
