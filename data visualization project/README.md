# Nexora Global — Sales Dashboard
**DSAI 203 Final Project (Fall 2026) — Zewail City**
Deadline: **2 / 12 / 2026**. Our internal deadline: **1 / 12 / 2026** (one day buffer).

> Read this file first, then your own role file in `docs/`.

---

## 1. Project idea

We chose option 2: **a multinational company with multiple branches selling different products.**

- **Company (fictional):** Nexora Global, sells consumer products through 10 branches in 10 countries.
- **Clients who use the dashboard:** the **CEO** and the **Regional Sales Directors**.
- **Data the client provides:** branches (country, city, region, coordinates, manager, employees, opened year), product categories, products (price, cost), monthly sales per branch per product (units, revenue, cost, profit), and monthly revenue targets per branch. Period: Jan 2024 – Dec 2025.
- **Questions the dashboard answers:**
  1. How much did we sell and earn, and are we hitting our target?
  2. How do revenue and profit change over time (trend, seasonality)?
  3. Which branches perform best and worst?
  4. Which product categories bring the most revenue and profit?
  5. Where in the world are our sales concentrated?
  6. Which categories drive each branch?
  7. Which products are best sellers, and which are the most profitable?
  8. Which branches/months are below target?

Full schema, API and chart list: **`docs/SCHEMA_AND_API.md`** (the single source of truth for the team).

---

## 2. What the doctor requires

**Implementation**
- Dashboard built with the **amCharts** library (visualization must be amCharts only — no Chart.js, Plotly, etc.).
- Data must come from a **remote server** (our Express API, deployed online).
- Data as Excel tables is OK, **database (SQLite) is a plus** → we use SQLite and also export Excel files.
- Allowed to use Flask + SQLite. We use Express + SQLite (see "Ask the TA" below).

**Deliverables**
1. **PDF report** containing:
   - Project definition, charts and layout (sections [a], [b], [c] of the project PDF)
   - Snapshot of every individual chart
   - Snapshot of the complete layout
   - Source code of the dashboard (with comments)
   - Snapshot of the provided data (as tables)
   - Suggested future work
2. **Running application:**
   - Source code submitted through the dashboard
   - A file named `how_to_run.doc`
   - Application will be discussed with the TAs

**Design phase sections the report must answer**
- [a] client title, available information, required questions
- [b] for each chart: details (type, title, colors, axis titles, legend), questions it answers, how it shows up (always / radio / checkbox...), why this chart type
- [c] layout: why these positions for charts/titles/buttons, and **points that may be criticized** in the layout

## 3. Grading (20 marks)

| Item | Marks |
|---|---|
| Design quality | 4 |
| Implementation + Discussion | 8 |
| Database (SQLite) | 4 |
| Documentation quality (PDF contents) | 4 |
| **Total** | **20** |

Notes: the discussion with the TAs is worth part of the 8 marks, so **every member must understand the whole project**, not only their part.

---

## 4. Tech stack

| Part | Tool |
|---|---|
| Frontend | Plain HTML + CSS + JavaScript (no framework) |
| Charts | amCharts 5 (via CDN) |
| Backend | Node.js + Express |
| Database | SQLite via `better-sqlite3` |
| Excel export | `exceljs` (script writes `.xlsx` files into `data/`) |
| Hosting | Free host that runs Node (Render or similar, check current free tier) |
| Version control | Git + GitHub |

## 5. Team split

| Role | Person | Owns | Role file |
|---|---|---|---|
| A: Backend, data, database, GitHub manager | Basel | `server.js`, `src/`, `db/`, `data/`, deployment, `how_to_run.doc` | `docs/PERSON_A_backend.md` |
| B: Layout and interactivity | _(friend 1)_ | `public/index.html`, `public/css/`, `public/js/app.js`, `public/js/filters.js` | `docs/PERSON_B_layout.md` |
| C: amCharts charts | _(friend 2)_ | `public/js/charts/`, `public/charts-test.html` | `docs/PERSON_C_charts.md` |

**Golden rule: you only edit your own files.** This avoids almost all merge conflicts. If you need a change in someone else's file, ask them (or open an Issue).

GitHub help: `docs/GITHUB_GUIDE_FOR_TEAM.md` (for B and C) and `docs/GITHUB_MANAGER_BASEL.md` (for A).

## 6. Repo structure

```
dsai203-sales-dashboard/
├── README.md
├── package.json
├── .gitignore
├── server.js              # A: Express app, serves /public and /api
├── src/                   # A: routes, db helper, query builders
├── db/
│   ├── schema.sql         # A
│   ├── seed.js            # A: generates the fake data (fixed random seed)
│   └── dashboard.db       # A: generated SQLite file (committed, so everyone has same data)
├── data/                  # A: Excel exports of every table
├── public/
│   ├── index.html         # B
│   ├── css/               # B
│   ├── js/
│   │   ├── app.js         # B: fetches data, calls the render functions
│   │   ├── filters.js     # B
│   │   └── charts/        # C: one file per chart
│   ├── charts-test.html   # C: private test page for charts
│   └── mock/              # B and C: fake JSON copied from the API contract
├── docs/                  # all team docs
└── report/                # each person writes their part of the PDF report here
```

## 7. Run it locally

You need Node.js (version 18 or newer). Then:

```
npm install
npm run seed      # only if db/dashboard.db is missing (A normally commits it)
npm start         # open http://localhost:3000
```

## 8. Timeline (this week)

| Day | Date | What happens |
|---|---|---|
| D1 | Sat 21 Nov | Kickoff meeting, read contract, repo setup, everyone starts learning |
| D2 | Sun 22 | A: schema + seed data. B: page skeleton. C: first charts with mock data + stub files pushed |
| D3 | Mon 23 | A: API running and pushed (friends can run it locally from now on) |
| D4 | Tue 24 | A: remaining endpoints, Excel export, start deploy. B: filters wired. C: map, scatter, stacked |
| D5 | Wed 25 | C: gauge + targets chart. B: polish. A: deployed. Merge everything finished |
| D6 | Thu 26 | Integration day: real data in all charts, bug fixing |
| D7 | Fri 27 | Feature freeze. Everybody teaches their part to the others (15 min each) |
| | Sat 28 – Sun 29 | Polish, take all screenshots |
| | Mon 30 – Tue 1 Dec | Finish PDF report, `how_to_run.doc`, rehearse the TA discussion, **submit** |

Honest warning: the app can be built in the week, but the report is a lot of work. Each person writes their own report part as they build (details inside the role files).

## 9. Ask the TA / doctor on day 1 (short message)

1. Is Express (Node.js) accepted instead of Flask?
2. What exactly does "remote server" mean for the demo (deployed online, or a separate local server)?
3. "Source code submitted through the dashboard": which platform or link?
4. Is `how_to_run.doc` a real Word file or a text file with that name?

## 10. Rules

1. `main` always runs (`npm start` must work). Never push broken code to `main`.
2. Nobody commits directly to `main`. Work on your branch, open a Pull Request.
3. Comment your code. The source code goes into the PDF report and comments are graded.
4. Any change to the schema or API goes through `docs/SCHEMA_AND_API.md` first, then tell the group.
5. Small commits, clear messages (`feat: add trend chart`, `fix: map tooltip`).
