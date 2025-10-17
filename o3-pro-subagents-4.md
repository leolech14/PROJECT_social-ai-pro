Below is a **repo‑hygiene & integration playbook** aimed at the pain‑points you called out — backend ↔ frontend drift, junk files, “half‑edited” commits, and debugging nightmares. Use it as a checklist before you import the ZIP with your updated agents.

---

\## 1 Repository & directory layout

| Layer           | Purpose                                             | Concrete layout                                            |
| --------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| **`apps/`**     | runnable artefacts                                  | `apps/backend/`, `apps/web/`, `apps/cli/`                  |
| **`packages/`** | shared libs & design‑systems                        | `packages/api-sdk/`, `packages/ui-kit/`, `packages/utils/` |
| **`api/`**      | single‑source OpenAPI specs                         | `api/openapi.yaml`, `api/contracts/`                       |
| **`scripts/`**  | dev/CI utilities (Bash & Claude slash‑cmd wrappers) | keep cross‑platform helpers here                           |
| **`tools/`**    | custom Claude Bash tools **versioned** with code    | `tools/agent-orchestrate`, …                               |
| **`.claude/`**  | agents, commands, log shards                        | mirror structure you drafted                               |
| **`docs/`**     | ADRs, run‑books, diagrams                           | enforce Markdown lint                                      |

> **Why a monorepo?** Nx/Turborepo (or Bazel) handle **task graph & caching**, ensuring the backend change auto‑re‑builds the generated frontend SDK instead of leaving stale code around ([Turborepo][1], [Syskool][2]).

---

\## 2 Backend ↔ frontend contract‑sync

1. **Spec‑first**: keep an OpenAPI (or GraphQL) schema in `/api/`.
2. **Code‑gen on every build**:

   ```bash
   openapi-generator-cli generate -i api/openapi.yaml \
       -g typescript-axios -o packages/api-sdk
   ```

   Clients are re‑generated automatically; stale methods disappear ([LogRocket Blog][3], [Sander ten Brinke][4]).
3. **Contract tests** (Pact):
   *Consumer* defines a pact file, *provider* verifies it in CI.
   Re‑verify on every merge so incompatible changes are blocked ([thenewsgod.com][5], [Devzery Latest][6]).

---

\## 3 Automated hygiene gates

| Stage                 | Tool                                        | What it blocks                                       | Notes                                                                                   |
| --------------------- | ------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **pre‑commit**        | `pre-commit` / Husky                        | unformatted code, TODOs, secrets                     | works cross‑lang; trivial to add new hooks ([Stack Overflow][7], [pythonsnacks.com][8]) |
| **static analysis**   | ESLint, Ruff, ShellCheck                    | style & simple bugs                                  | fail‑fast in <3 s                                                                       |
| **dead‑code scan**    | `ts-prune`, `vulture`, “Deadcode‑Detective” | unused exports, functions, files                     | run after code‑gen; fails CI if diff ([GitHub][9], [effectivetypescript.com][10])       |
| **PR hygiene**        | Danger JS                                   | PRs touching > N files, missing tests, junk binaries | auto‑comments & blocks merge ([danger.systems][11], [GitHub][12])                       |
| **integration tests** | Playwright / Jest + Supertest               | end‑to‑end flows                                     | executed per‑service matrix                                                             |

Every gate runs in **GitHub Actions** (or GitLab CI) cached with Nx/Turborepo so only affected projects rebuild.

---

\## 4 Claude‑aware clean‑up workflow

### 4.1 Commit protocol for agents

| Step                        | Command / tool                                               | Behaviour                      |
| --------------------------- | ------------------------------------------------------------ | ------------------------------ |
| 1 Generate code             | sub‑agent writes to feature branch                           | include task ID in branch name |
| 2 Run `repo‑lint` slash‑cmd | Bash tool wraps hygiene gates                                | aborts on violations           |
| 3 Open PR                   | Claude’s *code‑reviewer* agent is auto‑requested as reviewer |                                |
| 4 Merge via squash          | removes WIP commits; ensures linear history                  |                                |

### 4.2 `repo‑lint` Bash tool (snippet)

```bash
#!/usr/bin/env bash
set -euo pipefail
npm run lint
npm run test -- --runInBand
deadcode-detective .
danger ci            # only inside CI
```

The agent never pushes if **any** check fails, so half‑deleted lines cannot reach `main`.

---

\## 5 Junk‑file & orphan‑branch trimming

* **Weekly scheduled job** runs:

  ```bash
  git fetch -p && gh repo sync
  nx affected:apps --base origin/main --target build
  fdupes -rdN .          # deduplicate binaries
  git clean -fxd -e .env # remove untracked build artefacts
  ```
* Results logged to **`tools/agent-maint`** via the common log bus; if Δ > 20 MB, auto‑opens a cleanup PR.

---

\## 6 Structural strictness via `CODEOWNERS`

