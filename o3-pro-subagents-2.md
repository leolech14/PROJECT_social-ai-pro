Below is a **two‑part field‑guide** you can drop straight into your Claude Code repo:

---

\## Part I – Crafting robust & powerful Bash tools

### 1  Project structure & Claude registration

```
.
├── .claude/
│   ├── commands/          # one file per slash‑command
│   ├── agents/            # sub‑agent YAMLs
│   └── CLAUDE.md          # human‑readable doc for every tool
└── bin/
    └── my‑tool            # actual Bash script (symlink into $PATH)
```

*Add the tool name to* `CLAUDE.md` *and whitelist it in* `/permissions` *or via* `--allowedTools "Bash(my-tool:*)"` ([Anthropic][1]).

---

\### 2  Use the “strict mode” skeleton

```bash
#!/usr/bin/env bash
set -euo pipefail  # strict‑error handling  :contentReference[oaicite:1]{index=1}
IFS=$'\n\t'        # predictable word‑splitting

VERSION="0.1.0"
LOG_LEVEL="INFO"

usage() {
  cat <<EOF
$(basename "$0") – one‑liner description

Usage: $(basename "$0") [-f|--flag] <arg>
EOF
}

# ---------- argument parsing ----------
flag=false
while [[ $# -gt 0 ]]; do
  case $1 in
    -f|--flag) flag=true ;;
    -h|--help) usage; exit 0 ;;
    -v|--version) echo "$VERSION"; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
  shift
done
```

Strict mode (`set -euo pipefail`) prevents silent failures; use `IFS` to avoid word‑splitting surprises ([Bertvv][2]).

---

\### 3  Reusable logging helpers (stdout JSON, stderr human)

```bash
log() {
  local lvl=$1 msg=$2
  printf '{"ts":"%s","level":"%s","msg":"%s"}\n' \
    "$(date --iso-8601=seconds)" "$lvl" "$msg"
}

log_err() { printf '%s: %s\n' "$1" "$2" >&2; }
```

Structured JSON makes the logs machine‑parsable (e.g. `jq` or Loki); sample inspired by Dev.to post ([DEV Community][3]).

---

\### 4  Protect shared resources with `flock`

When your tool writes to a shared file (e.g. the cross‑agent log in Part II) wrap critical sections:

```bash
exec 200>"$LOCKFILE"            # 200 = private FD
flock -n 200 || { log_err ERROR "lock busy"; exit 1; }

log INFO "critical section begins"
# …write to shared resource…
log INFO "done"
```

`flock` guarantees single‑writer semantics and avoids garbled output ([CommandMasters][4]).

---

\### 5  Quality gates

| Gate          | Command                                                                       |
| ------------- | ----------------------------------------------------------------------------- |
| *Static lint* | `shellcheck my‑tool` – catch quoting & SC‑errors ([Bertvv][2])                |
| *Unit tests*  | `bats test/` – Bats‑core is the de‑facto TAP framework for Bash ([GitHub][5]) |
| *CI*          | Run both in GitHub Actions before publishing                                  |

---

\### 6  Packaging & distribution tips

* **Single‑file release**: embed helper functions, then run `cat bin/my-tool | gzip > my-tool.gz`.
* **Homebrew tap** or **apt repo** for team‑wide rollout.
* **SemVer tags** and `--version` flag so sub‑agents can assert features.

---

\### 7  Wire it into Claude Code

1. Place the script in `bin/` and ensure `$PATH` contains that dir.

2. Create `slash‑command` stub in `.claude/commands/quick‑deploy`:

   ```yaml
   #!/usr/bin/env bash
   my-tool "$@"
   ```

3. Document usage in `CLAUDE.md` so agents can self‑discover.

4. Add a focused sub‑agent if the tool is domain‑specific (e.g., `deploy‑orchestrator`).

---

\## Part II – A simple, robust **common‑log bus** for Sub‑Agent communication

\### 1  Design goals

* **Append‑only / human‑readable**
* **Structured** enough for filtering
* **Concurrent‑safe** (many writers)
* **Zero dependencies** beyond Bash + coreutils

\### 2  Directory & file

```
.claude/
└── logs/
    └── agents.ndjson     # shared JSON‑Lines file
```

\### 3  Schema (JSON‑Lines)

