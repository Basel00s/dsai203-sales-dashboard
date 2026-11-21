# Role B: Layout and Interactivity

**One line:** you build the page the user sees: structure, design, filters, KPI cards, and the JavaScript that connects the filters to the API and to the charts.

**Your files:** `public/index.html`, `public/css/`, `public/js/app.js`, `public/js/filters.js`, `public/mock/` (shared with C).
**Your report part:** section [c] (layout), the snapshot of the complete layout, and the source code of your files. Write it in `report/layout.md`.

Do not edit anything inside `public/js/charts/` (that is C's folder).

---

## 1. What to learn (in this order, learn while building)

### HTML (about 3 hours)
- Page structure: `<!DOCTYPE html>`, `<head>` (title, meta viewport, linking CSS), `<body>`, loading scripts with `<script src>` and why order matters.
- Semantic tags: `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`.
- Form controls: `<select>` (dropdown), `<input type="radio">` (radio buttons share the same `name` so only one is selected), `<input type="checkbox">`, `<label for>`, `<fieldset>` and `<legend>` to group filters.
- `id` vs `class`, and `data-` attributes.

### CSS (about 8 hours, this is your main skill here)
- Box model: `margin`, `padding`, `border`, `box-sizing: border-box`.
- Units: `px`, `rem`, `%`, `vh/vw`, `fr`.
- **Flexbox:** `display: flex`, `flex-direction`, `justify-content`, `align-items`, `gap`, `flex-wrap`, `flex: 1`. Practice: Flexbox Froggy (flexboxfroggy.com).
- **CSS Grid** (this is how you will arrange the charts): `grid-template-columns` with `repeat`, `fr` and `minmax`, `grid-column: span 2`, `gap`, `grid-template-areas`. Practice: CSS Grid Garden (cssgridgarden.com).
- CSS variables (`--primary: #2F6FED;` then `var(--primary)`), using the shared palette from the contract.
- Cards: `border-radius`, `box-shadow`, background colors; typography (font family, size, weight, line height); contrast so text is readable.
- Positioning basics: `position: sticky` for a filter bar that stays visible.
- Responsive design: `@media (max-width: ...)` so the grid becomes one column on small screens.
- Show/hide with a CSS class (`.hidden { display: none; }`).

### JavaScript (about 8 hours)
- Variables, functions, arrays and objects, `map`/`forEach`.
- DOM: `document.querySelector` / `querySelectorAll`, `element.classList.add/remove/toggle`, `element.textContent`.
- Events: `addEventListener('change', ...)` on selects, radios and checkboxes.
- Reading form state: `.value` (select/radio) and `.checked` (checkbox/radio).
- Building a query string: `URLSearchParams`.
- **`fetch` with `async/await`**, `response.json()`, `try/catch` for errors, `Promise.all` to fetch several endpoints at the same time.
- Number formatting: `Intl.NumberFormat` (e.g. `4,820,000` or `$4.8M`).

Good free sources: MDN Web Docs (developer.mozilla.org), javascript.info, Kevin Powell on YouTube for CSS, Flexbox Froggy, CSS Grid Garden.

---

## 2. Your tasks (in order)

1. **Page skeleton:** header (project title + company name), filter bar, KPI row, chart grid. Use the container ids from `docs/SCHEMA_AND_API.md`.
2. **CSS grid layout and theme** using the shared palette. Cards for each chart with a title bar.
3. **Filter bar:**
   - Dropdown: Year (All, 2024, 2025)
   - Checkboxes: Branches (all 10, with a "Select all" control)
   - Checkboxes: Categories (all 4)
   - Radio buttons: Metric (Revenue / Profit / Units)
   - Radio buttons in the branch panel: "Total" / "By category" (switches chart 4 and chart 5)
   - Checkbox: "Show product analysis" (shows or hides the product scatter panel)
   - "Reset filters" button
4. **KPI cards:** four cards (Revenue, Profit, Units, Profit margin) filled from `/api/kpis`, plus an "N/A" display for target values when the API returns `null`.
5. **`app.js`:** collect the filter state, build the query string, fetch all endpoints with `Promise.all`, update KPI cards, call every `render...` function from the contract. Re-run on every filter change.
6. **Loading and error states:** "Loading..." while fetching, a readable message if the API is down.
7. **Responsive check** at laptop and phone widths.
8. **Layout report section [c]** (see section 5 below).

## 3. What you can do alone vs what you need from others

**Alone, from day one:** tasks 1 to 4 and 6 to 7 using placeholder boxes for charts and mock JSON files in `public/mock/` (copy the examples from the contract). Your `app.js` can fetch the mock files first and switch to `/api/...` later by changing one base URL.

**Need from A**
- D1: repo + folder skeleton (so you have somewhere to push).
- D3: the real API running locally (after pulling `main`).

**Need from C**
- D2: the stub chart files (functions that exist but draw nothing), so your `app.js` does not crash when it calls them.
- D4 onward: real chart files arriving through merged PRs. Pull `main` often.

**Agree with C early (day 1):** the palette and the container ids. Both are already in the contract.

## 4. Timeline

| Day | Do |
|---|---|
| D1 Sat 21 | Kickoff call. Clone the repo, create your branch, read the contract. Start HTML/CSS learning (flexbox + grid). |
| D2 Sun 22 | `index.html` skeleton with all container ids, CSS grid layout, header, empty chart cards. First PR. |
| D3 Mon 23 | Filter bar UI (all controls), KPI cards, CSS variables/palette. Start JavaScript learning (DOM, events, fetch). |
| D4 Tue 24 | `app.js` with mock data: filters change, KPI cards update, show/hide logic for the two toggles. |
| D5 Wed 25 | Switch to the real API, call the render functions of C, loading/error states, responsive layout. |
| D6 Thu 26 | Integration: fix filter bugs, spacing, alignment. Test every filter combination. |
| D7 Fri 27 | Feature freeze. Your 15-minute explanation to the others. Start `report/layout.md`. |
| Sat 28 – Tue 1 Dec | Final screenshots of the full layout (desktop, and with different filters), finish report text. |

## 5. Report part you write (`report/layout.md`) — section [c]

Answer both of these clearly:

1. **Why these positions** for every element: title, filter bar, KPI cards, each chart, toggle controls. Use real design reasoning: KPIs on top because people read top-left first and want the summary before the details; filters at the top so they affect everything below; the map and the trend are the main visuals so they are large; related charts are next to each other, etc.
2. **Points that may be criticized** (be honest, the doctor asks for this): for example, too many charts on one screen; the filters do not apply to the targets by category; small phone screens need scrolling; color-only differences are hard for color-blind users; the map is not readable for very small values. For each point, add what you would improve.

Also add: screenshot of the complete layout, and your source files (`index.html`, `app.js`, `filters.js`, CSS) with comments.

## 6. Definition of done

- Every filter changes every chart it should, with no page reload.
- A broken API shows a message, not a blank page.
- The layout looks right at laptop and phone widths.
- You can explain every line of `app.js` to a TA.
