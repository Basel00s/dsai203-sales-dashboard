# Git and GitHub Guide (for people who never used it)

Read this once (15 minutes). After that, use the "Daily routine" section every time you work.

---

## 1. What is this?

**Git** is a program on your computer that remembers every version of your project. Like "save game" checkpoints: you can go back, and you can see who changed what.

**GitHub** is a website that stores your Git project online so three people can work on the same project without sending zip files.

Words you will hear:

| Word | Meaning |
|---|---|
| **Repository (repo)** | The project folder, tracked by Git, also stored on GitHub |
| **Clone** | Download the repo from GitHub to your computer (once) |
| **Commit** | A saved checkpoint with a message ("add trend chart") |
| **Branch** | Your own copy of the project timeline, where you work without touching others |
| **main** | The official, working version of the project. We never work on it directly |
| **Push** | Send your commits from your computer to GitHub |
| **Pull** | Get other people's new work from GitHub to your computer |
| **Pull Request (PR)** | "Please add my branch into main." Someone checks it, then merges it |
| **Merge** | Combine a branch into main |
| **Conflict** | Two people changed the same lines. Git asks you to choose. (Rare for us, since each person owns different files) |

**The idea of our workflow:** nobody changes `main` directly. Everyone works on their own branch, then opens a Pull Request, Basel reviews and merges. So `main` always works.

---

## 2. One-time setup

1. Install **Git**: https://git-scm.com (Windows/Mac). On Linux use your package manager (Arch: `sudo pacman -S git`).
2. Install **Node.js** (LTS version): https://nodejs.org (Arch: `sudo pacman -S nodejs npm`).
3. Install **VS Code**: https://code.visualstudio.com
4. Create a GitHub account at https://github.com and send your username to Basel, so he adds you to the repo. Accept the invitation (email or the GitHub notifications bell).
5. In VS Code, click the **Accounts icon** (bottom left, person icon) → **Sign in with GitHub** and follow the browser steps.
6. Tell Git who you are (open the terminal in VS Code: `Ctrl+`` ` ``), run these two lines with your own name and email:

```
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

7. Install the VS Code extension **GitHub Pull Requests** (Extensions icon on the left → search the name → Install). It lets you create PRs from VS Code.

---

## 3. Get the project (once)

1. Open the repo page on GitHub, click the green **Code** button, copy the HTTPS link.
2. In VS Code press `Ctrl+Shift+P`, type **Git: Clone**, press Enter, paste the link, choose a folder on your computer.
3. When VS Code asks "Open the cloned repository?", click **Open**.
4. Open the terminal (`Ctrl+`` ` ``) and run: `npm install`
5. Run the app: `npm start`, then open http://localhost:3000

(If `npm start` says the API or database is not there yet, pull again later, Basel is still building it.)

---

## 4. Daily routine (every time you work)

### Step 1: Get the latest work
1. Click the **branch name** at the bottom left of VS Code (it says `main`).
2. Choose `main`.
3. Click the **Sync Changes** button in the Source Control panel (the icon with the branch on the left sidebar), or run in the terminal: `git pull`

### Step 2: Create your branch (only the first time for each new task)
1. Click the branch name at the bottom left → **Create new branch...**
2. Name it with this pattern: `yourrole/what-you-do`
   - B examples: `b/layout-skeleton`, `b/filters`
   - C examples: `c/branch-chart`, `c/map-chart`
3. Press Enter. You are now on your branch (the bottom left shows its name).

### Step 3: Work, then commit often
1. Edit your files.
2. Open **Source Control** (left sidebar, third icon, or `Ctrl+Shift+G`). You will see your changed files.
3. Click the **+** next to each file you want to save (this is called "staging"). Only stage your own files.
4. Write a short message in the box, for example: `feat: add trend line chart`
5. Click **Commit**.

Message style: start with `feat:` (new thing), `fix:` (bug), `docs:` (text), `style:` (CSS only).
Commit when something small works, not once per day.

### Step 4: Send your branch to GitHub
- First time for this branch: click **Publish Branch**.
- Later commits: click **Sync Changes** (or run `git push`).

### Step 5: Open a Pull Request
1. Go to the repo on GitHub. A yellow banner appears: **Compare & pull request**. Click it.
   (Or use the GitHub Pull Requests extension: the GitHub icon on the left sidebar → **Create Pull Request**.)
2. Title: what you did. Description: one or two lines, and a screenshot if it is visual.
3. Click **Create pull request**.
4. Tell Basel in the group chat. He reviews and merges it.

### Step 6: Next task
Go back to Step 1 (switch to `main`, pull), then create a new branch for the next task.

---

## 5. Keeping your branch up to date (when others merged things)

If your branch lives for more than one day, bring in the latest `main`:

1. Switch to `main` and pull (Step 1).
2. Switch back to your branch.
3. Press `Ctrl+Shift+P`, type **Git: Merge Branch...**, choose `main`.
4. If there are no conflicts, you are done. Then push.

## 6. If you get a conflict

VS Code shows the file with a red mark and lines like `<<<<<<<`. This means two versions of the same lines.

1. Open the file. Above the conflict you will see buttons: **Accept Current Change**, **Accept Incoming Change**, **Accept Both Changes**.
2. Read both versions, choose the right one (or both if both are needed).
3. Save the file, stage it (**+**), and commit.

If you are not sure, **do not guess**. Ask Basel. A wrong choice can delete someone's work.

---

## 7. Rules that avoid problems

1. **Never commit to `main`.** Always check the branch name at the bottom left before you commit.
2. **Pull before you start working**, every day.
3. **Only edit your own files** (see the README table). Need a change in someone else's file? Ask them in the chat.
4. **Never commit `node_modules`** (a `.gitignore` file already ignores it). If VS Code shows thousands of changed files, stop and ask.
5. **Commit small and often**, with clear messages.
6. **Do not delete the `.db` file or change `package.json`** unless Basel asked you to.
7. **Something went wrong?** Do not panic and do not delete the project folder. Ask. Everything committed can be recovered.

## 8. Quick command cheat sheet (same things as the buttons)

| What | Command |
|---|---|
| Download latest | `git pull` |
| New branch | `git switch -c b/my-task` |
| See what changed | `git status` |
| Stage everything you changed | `git add .` |
| Commit | `git commit -m "feat: my message"` |
| Send to GitHub | `git push` |
| Which branch am I on? | `git branch` |
| Switch to main | `git switch main` |