```json
{ "ts": "2025-08-03T12:34:56Z",
  "agent": "security-auditor",
  "level": "INFO",
  "topic": "review",
  "payload": "PR #42 passed all checks" }
```

Feel free to add `cmd`, `args`, `task_id`, etc.

---

\### 4  Atomic write helper (copy‑paste ready)

```bash
LOGFILE=".claude/logs/agents.ndjson"
LOCKFILE=".claude/logs/agents.lock"

jlog() {                       # jlog LEVEL TOPIC MSG
  local lvl=$1 topic=$2 msg=$3
  local line
  line=$(printf '{"ts":"%s","agent":"%s","level":"%s","topic":"%s","payload":"%s"}\n' \
               "$(date --iso-8601=seconds)" "$AGENT_NAME" "$lvl" "$topic" "$msg")
  (
    flock -w 2 200 || exit 1   # wait 2 s
    echo "$line" >> "$LOGFILE"
  ) 200>"$LOCKFILE"
}
export -f jlog                 # callable from subshells
```

*Writers* obtain an exclusive lock (`flock -w 2`) so JSON lines never interleave ([CommandMasters][4]).

---

\### 5  Reading / subscribing

Agents that need real‑time updates can tail & filter:

```bash
tail -n0 -F "$LOGFILE" | jq --unbuffered 'select(.topic=="review")'
```

`tail -F` survives log rotation and continuously streams new events ([LinuxCapable][6]).

---

\### 6  Log rotation

Add a weekly `logrotate` rule:

```
.claude/logs/agents.ndjson {
    weekly
    rotate 12
    compress
    sharedscripts
    postrotate
        # notify agents if needed
    endscript
}
```

Rotation works seamlessly because each write re‑opens the file through `flock`.

---

\### 7  Pattern: “Command bus” over the log

1. **Producer agent** writes:

   ```bash
   jlog "INFO" "cmd" '{"action":"create_app","name":"billing-service"}'
   ```

2. **Consumer agent** tails for `"topic":"cmd"`, parses `payload` with `jq` and dispatches work.

3. **Acknowledgements**: producer watches for a later entry with matching `task_id`.

This *file‑based message queue* avoids extra dependencies yet lets sub‑agents coordinate tasks.

---

\### 8  Hardening checklist

| ✔︎ | Item                                       |
| -- | ------------------------------------------ |
| ☐  | Enforce max size (truncate after rotation) |
| ☐  | Validate JSON with `jq -e` before append   |
| ☐  | Use ISO‑8601 timestamps (easy sorting)     |
| ☐  | Ship logs to Loki/Grafana for history      |

---

\## Quick copy‑paste reference

```bash
# ------- include in every agent wrapper -------
export AGENT_NAME="$(basename "$0")"
source "$(git rev-parse --show-toplevel)/scripts/log_bus.sh"
jlog INFO "startup" "agent online"
```

Now each sub‑agent can broadcast progress, and any watcher (human or automated) can react instantly.

---

\### Why this works

* **Strict Bash + ShellCheck + tests** ⇒ reliability ([Bertvv][2], [GitHub][5])
* **`flock` serialization** ⇒ no race conditions ([CommandMasters][4])
* **NDJSON + `tail -F`** ⇒ trivial streaming & filtering ([DEV Community][3], [LinuxCapable][6])
* **Claude Code tool registration** ⇒ agents can invoke the script autonomously ([Anthropic][7])

Adopt the templates above and you’ll have **battle‑tested Bash utilities** *and* a **lightweight log‑bus** that let your Claude sub‑agents collaborate safely, transparently, and at high throughput.

[1]: https://docs.anthropic.com/en/docs/claude-code/cli-reference "CLI reference - Anthropic"
[2]: https://bertvv.github.io/cheat-sheets/Bash.html "Bash best practices | cheat-sheets"
[3]: https://dev.to/zsevic/json-logging-bash-scripts-15ob "JSON logging bash scripts - DEV Community"
[4]: https://commandmasters.com/commands/flock-common/ "How to use the command 'flock' (with examples)"
[5]: https://github.com/bats-core/bats-core "GitHub - bats-core/bats-core: Bash Automated Testing System"
[6]: https://linuxcapable.com/tail-command-in-linux-practical-examples-and-use-cases/ "tail Command in Linux: Practical Examples and Use Cases - LinuxCapable"
[7]: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/bash-tool "Bash tool - Anthropic"
