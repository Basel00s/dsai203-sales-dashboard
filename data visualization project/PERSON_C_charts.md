# Role C: amCharts Charts

**One line:** you build all the charts with amCharts 5. This is the part the doctor grades most visibly, so take your time to make them clean and correct.

**Your files:** everything inside `public/js/charts/` and `public/charts-test.html`.
**Your report part:** section [b] (chart-by-chart design) and the snapshot of every individual chart, plus the source code of your files. Write it in `report/charts.md`.

Do not edit `index.html`, `app.js` or CSS (B's files). If you need an extra amCharts script loaded, tell B.

---

## 1. What to learn (in this order)

### JavaScript you need first (about 4 hours)
- Arrays and objects, arrow functions.
- `map`, `filter`, `reduce`, `sort` (you will reshape data before giving it to charts).
- `async/await` and `fetch` (only for your test page; the real app fetches data in B's `app.js`).
- Reading JSON, and `Intl.NumberFormat` for number labels.

### amCharts 5 core concepts (about 6 hours)
Read the official docs at amcharts.com/docs/v5 and run the demos at amcharts.com/demos. Learn these ideas in this order:
- **Root:** every chart lives in a `Root` attached to a container id. Setting themes (`Animated`). **Disposing a root** (`root.dispose()`), which you must do before drawing again in the same container.
- **Containers and children:** `root.container.children.push(...)`, how charts are built by adding children.
- **XYChart basics:** axes (`CategoryAxis`, `ValueAxis`, `DateAxis`), series (`ColumnSeries`, `LineSeries`), `series.data.setAll(...)`, `xAxis.data.setAll(...)`, `fields` (`valueYField`, `categoryXField`, `valueXField`, `categoryYField`).
- **Appearance:** colors with `am5.color(...)`, series `fill` and `stroke`, axis titles (`am5.Label`), chart titles, number formats.
- **Legends and tooltips:** `am5.Legend`, `series.set("tooltip", ...)`, `tooltipText`, `XYCursor`.
- **Stacked columns:** `stacked: true` on series; ordering and colors per series.
- **PercentChart / PieChart:** `PieSeries`, `valueField`, `categoryField`, donut with `innerRadius`, labels and ticks.
- **MapChart:** `MapPolygonSeries` with `am5geodata_worldLow`, `MapPointSeries` for bubbles at latitude/longitude, bubble size with `heatRules`, tooltips on points, zoom controls.
- **Scatter / bubble chart:** `LineSeries` with the line hidden and `bullets` shown, bubble size with `heatRules`, axis for price (x) and units (y).
- **Radial gauge (RadarChart):** `RadarChart`, `ValueAxis` as an angle axis, a `RadarColumnSeries` or a clock hand to show a percentage out of a maximum.
- **Combining series:** columns and a line in the same XY chart (actual vs target).
- **Updating a chart with new data:** the cleanest way here is dispose the root and build again.

Free-license note: amCharts shows a small logo link on charts. Leave it, do not hide it.

---

## 2. Your tasks (in order)

Build every function from the chart table in `docs/SCHEMA_AND_API.md`. Each one is its own file in `public/js/charts/`.

| Order | File | Function | Chart |
|---|---|---|---|
| 1 | `branches.js` | `renderBranchChart(data, metric)` | Ranked horizontal bar (simplest, learn the basics with it) |
| 2 | `trend.js` | `renderTrendChart(data, metric)` | Line chart with date axis |
| 3 | `categories.js` | `renderCategoryChart(data, metric)` | Donut |
| 4 | `stacked.js` | `renderStackedChart(data, metric)` | Stacked bar, one series per category |
| 5 | `map.js` | `renderMapChart(data, metric)` | World map with bubbles per branch |
| 6 | `products.js` | `renderProductChart(data)` | Scatter/bubble: price vs units, size = profit |
| 7 | `targets.js` | `renderTargetChart(data)` | Columns for actual + line for target |
| 8 | `gauge.js` | `renderGauge(data)` | Radial gauge for target achievement |

**Rules every chart must follow** (also in the contract)
1. Receives already-fetched data. Does not call `fetch`.
2. Replaces the old chart when called again (dispose first).
3. The title and axis titles change with `metric` (`'revenue'`, `'profit'`, `'units'`).
4. Empty data array shows "No data for this selection".
5. Uses the shared palette and the fixed category colors.
6. Has a title, axis titles (where there are axes), a legend only when there is more than one series, and tooltips.
7. Has inline code comments explaining what each block does (the code goes into the report).

**Your test page:** `public/charts-test.html` loads the amCharts scripts and your files, fetches from `/mock/*.json` (or the real API after D3), and calls your functions. Work here, so you never touch `index.html`.

## 3. What you can do alone vs what you need from others

**Alone, from day one:** everything. Use mock JSON files copied from the examples in the contract (put them in `public/mock/`). You need nobody to build the charts.

**Need from A**
- D1: repo + folder skeleton.
- D3: real API running locally, so you test with real data (values and ranges look different from mock data, for example the map bubbles and axis scales).

**Need from B**
- Almost nothing. Agree on the palette and the container ids (already in the contract). B loads your files in `index.html` and calls your functions.

**Give to B**
- **D2:** stub files for all 8 functions (they exist, draw nothing, do not crash), pushed in a PR. This unblocks B's `app.js`.
- Then each real chart as soon as it is done, in its own small PR.

## 4. Timeline

| Day | Do |
|---|---|
| D1 Sat 21 | Kickoff call. Clone, create your branch. Learn JS array methods. Run the amCharts "getting started" and a basic column chart in `charts-test.html`. |
| D2 Sun 22 | Push stub files for all 8 functions. Build `branches.js` and `trend.js` with mock data. |
| D3 Mon 23 | `categories.js`, `stacked.js`. Pull A's API and test with real data. |
| D4 Tue 24 | `map.js` and `products.js` (the hardest two, start them early in the day). |
| D5 Wed 25 | `targets.js`, `gauge.js`. Colors, titles, tooltips and legends consistent across all charts. |
| D6 Thu 26 | Integration with B's page: fix charts that behave badly when filters change (disposal, empty data, resizing). |
| D7 Fri 27 | Feature freeze. Your 15-minute explanation to the others. Start `report/charts.md`. |
| Sat 28 – Tue 1 Dec | Take one clean screenshot of each chart, finish the chart documentation. |

## 5. Report part you write (`report/charts.md`) — section [b]

For **every chart**, use this template (copy it 9 times, including KPI cards from B):

```
### Chart name
- Chart type:
- Title / axis titles / legend / colors:
- Questions this chart answers:
- How it shows up (always, radio button, checkbox...):
- Why this chart type (and why not another, for example why a donut and not a bar):
- Screenshot:
```

Be specific on "why this chart type", it is the question the doctor listed. Examples: line chart for time because the order matters and you want to see the trend; ranked horizontal bar because branch names are long and ranking is easy to compare; scatter because we compare two numeric values per product; stacked bar because we want the total per branch and the parts together; map because location is geographic.

Also add the source code of your chart files (with comments).

## 6. Definition of done

- All 8 functions work with mock data and with the real API.
- Changing filters 20 times in a row leaves no duplicated or frozen charts.
- No amCharts console errors.
- You can explain, for each chart, which amCharts objects you used and why.
