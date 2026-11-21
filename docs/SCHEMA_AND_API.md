# Schema, API Contract and Chart Contract

This file is the **single source of truth**. If something changes, edit this file in a Pull Request and tell the group.
Owner of this file: **A (Basel)**. B and C may suggest changes.

---

## 1. Database schema (SQLite)

Saved as `db/schema.sql`.

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE branches (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,
  country      TEXT NOT NULL,
  country_code TEXT NOT NULL,          -- ISO 3166-1 alpha-2 (matches amCharts map ids, e.g. "EG")
  city         TEXT NOT NULL,
  region       TEXT NOT NULL,
  latitude     REAL NOT NULL,
  longitude    REAL NOT NULL,
  manager      TEXT NOT NULL,
  employees    INTEGER NOT NULL,
  opened_year  INTEGER NOT NULL
);

CREATE TABLE categories (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE products (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  unit_price  REAL NOT NULL,
  unit_cost   REAL NOT NULL
);

CREATE TABLE sales (
  id         INTEGER PRIMARY KEY,
  branch_id  INTEGER NOT NULL REFERENCES branches(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  year       INTEGER NOT NULL,
  month      INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  units_sold INTEGER NOT NULL,
  revenue    REAL NOT NULL,            -- units_sold * unit_price
  cost       REAL NOT NULL,            -- units_sold * unit_cost
  profit     REAL NOT NULL,            -- revenue - cost
  UNIQUE (branch_id, product_id, year, month)
);

CREATE TABLE targets (
  id             INTEGER PRIMARY KEY,
  branch_id      INTEGER NOT NULL REFERENCES branches(id),
  year           INTEGER NOT NULL,
  month          INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  revenue_target REAL NOT NULL,
  UNIQUE (branch_id, year, month)
);

CREATE INDEX idx_sales_branch  ON sales(branch_id);
CREATE INDEX idx_sales_product ON sales(product_id);
CREATE INDEX idx_sales_period  ON sales(year, month);
```

Expected size: 10 branches x 12 products x 24 months = **2,880 sales rows**, **240 target rows**.

### Seed data (what A puts in the tables)

**Branches** (size factor = how big its sales are compared to Cairo)

| id | name | country | code | city | region | lat | lon | manager | employees | opened | size |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Cairo HQ | Egypt | EG | Cairo | Middle East & Africa | 30.04 | 31.24 | Omar Hassan | 120 | 2008 | 1.00 |
| 2 | Dubai | United Arab Emirates | AE | Dubai | Middle East & Africa | 25.20 | 55.27 | Layla Nasser | 85 | 2012 | 0.90 |
| 3 | Riyadh | Saudi Arabia | SA | Riyadh | Middle East & Africa | 24.71 | 46.68 | Faisal Al-Harbi | 70 | 2016 | 0.80 |
| 4 | London | United Kingdom | GB | London | Europe | 51.51 | -0.13 | Emma Clarke | 95 | 2010 | 1.10 |
| 5 | Berlin | Germany | DE | Berlin | Europe | 52.52 | 13.40 | Lukas Weber | 80 | 2013 | 0.95 |
| 6 | Paris | France | FR | Paris | Europe | 48.86 | 2.35 | Camille Laurent | 75 | 2014 | 0.85 |
| 7 | New York | United States | US | New York | North America | 40.71 | -74.01 | Jake Morrison | 140 | 2011 | 1.40 |
| 8 | Toronto | Canada | CA | Toronto | North America | 43.65 | -79.38 | Sophie Tremblay | 60 | 2018 | 0.70 |
| 9 | Tokyo | Japan | JP | Tokyo | Asia Pacific | 35.68 | 139.69 | Haruto Sato | 110 | 2015 | 1.20 |
| 10 | Mumbai | India | IN | Mumbai | Asia Pacific | 19.08 | 72.88 | Priya Sharma | 90 | 2017 | 0.90 |

**Categories and products** (price and cost in USD)

| Category | Product | Price | Cost |
|---|---|---|---|
| Electronics | Laptop | 900 | 700 |
| Electronics | Smartphone | 600 | 430 |
| Electronics | Wireless Headphones | 120 | 70 |
| Home Appliances | Air Fryer | 110 | 70 |
| Home Appliances | Coffee Machine | 180 | 115 |
| Home Appliances | Robot Vacuum | 350 | 240 |
| Furniture | Office Chair | 160 | 95 |
| Furniture | Standing Desk | 420 | 260 |
| Furniture | Bookshelf | 130 | 80 |
| Sports & Lifestyle | Running Shoes | 95 | 45 |
| Sports & Lifestyle | Backpack | 60 | 28 |
| Sports & Lifestyle | Smart Watch | 250 | 150 |

**How the monthly sales are generated** (A's seed script, fixed random seed so everyone gets identical data):
- Base units per branch/product/month: cheaper products sell more units (roughly units ~ 3000 / price^0.75), multiplied by the branch size factor.
- Seasonality multiplier by month: Jan .85, Feb .85, Mar .95, Apr .95, May 1.0, Jun 1.0, Jul .9, Aug .9, Sep 1.0, Oct 1.05, Nov 1.3, Dec 1.35.
- Growth: 2025 is about +8% over 2024.
- Random noise: about +/- 12% per row.
- Built-in "stories" so the charts show something interesting: Tokyo is strong in Electronics (x1.4); Cairo is strong in Home Appliances (x1.3); Riyadh grows the fastest (+20%/year); Toronto misses its targets most months.
- Targets: expected monthly revenue per branch x a random factor between 1.00 and 1.10 (Toronto: x1.15).

---

## 2. API contract

Base URL: `http://localhost:3000` locally, the deployed URL online. All responses are JSON. Numbers are plain numbers (not strings). Money is USD, rounded to 2 decimals. Ratios are fractions (0.25 = 25%).

### Common query parameters (all `/api/sales/*`, `/api/kpis`, `/api/targets/*`)

| Param | Meaning | Example | If missing |
|---|---|---|---|
| `year` | one year | `year=2025` | both years |
| `branches` | comma-separated branch ids | `branches=1,4,7` | all branches |
| `categories` | comma-separated category ids | `categories=1,3` | all categories |

Errors: HTTP 400 for bad input and 500 for server errors, body `{"error": "message"}`.

### Endpoints

**1. `GET /api/filters`** — options for the filter bar (ignores the params above)
```json
{
  "years": [2024, 2025],
  "branches": [{ "id": 1, "name": "Cairo HQ", "country": "Egypt" }],
  "categories": [{ "id": 1, "name": "Electronics" }]
}
```

**2. `GET /api/kpis`** — numbers for the KPI cards and the gauge
```json
{
  "revenue": 4820000.5,
  "profit": 1210000.25,
  "units": 15400,
  "profit_margin": 0.251,
  "target_revenue": 4700000,
  "target_achievement": 1.026
}
```
Targets are per branch (not per category), so **if the `categories` param is present, `target_revenue` and `target_achievement` are `null`**. The frontend shows "N/A" and the gauge shows an empty state.

**3. `GET /api/sales/monthly`** — one row per month, sorted by date
```json
[
  { "date": "2024-01-01", "year": 2024, "month": 1, "revenue": 410000, "profit": 98000, "units": 1500 }
]
```

**4. `GET /api/sales/by-branch`** — one row per branch (also feeds the map)
```json
[
  {
    "branch_id": 1, "branch": "Cairo HQ", "country": "Egypt", "country_code": "EG",
    "latitude": 30.04, "longitude": 31.24,
    "revenue": 920000, "profit": 230000, "units": 3100
  }
]
```
Sorted by revenue, highest first.

**5. `GET /api/sales/by-category`** — one row per category
```json
[ { "category_id": 1, "category": "Electronics", "revenue": 2100000, "profit": 480000, "units": 4200 } ]
```

**6. `GET /api/sales/by-branch-category`** — wide format for the stacked bar. Extra param: `metric` = `revenue` | `profit` | `units` (default `revenue`).
```json
[ { "branch": "Cairo HQ", "Electronics": 300000, "Home Appliances": 350000, "Furniture": 150000, "Sports & Lifestyle": 120000 } ]
```
Only categories selected by the filter appear as keys.

**7. `GET /api/sales/by-product`** — one row per product (feeds the scatter)
```json
[
  {
    "product_id": 1, "product": "Laptop", "category": "Electronics",
    "unit_price": 900, "unit_cost": 700,
    "revenue": 800000, "profit": 140000, "units": 890
  }
]
```

**8. `GET /api/targets/monthly`** — actual vs target per month. Ignores `categories`.
```json
[ { "date": "2024-01-01", "revenue": 410000, "target": 430000 } ]
```

---

## 3. Chart list (this table is also the base of report section [b])

| # | Chart | Type | Endpoint | Container id | Render function | Shows up |
|---|---|---|---|---|---|---|
| 1 | KPI cards | plain HTML numbers (B) | `/api/kpis` | `#kpi-revenue` `#kpi-profit` `#kpi-units` `#kpi-margin` | `updateKpis(data)` in app.js | always |
| 2 | Target achievement | radial gauge | `/api/kpis` | `#chart-gauge` | `renderGauge(data)` | always |
| 3 | Revenue trend | line chart, date axis | `/api/sales/monthly` | `#chart-trend` | `renderTrendChart(data, metric)` | always |
| 4 | Revenue by branch | horizontal bar, ranked | `/api/sales/by-branch` | `#chart-branches` | `renderBranchChart(data, metric)` | radio "Total" selected (default) |
| 5 | Branch x category | stacked bar | `/api/sales/by-branch-category` | `#chart-stacked` | `renderStackedChart(data, metric)` | radio "By category" selected (replaces chart 4 in the same panel) |
| 6 | Category share | donut chart | `/api/sales/by-category` | `#chart-categories` | `renderCategoryChart(data, metric)` | always |
| 7 | Sales map | world map with bubbles | `/api/sales/by-branch` | `#chart-map` | `renderMapChart(data, metric)` | always |
| 8 | Product analysis | scatter (x = price, y = units, bubble size = profit) | `/api/sales/by-product` | `#chart-products` | `renderProductChart(data)` | checkbox "Show product analysis" |
| 9 | Actual vs target | columns (actual) + line (target) | `/api/targets/monthly` | `#chart-targets` | `renderTargetChart(data)` | always |

(Why each type, colors and axis titles: C writes that in `report/charts.md`.)

---

## 4. Frontend contract (so B and C do not block each other)

**File ownership**
- B owns `index.html`, `css/`, `app.js`, `filters.js`.
- C owns every file inside `public/js/charts/` and `public/charts-test.html`.
- Mock JSON files live in `public/mock/` (copy the examples above, one file per endpoint, e.g. `kpis.json`, `monthly.json`).

**Rules for C's chart files**
1. One file per chart: `trend.js`, `branches.js`, `stacked.js`, `categories.js`, `map.js`, `products.js`, `gauge.js`, `targets.js`.
2. Each file defines the global render function named in the table above. It receives already-fetched data (it does **not** call `fetch` itself).
3. `metric` is one of `'revenue'`, `'profit'`, `'units'`. The chart title and axis title must change with it.
4. Calling the function again must **replace** the old chart (dispose the previous amCharts root for that container first), otherwise charts pile up when filters change.
5. If the data array is empty, show a "No data for this selection" message instead of an empty chart.
6. **On D2, C pushes stub files** (functions that exist but draw nothing) so B's `app.js` never crashes while charts are being built.

**Rules for B's `app.js`**
1. Reads the filter state, builds the query string, fetches all endpoints with `Promise.all`, then calls `updateKpis` and every `render...` function.
2. Reads the selected metric (`revenue`/`profit`/`units`) from the metric radio buttons and passes it along.
3. Shows a loading state while fetching and an error message if the API fails.

**amCharts scripts to load in `index.html` (in this order)**
```
https://cdn.amcharts.com/lib/5/index.js
https://cdn.amcharts.com/lib/5/xy.js
https://cdn.amcharts.com/lib/5/percent.js
https://cdn.amcharts.com/lib/5/radar.js
https://cdn.amcharts.com/lib/5/map.js
https://cdn.amcharts.com/lib/5/geodata/worldLow.js
https://cdn.amcharts.com/lib/5/themes/Animated.js
```
then `charts/*.js`, then `filters.js`, then `app.js`. If C needs another amCharts file, C tells B. Do not remove the small amCharts logo (free license requires it).

**Shared palette** (B uses these as CSS variables, C uses the same hex values in charts)

| Use | Color |
|---|---|
| Primary / revenue | `#2F6FED` |
| Profit | `#1FA67A` |
| Units | `#F2994A` |
| Target line | `#E5484D` |
| Text dark | `#1F2937` |
| Background | `#F4F6FA` |

Category colors (fixed everywhere): Electronics `#2F6FED`, Home Appliances `#F2994A`, Furniture `#1FA67A`, Sports & Lifestyle `#9B51E0`.

---

## 5. Changing this file

1. Open an Issue or tell the group what you need.
2. A edits this file in a PR.
3. Everyone pulls the new version of `main`.
Never change an endpoint's JSON shape silently.
