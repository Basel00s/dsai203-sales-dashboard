# Role A: Backend, Data, Database (Basel)

**One line:** you build the data and the API that feeds the dashboard, deploy it, and manage GitHub. B and C wait on you for real data, so speed in the first 3 days matters most.

**Your files:** `server.js`, `src/`, `db/`, `data/`, `package.json`, `how_to_run.doc`, `docs/SCHEMA_AND_API.md`.
**Your report parts:** section [a] (project definition, data, required questions), the database section (schema, ER diagram, SQL queries), snapshots of data tables, future work, and assembling the final PDF.

---

## 1. What to learn (you know most of it, only the gaps)

You already know Express and SQL. Check these specifically:

**SQLite with `better-sqlite3`**
- Open a database file, run `db.exec` for the schema, `db.prepare(...).all()` / `.get()` / `.run()`.
- Prepared statements with `?` placeholders. Never build SQL by joining user input into a string (SQL injection, and TAs may test this).
- Transactions (`db.transaction`) for inserting thousands of seed rows fast.
- `PRAGMA foreign_keys = ON` (SQLite does not enforce foreign keys unless you turn it on).

**SQL for this project**
- `JOIN` across sales, branches, products, categories.
- `GROUP BY` with `SUM`, and `ORDER BY ... DESC`.
- Dynamic `WHERE ... IN (?, ?, ?)`: you must create one `?` per selected id, so you generate the placeholders from the array length.
- Building a date string from year and month (`printf('%04d-%02d-01', year, month)`).
- Why you store `revenue`, `cost`, `profit` in the sales table (speed and simplicity) and the trade-off (duplicated data).

**Express details**
- `express.static('public')` to serve the frontend from the same server (no CORS problems).
- Reading `req.query`, validating it (integers only, whitelist for `metric`), returning `400` with a message when invalid.
- Reading the port from `process.env.PORT` (hosting services set this).
- A central error handler.

**Seeding**
- A seeded pseudo-random generator (so the data is the same on every machine). Do not use plain `Math.random()`.
- Writing Excel files from Node with `exceljs` (one sheet per table).

**Deployment**
- Environment variables, a `start` script, why the committed SQLite file works for read-only data on a host with a temporary disk.

**Git/GitHub management**: your separate file `docs/GITHUB_MANAGER_BASEL.md`.

---

## 2. Your tasks (in order)

1. Repo setup and folder skeleton (see GitHub manager file).
2. `db/schema.sql` exactly as in `docs/SCHEMA_AND_API.md`.
3. `db/seed.js`: creates the database from the schema, inserts branches, categories, products, then generates the 2,880 sales rows and 240 targets using the rules in the contract (seasonality, growth, noise, the "stories"). Fixed random seed.
4. Sanity-check the data with a few queries: totals per branch, per category, per month. Look at the numbers: do the stories show up (Tokyo electronics, Toronto below target)? Fix the seed if the data looks boring or unrealistic.
5. The API, endpoint by endpoint, as in the contract. Build one shared helper that turns `year`, `branches`, `categories` into a safe `WHERE` clause plus its parameters, and reuse it in every endpoint.
6. Edge cases: empty selection, a branch id that does not exist, `year=2030`, `metric=abc`, `categories` present on the targets endpoint.
7. Excel export script: writes one `.xlsx` per table into `data/` (needed for the report's data snapshots and the "Excel tables" option).
8. Deploy online, test the live URL, put it in the README.
9. `how_to_run.doc`: prerequisites, clone, `npm install`, `npm start`, URL, what to click, how to re-seed, the deployed URL.
10. Integration and final PDF assembly (see GitHub manager file and README timeline).

## 3. What you can do alone vs what you need from others

**Alone (needs nobody):** tasks 1 to 9 entirely. Your work depends only on the contract that you write.

**What others need from you, and when**
- **D1:** repo created, friends added, folder skeleton pushed (B and C wait for this).
- **D2 evening:** `schema.sql` and a first `dashboard.db` pushed.
- **D3:** all 8 endpoints running and pushed. From this moment B and C run the real API locally (`npm install` then `npm start`).

**What you need from others**
- Nothing to start. Only at the end: B's `index.html`/`app.js` and C's chart files merged to test the whole app (D5-D6), and each person's report file in `report/` (D7 onward).

## 4. Timeline

| Day | Do |
|---|---|
| D1 Sat 21 | Kickoff call (read contract together), create repo, add friends, push skeleton + README + docs, create GitHub Issues. Start `schema.sql`. |
| D2 Sun 22 | Finish schema, write `seed.js`, generate and check the data, push `dashboard.db`. |
| D3 Mon 23 | `server.js`, filter helper, all 8 endpoints, push. Tell the group "API is ready". |
| D4 Tue 24 | Edge cases and validation, Excel export, first deploy attempt. Review friends' first PRs. |
| D5 Wed 25 | Deploy working, live URL in README. Merge approved PRs. |
| D6 Thu 26 | Integration day: pull everything, run the full app, list bugs as Issues, assign them. |
| D7 Fri 27 | Feature freeze. Your 15-minute explanation of backend + database to the others. Start your report parts. |
| Sat 28 – Tue 1 Dec | Screenshots of data tables, `how_to_run.doc`, merge report parts into the final PDF, final test on a clean clone, submit. |

## 5. Report parts you write (in `report/project-and-database.md`)

- Section [a]: client title, available information (list every table and column), required questions.
- Database: ER diagram (draw it from the schema), table descriptions, 3 or 4 representative SQL queries with an explanation.
- Snapshots of the data tables (from the Excel files or a DB viewer).
- Suggested future work (real data connection, authentication and roles, more filters, forecasting, export to PDF, a bigger database like PostgreSQL).

## 6. Definition of done

- `npm install && npm start` works on a clean clone with no extra steps.
- Every endpoint returns exactly the JSON shape in the contract.
- The live URL works and serves the dashboard.
- You can explain every SQL query in your API without looking.
