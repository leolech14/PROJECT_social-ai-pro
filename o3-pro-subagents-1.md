Below is the **complete “menu” of places where you tell Claude Code which model a given request or sub‑agent should use, and how to switch between *Haiku* (cheap / fast) and *Opus* (deep / expensive).**

---

## 1 Per‑sub‑agent (YAML front‑matter) – **strongest override**

Add a `model:` key inside the front‑matter of any agent file stored in `.claude/agents/` (project scope) or `~/.claude/agents/` (user scope):

```yaml
---
name: quick-drafts
description: Generates first‑pass docs and boiler‑plate code
model: haiku        # <‑‑ “haiku”, “sonnet”, or “opus”
tools: Read, Bash
---

You are a rapid drafting assistant…
```

```yaml
---
name: security-auditor
description: MUST be invoked for anything touching auth, crypto, or payments
model: opus         # full reasoning depth
tools: Read, Grep, Glob, Bash
---

You are a senior security engineer…
```

*If `model` is omitted the agent inherits whatever is in scope globally.*
The feature has been supported since Claude Code v1.0.64 and follows exactly the pattern above ([GitHub][1]).

---

## 2 One‑off sessions (CLI flag)

```bash
# Start an interactive REPL on the latest Opus
claude --model opus
# Non‑interactive batch run on Haiku
claude -p "summarise CHANGELOG" --model haiku
```

The `--model` flag wins over everything except an explicit `model:` in an agent file ([Anthropic][2]).

---

## 3 Project‑ or user‑wide default (`settings.json`)

Create or edit:

* **Project**: `.claude/settings.json`
* **User**: `~/.claude/settings.json`

```json
{
  "model": "claude-4-opus-20250701",      // pins exact version
  "env": {
    "ANTHROPIC_SMALL_FAST_MODEL": "claude-3-5-haiku-20250724"
  }
}
```

* `model` key sets the **primary** model (used when no other override is present).
* `ANTHROPIC_SMALL_FAST_MODEL` lets Claude pick a cheaper Haiku automatically for background‑style calls the CLI labels *“small/fast”* ([Anthropic][3]).

Settings precedence (top wins): **CLI flag → local settings → shared settings → user settings** ([Anthropic][3]).

---

## 4 Environment variables (good for CI / scripts)

```bash
export ANTHROPIC_MODEL=opus
export ANTHROPIC_SMALL_FAST_MODEL=claude-3-5-haiku-20250724
claude "run the overnight migration"
```

Anything in the `env` block of `settings.json` is identical to exporting the variable in your shell ([Anthropic][3]).

---

## 5 Interactive tweak during a live session

Inside an active REPL you can run:

```
/config model opus
/config model haiku --global   # writes to ~/.claude/settings.json
```

This is just a friendly wrapper around the same `settings.json` mechanism.

---

### Choosing *Haiku* vs *Opus*: practical guidelines

| Task type                                                                       | Recommended model    | Rationale                                |
| ------------------------------------------------------------------------------- | -------------------- | ---------------------------------------- |
| quick summaries, boiler‑plate, rote refactors                                   | **Haiku**            | Cheapest, lowest latency                 |
| ordinary feature work, medium‑size test suites                                  | **Sonnet** (default) | Balanced cost / quality                  |
| architecture reviews, security audits, anything legally or financially critical | **Opus**             | Highest reasoning depth, longest context |

This mirrors Anthropic’s own “low/med/high‑complexity” guidance in the open‑source 50‑agent matrix ([GitHub][1]).

---

### Troubleshooting checklist

1. **Agent not switching?** Open the file with `/agents edit <name>` and confirm the `model:` line is present and spelled correctly.
2. **Model flag ignored?** Check whether the invoked sub‑agent has its own `model:`—that always wins.
3. **Unexpected Haiku calls?** Look for `ANTHROPIC_SMALL_FAST_MODEL` in your shell or settings; unset it if you don’t want automatic downgrades.
4. **Cost shock?** Pin exact dated model IDs (e.g., `claude-4-opus-20250701`) instead of bare `opus` so upgrades don’t surprise you when Anthropic rolls a new revision.

Follow the hierarchy above and you’ll have **full, predictable control** over when Claude Code uses *Haiku* for speed/cost and when it unlocks the full *Opus* horsepower.

[1]: https://github.com/wshobson/agents "GitHub - wshobson/agents: A collection of production-ready subagents for Claude Code"
[2]: https://docs.anthropic.com/en/docs/claude-code/cli-reference "CLI reference - Anthropic"
[3]: https://docs.anthropic.com/en/docs/claude-code/settings "Claude Code settings - Anthropic"