```
/api/openapi.yaml     @backend-team
/packages/api-sdk/**  @frontend-team
/.claude/agents/**    @ai-core-team
```

Merges touching both backend & SDK require review from both teams — Claude sub‑agents count as reviewers if configured with PAT tokens.

---

\## 7 Advanced Shield‑rails

| Concern                   | Solution                                                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Stale feature toggles** | CLI tool runs `ts-prune --include-flagged "@deprecated"` monthly; flags removal PRs automatically.                            |
| **Secrets creep**         | `gitleaks detect` in pre‑commit; secrets stay out of history.                                                                 |
| **Large asset bloat**     | Git LFS enforced; Danger warns on assets > 500 kB in PR.                                                                      |
| **Agent cross‑talk**      | Per‑topic log shards from the earlier patch; watchers `tail -F` only their shard, no global lock contention.                  |
| **Forgotten migrations**  | Agent opens PR with `schema.sql` *and* Postgres → SQLite golden snapshot; CI runs `sqldiff` to prove migration reversibility. |

---

\## 8 Putting it together in CI (sample matrix job)

```yaml
jobs:
  build-test-lint:
    strategy:
      matrix:
        node: [20]
        lang: [backend, web, cli]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: ${{ matrix.node }} }
      - run: corepack enable && pnpm install --frozen-lockfile
      - run: pnpm nx run-many --target=lint,test,build --projects=${{ matrix.lang }}
```

Nx figures out affected projects; Turborepo caches artefacts for the next workflow ([Turborepo][1]).

---

\## 9 Agent‑specific recommendations

| Agent type               | Extra guard                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **`orchestrator-prime`** | May *only* commit to `.claude/`, `scripts/`, or open PRs; cannot modify app code.      |
| **Code‑generators**      | Must run `deadcode-detective` post‑generation and add the report artefact to the PR.   |
| **Security‑auditor**     | Required reviewer label on PRs touching `/auth/`, `/payment/`, or IAM env vars.        |
| **Cleanup agents**       | Never run on weekends between 08:00–20:00 UTC; prevents conflict with human debugging. |

---

### Next step before the ZIP arrives

1. **Adopt the directory skeleton** (section 1).
2. **Drop in the gate config files** (`pre-commit‑config.yml`, `dangerfile.js`, `.nx.json`).
3. Wire `repo-lint` & `agent-maint` into `.claude/commands/`.

When you upload your agents we’ll:

* verify each agent’s scope matches the new `CODEOWNERS` & directory rules,
* add slash‑commands that call the hygiene tools,
* patch their system prompts so they *never push* without passing `repo-lint`.

With these rails in place the repo **stays coherent**, back‑ & front‑end share a single contract, and dead code is continuously excised—no more “where did that stray line come from?” evenings.

[1]: https://turborepo.com/docs/crafting-your-repository?utm_source=chatgpt.com "Crafting your repository - Turborepo"
[2]: https://syskool.com/monorepo-architecture-with-nx-and-turborepo-for-fullstack-apps/?utm_source=chatgpt.com "Monorepo Architecture with Nx and Turborepo for Fullstack Apps"
[3]: https://blog.logrocket.com/generating-openapi-api-clients-angular/?utm_source=chatgpt.com "Generating OpenAPI API clients for Angular - LogRocket Blog"
[4]: https://stenbrinke.nl/blog/openapi-api-client-generation/?utm_source=chatgpt.com "Everything you need to know about OpenAPI and API client generation"
[5]: https://thenewsgod.com/best-practices-for-pact-testing-in-microservices/?utm_source=chatgpt.com "Best Practices for Pact Testing in Microservices - The News God"
[6]: https://www.devzery.com/post/pact-define-contract-testing-guide?utm_source=chatgpt.com "Pact Define: Guide to Contract Testing for Microservices 2025"
[7]: https://stackoverflow.com/questions/70778806/pre-commit-not-using-virtual-environment?utm_source=chatgpt.com "pre-commit not using virtual environment - Stack Overflow"
[8]: https://www.pythonsnacks.com/p/pre-commit-hooks-python?utm_source=chatgpt.com "Using pre-commit hooks for your Python project"
[9]: https://github.com/rathi-yash/Deadcode-Detective?utm_source=chatgpt.com "GitHub - rathi-yash/Deadcode-Detective: Deadcode Detective is a fast ..."
[10]: https://effectivetypescript.com/2020/10/20/tsprune/?utm_source=chatgpt.com "Finding dead code (and dead types) in TypeScript"
[11]: https://danger.systems/js/plugins/danger-plugin-pull-request.html?utm_source=chatgpt.com "Danger JS Plugin - danger-plugin-pull-request"
[12]: https://github.com/danger/danger-js/issues/1432?utm_source=chatgpt.com "[BUG] GitHub API request fails for PR with > 300 files change"
