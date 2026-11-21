# GitHub Manager Guide (Basel)

Your job: set up the repo, keep `main` always working, review and merge PRs, integrate everything at the end, and prepare the submission.

---

## 1. Setup (D1, before the kickoff call ends)

### 1.1 Create the repo
1. On GitHub: **New repository**, name `dsai203-sales-dashboard`.
2. Visibility: see the note below. Add a README: no (you will push yours). Add `.gitignore`: choose Node (or write your own).
3. Add friends: **Settings → Collaborators → Add people** (they need their GitHub usernames; they accept by email or notification).

**Note on branch protection:** on GitHub's free plan, protected-branch rules are only enforced on **public** repos (this may change, check Settings → Branches). The data is fake, so public until after grading is fine and lets you enforce rules. If you keep it private, the rule "nobody pushes to main" is just a team agreement.

### 1.2 Local setup and skeleton (single-line commands)
Install tools on Arch if missing:
```
sudo pacman -S git nodejs npm
```
Clone and enter:
```
git clone https://github.com/YOUR_USERNAME/dsai203-sales-dashboard.git && cd dsai203-sales-dashboard
```
Create the folders (git ignores empty folders, so `.gitkeep` files hold them):
```
mkdir -p public/css public/js/charts public/mock src db data report docs && touch public/js/charts/.gitkeep public/mock/.gitkeep data/.gitkeep report/.gitkeep
```
Create `.gitignore`:
```
printf "node_modules/\n.env\n*.log\n.DS_Store\n" > .gitignore
```
Initialize npm and install packages:
```
npm init -y && npm install express better-sqlite3 exceljs
```
Copy the `README.md` and the `docs/` files from this package into the repo, then push:
```
git add . && git commit -m "chore: project skeleton, docs and contract" && git push origin main
```

### 1.3 Protect main (if the repo is public)
**Settings → Branches → Add branch ruleset (or classic rule)** for `main`:
- Require a pull request before merging
- Require 1 approval (you)
- Block force pushes
Allow yourself to bypass only if needed in the final hours.

### 1.4 Merge style
**Settings → General → Pull Requests:** enable "Allow squash merging" and disable the others. Squash gives one clean commit per PR in `main`.

### 1.5 Issues and board
Create labels: `backend`, `layout`, `charts`, `docs`, `bug`, `blocked`.
Create one **Issue per task** from the role files (about 25 in total), assign it to the owner, add the label. A simple **Project board** (Projects tab → New project → Board) with columns Todo / Doing / In review / Done keeps everything visible. Do this before the kickoff call if you can, it takes 30 minutes and everybody sees what to do.

---

## 2. Kickoff call checklist (D1)

- [ ] Everybody read `README.md` and `docs/SCHEMA_AND_API.md`
- [ ] Questions about the contract answered; changes made in the file
- [ ] Friends accepted the repo invitation, cloned it, ran `npm install`
- [ ] Friends created their first branch (`b/...`, `c/...`)
- [ ] Everyone knows their role file and today's tasks
- [ ] Group chat created, daily check-in time agreed (10 minutes, every day)
- [ ] Message to the TA sent (questions in README section 9)

---

## 3. Daily management

**Branch naming:** `a/...`, `b/...`, `c/...`. One branch per task, merged and then abandoned.

**Review a PR (5 minutes each)**
1. Open the PR on GitHub → **Files changed**. Check: only the owner's files changed, no `node_modules`, no huge files, code has comments.
2. Pull the branch locally and run it when it matters (charts, API):
```
git fetch origin && git switch b/layout-skeleton && npm start
```
3. Approve or comment. Then **Squash and merge**.
4. Switch back: `git switch main && git pull`

**Review rules**
- Reply to PRs within a few hours, because waiting here blocks the others.
- `main` must always start with `npm start`. If a merge breaks it, fix or revert immediately:
```
git revert -m 1 <merge-commit-hash>
```
(for a squash merge, plain `git revert <commit-hash>` is enough)
- Changes to `docs/SCHEMA_AND_API.md`, `package.json`, `server.js`: only you.

**Merge order (important):** A's schema/API first → B's skeleton → C's stubs → C's real charts → B's `app.js` wiring. This keeps each merge testable.

**Conflicts:** should be rare. If one happens, usually it is `package.json` or `README.md`. Resolve it in VS Code's merge editor (steps in the team guide section 6) and run `npm start` before committing.

---

## 4. Integration (D5-D6)

1. `git switch main && git pull`
2. Make sure all finished PRs are merged (check the board).
3. Clean-clone test, to prove a TA can run it:
```
cd /tmp && git clone https://github.com/YOUR_USERNAME/dsai203-sales-dashboard.git test-run && cd test-run && npm install && npm start
```
4. Open http://localhost:3000 and go through this checklist:
   - [ ] Page loads with real data, no console errors
   - [ ] All 9 chart items show
   - [ ] Year filter changes everything
   - [ ] Branch checkboxes change everything (including the map and gauge)
   - [ ] Category checkboxes change everything; gauge/target KPI shows N/A as designed
   - [ ] Metric radio changes titles and values
   - [ ] "Total / By category" radio swaps charts 4 and 5
   - [ ] "Show product analysis" checkbox shows/hides the scatter
   - [ ] Reset filters works
   - [ ] Empty selection (no branches) shows a "No data" message, no crash
   - [ ] Works on the deployed URL
5. Every failure becomes an Issue with label `bug`, assigned to the owner of that file.
6. Fix, merge, repeat the checklist until clean.

## 5. Feature freeze (D7, Fri 27)

- Announce it in the group. After this, only bug fixes and report work are merged.
- Each person pushes their report file in `report/` through a PR (`report/project-and-database.md`, `report/layout.md`, `report/charts.md`).

---

## 6. Final PDF and submission (Sat 28 – Tue 1 Dec)

**PDF report (you assemble it)**
1. Write everything in one document (Word or LibreOffice is easiest), in this order: project (section [a]), charts (section [b]), layout (section [c]), snapshots of individual charts, snapshot of the full layout, snapshots of the data tables, source code (with comments), future work.
2. Take screenshots from the final running app (consistent browser window size). Save images in `report/images/`.
3. Export as PDF. Check page order, readable screenshots, code not cut off.

**`how_to_run.doc`:** write it in LibreOffice/Word and save as `.doc` with exactly this name (after confirming with the TA what format they expect).

**Tag the final version**
```
git switch main && git pull && git tag -a v1.0 -m "final submission" && git push origin v1.0
```

**Source code package** (the doctor wants the source code submitted):
```
git archive --format=zip --output=dsai203-sales-dashboard.zip v1.0
```
(`git archive` leaves out `node_modules` and the `.git` folder automatically.)

**Final checks before submitting (Tue 1 Dec)**
- [ ] PDF has every item from README section 2
- [ ] `how_to_run.doc` tested by a friend on a different computer
- [ ] Deployed URL works and is written in the PDF and in `how_to_run.doc`
- [ ] The zip runs on a clean machine with `npm install && npm start`
- [ ] Everyone can explain the whole project (TA discussion). Do a 20-minute mock Q&A: each person asks the others about parts that are not theirs

## 7. Backup plan

- If the deployment fails on the last day, you still have the local server: show it running on your laptop and say the API is the "remote server" (confirm that with the TA early, README section 9).
- Keep the Excel files in `data/` committed, so the data exists even if the database file breaks.
- Do not rewrite `main` history (no force push) in the last days.
