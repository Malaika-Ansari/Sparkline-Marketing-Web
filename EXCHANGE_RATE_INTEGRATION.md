# Sparkline Exchange Rate Integration Architecture

## Secure Rate Ingestion & Fallback Design

Accurate multi-currency marketing operations require reliable exchange rate ingestion with strict adherence to data integrity rules. Sparkline Marketing implements a dual-layer architecture combining secure server-side fetching with institutional reference rate baselines.

---

## 1. Architectural Principles

1. **Zero Secret Leakage**: API requests and external network calls are executed inside the secure server-side middleware (`src/server/ai-proxy-middleware.ts`). Client code never touches raw provider keys or unauthenticated endpoints.
2. **Transparent Metadata**: Every rate response includes:
   - **Provider Name**: e.g., `Open Exchange API (Live Market Feeds)` or `ECB & Institutional Reference Feeds (Indicative Baseline)`.
   - **Last Updated Timestamp**: Exact UTC timestamp when the rate was published.
   - **Rate Classification**: Labeled as `live`, `reference`, or `indicative`.
   - **Data Availability Status**: `available`, `unavailable`, or `stale`.
3. **No Fabricated Rates**: If an external provider is unreachable, the system explicitly marks the feed as `reference` and displays the exact institutional baseline rate. Outdated rates are never silently passed off as live market prices.

---

## 2. Server Proxy Endpoint

### `GET /api/exchange-rates`
* **Route**: Registered in `src/server/ai-proxy-middleware.ts`.
* **Timeout**: Strict 3.5-second abort controller.
* **Response Contract**:
```json
{
  "ok": true,
  "table": {
    "baseCurrency": "USD",
    "rates": {
      "USD": 1.0,
      "EUR": 0.925,
      "GBP": 0.792,
      "CAD": 1.365,
      "AUD": 1.528,
      "JPY": 154.6,
      "PKR": 278.5,
      "INR": 84.42,
      "AED": 3.6725,
      "SAR": 3.751,
      "CNY": 7.245,
      "BDT": 119.85,
      "TRY": 34.45,
      "MYR": 4.472,
      "SGD": 1.346
    },
    "provider": "Open Exchange API (Live Market Feeds)",
    "lastUpdated": "2026-11-13T10:00:00.000Z",
    "rateType": "live",
    "dataAvailability": "available"
  }
}
```

---

## 3. Fallback Mechanism & Offline Resilience

If the external endpoint fails (e.g. sandbox network restrictions, provider rate limits, network timeouts), the server gracefully delivers the institutional baseline:
```json
{
  "ok": true,
  "table": {
    "baseCurrency": "USD",
    "rates": { ... },
    "provider": "ECB & Institutional Reference Feeds (Indicative Baseline)",
    "lastUpdated": "2026-11-13T12:00:00.000Z",
    "rateType": "reference",
    "dataAvailability": "available",
    "message": "Live market feed unavailable; reference baseline rates deployed."
  }
}
```

---

## 4. Cross-Rate Computation Formula

To convert between any arbitrary non-USD currency pair (e.g. converting Pakistani Rupee `PKR` to British Pound `GBP`), the system applies triangulation using the USD base table:

$$\text{Rate}_{\text{PKR} \to \text{GBP}} = \frac{\text{Rate}_{\text{USD} \to \text{GBP}}}{\text{Rate}_{\text{USD} \to \text{PKR}}} = \frac{0.792}{278.50} \approx 0.0028438$$

$$\text{Converted Amount} = \text{Amount} \times \text{Rate}_{\text{PKR} \to \text{GBP}}$$

This guarantees mathematically consistent cross-currency conversion across all 210 possible currency pairs.

