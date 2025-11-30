---
title: "My First Oh-My-Zsh Plugin: caff"
date: "2025-11-26T18:00"
description: "My first Oh My Zsh plugin: a smart wrapper around macOS caffeinate to keep long-running builds, tests, and AI-assisted workflows awake without Amphetamine headaches."
tags: ["cli-tools", "productivity"]
---

## TL;DR

GitHub repo: [akalp/caff](https://github.com/akalp/caff)

- As developers we constantly run long builds, tests, containers and AI-assisted workflows that easily outlive macOS’s default sleep behavior.
- Amphetamine is convenient from the menu bar, but especially in clamshell mode its sessions can end abruptly and push the machine toward sleep at awkward moments.
- `caffeinate` is scriptable and process-scoped, but you have to remember flag combos like `-disu`, think in raw seconds via `-t <seconds>`, and it gives you no visual feedback.
- `caff` is my first Oh My Zsh plugin that wraps `caffeinate` with nicer ergonomics: `caff disu 2h -- npm test`, duration presets (`short` / `medium` / `long` / `night`), human-friendly units (`2h`, `30m`), an inline countdown or spinner, quiet mode, and clean exit-code propagation.

For years I treated "keeping my Mac awake" as an annoying detail I only thought about when something _broke_:

- A long test suite died halfway through because the machine went to sleep.
- A big Docker image build got interrupted.
- An AI-assisted refactor or multi-agent workflow was still running when I left the desk — and silently paused when the screen turned off.

If you do any kind of serious development on macOS, there's a good chance you've run into the same thing: you start a long-running task, step away for a bit, and come back to discover that **sleep won the race**.

This blog post is about how I tried to solve that with Amphetamine, why that wasn't quite enough for my setup (especially in **clamshell mode**), and how that annoyance pushed me to write my first Oh My Zsh plugin: `caff`, a smarter wrapper around macOS' built‑in `caffeinate` command.

---

## Why a developer needs to keep the machine awake

Modern development is full of tasks that take longer than a coffee break:

- **Long builds**

  - Frontend bundles in complex monorepos
  - Native iOS/Android builds
  - CI-like local scripts that run multiple steps

- **Heavy test runs**

  - Full integration or end-to-end test suites
  - Load tests or benchmarks

- **Dev tooling and environments**

  - Docker image builds and multi-container setups
  - Local Kubernetes clusters
  - Database migrations and seed scripts

- **AI-assisted workflows**

  - Long-running codegen or refactor jobs
  - Background documentation generation
  - Multi-agent systems orchestrating many small steps

The pattern is the same: you run something that might take 10, 30, 60+ minutes. You _don't_ want to sit and wiggle the mouse every five minutes to keep the Mac awake. You probably want to:

- Kick off the task
- Maybe glance at logs
- Walk away, grab coffee, do something else
- Come back to a finished job — not a half-baked one paused in sleep

On top of that, if you're using **AI tooling** heavily, you might:

- Trigger a long refactor on a large codebase
- Ask an agent to generate many tests or docs
- Let a script iterate over files and call an API many times

In those scenarios, you might _not_ be actively typing the whole time. The system sees "no input" and assumes it's safe to sleep, even though a lot of important work is still in progress.

So we need something that tells macOS: **"Stay awake intentionally while I'm doing this, then go back to normal."**

## Amphetamine and `caffeinate`: the usual suspects

On macOS, there are two main approaches people use:

### Amphetamine

[Amphetamine](https://apps.apple.com/us/app/amphetamine/id937984704) is a popular macOS app for preventing sleep. It gives you:

- A nice **menu bar UI**
- Presets like "stay awake for X hours" or "while this app is running"
- Quick toggles without touching the terminal

For many users, that's more than enough. Click, pick a duration, done.

### `caffeinate`

Under the hood, macOS also ships a CLI tool:

```zsh
caffeinate [options] [command]
```

This utility can:

- Prevent **display**, **idle**, **system** sleep, or combinations
- Run for a fixed duration via `-t <seconds>`
- Stay awake **while a specific command is running**

For example:

```zsh
# Prevent system sleep for 1 hour
caffeinate -t 3600

# Prevent display + idle sleep while running tests
caffeinate -d -i -- npm test
```

It’s powerful and scriptable — but the UX is… very raw:

- You have to remember flag combinations (`-d -i -s -u` etc.)
- Durations must be in seconds
- No visual feedback or countdown
- No handy presets like "short", "long", or "overnight"

Still, as a developer living in the terminal, `caffeinate` feels like the right primitive to build on.

## The Amphetamine + clamshell problem

For a while, I used Amphetamine as my main sleep blocker. It mostly worked — _until_ I combined it with **clamshell mode**.

My setup looks roughly like this:

- MacBook Pro in clamshell
- External monitor(s)
- External keyboard + mouse

In that setup, Amphetamine sessions behave a bit differently:

- You start a timed session, e.g. **2 hours**.
- You close the lid, work on the external display, everything is fine.
- When the **timer ends** or you **manually stop** the session, macOS immediately goes back to its default sleep behavior.

The annoying part: in clamshell mode, that usually means:

> The external screen goes dark and the machine basically wants to sleep _right now_.

This leads to a couple of UX problems:

- If you **end** an Amphetamine session (or it expires) while still in clamshell, you can be kicked out of what you were doing.
- If you **forget** the session is about to end, you might lose context or ongoing work on the external display.
- Managing sessions starts to feel brittle: "Will my Mac instantly go to sleep if I hit stop?" is not a good mental model while you're in the middle of a task.

For short tasks this is tolerable. But when you're constantly running builds, tests, and AI-assisted workflows, you don't want the **sleep policy** to surprise you.

I wanted something more **predictable** and more **terminal-native**.

## Why `caffeinate` is a better fit for my workflow

`caffeinate` has a few built-in advantages if you live in the shell:

1. **Process-scoped sessions**
   You can say "stay awake **exactly** as long as this command runs":

   ```zsh
   caffeinate -d -i -- npm run build
   ```

   When the build is done, the process exits and the system returns to normal. There's no separate "session" to remember to stop.

2. **Scriptability**
   You can bake it into:

   - Shell aliases and functions
   - Project scripts (`package.json`, Makefiles, etc.)
   - CI-like local runners

3. **Fine-grained control**
   You can choose exactly which sleep sources to block:

   - `-d` — display sleep
   - `-i` — idle sleep
   - `-s` — system sleep
   - `-u` — declare user is active

4. **Works well with clamshell mode**
   When used with the right flags and/or durations, `caffeinate` is just another process. It doesn't care whether the lid is open or closed — if it's running, it will keep the system awake according to the flags you gave it.

In other words, `caffeinate` behaves like a **tool** you can compose with other tools. It feels like a better foundation for a dev-centric workflow than a mouse-driven menu bar app.

The only issue: its **ergonomics** are not great. Even though you can pack flags as `-disu`, it still expects raw seconds via `-t <seconds>` and gives you no visual feedback.

- I don't want to think in seconds.
- I'd like some quick presets like `short`, `medium`, `long`, `night`.
- I'd like a simple visual indication when I'm in "awake mode".

So I did what any annoyed developer would do: I wrote a wrapper.

## Introducing `caff`: a smart `caffeinate` wrapper

`caff` is my first Oh My Zsh plugin — a small Zsh function that turns `caffeinate` into something I actually enjoy using.

At a high level, it gives you:

- Shorthand flags using **`disu` syntax**
- Human-friendly durations like `2h`, `30m`
- Named presets (`short`, `medium`, `long`, `night`/`overnight`)
- Optional command execution via `--`
- An interactive **countdown bar** or **spinner**
- Start/finish messages, quiet mode, and proper exit codes

### A nicer mental model

Instead of this:

```zsh
# Using caffeinate directly (flags must include a leading dash, duration is in seconds)
caffeinate -disu -t 7200 -- npm run build
```

I can now write:

```zsh
caff disu 2h -- npm run build
```

Where:

- `disu` → `-d -i -s -u`
- `2h` → `-t 7200`

The plugin also defines a short alias, so this works too:

```zsh
cf disu 2h -- npm run build
```

### Human durations and presets

`caff` understands:

- `2h` → 2 hours
- `30m` → 30 minutes
- `t=3600` → raw seconds, like `-t 3600`

Plus named presets:

- `short` → 15 minutes
- `medium` → 1 hour
- `long` → 3 hours
- `night` / `overnight` → 8 hours

So common patterns become very readable:

```zsh
# Short session while you grab a coffee
caff di short

# Keep the machine fully awake for the next 3 hours
caff disu long

# Overnight job with tests
caff disu night -- yarn test:e2e
```

### Command or no command

`caff` adjusts its behavior depending on whether you pass a command after `--`.

#### With a command

```zsh
caff disu 1h -- npm test
```

- Runs `caffeinate` + `npm test` together
- Prints a start message with flags and duration
- No interactive UI
- When `npm test` finishes, `caff` exits with the _same_ status code

This makes it safe to use in scripts and automations.

#### Without a command

```zsh
# Duration known → countdown bar
caff disu 45m

# Duration unknown → spinner
caff disu
```

- **Known duration**: `caff` starts `caffeinate` in the background and shows a single-line progress bar with remaining time.
- **Unknown duration**: it shows a little spinner that keeps animating until you hit Ctrl+C.

In both cases, **Ctrl+C** stops the UI and `caffeinate`, and `caff` exits with status `130`. That makes it explicit that the session was interrupted.

### Quiet mode for scripts

Sometimes you want zero noise — especially in scripts or logs. For that, there's a quiet mode:

```zsh
caff --quiet disu long -- ./deploy.sh
```

or equivalently:

```zsh
caff -q disu long -- ./deploy.sh
```

- No UI
- No start/finish messages
- Same exit-code propagation behavior

### Why this helps my clamshell workflow

In clamshell mode, my usage now looks like this:

- For a long-running command:

  ```zsh
  cf disu medium -- pnpm lint && pnpm test
  ```

  - External monitor stays awake while the command runs.
  - When it finishes, `caff` exits, the system goes back to normal.
  - No surprise sleep _in the middle_ of a task.

- For a "manual" session:

  ```zsh
  cf disu night
  ```

  - I get a countdown for 8 hours.
  - If I’m done earlier, I hit Ctrl+C.
  - If I forget, it ends after the preset duration and the system behaves normally again.

It's predictable, scriptable, and — most importantly — lives where I already spend my time: in the terminal.

## Closing thoughts

Writing `caff` started as a tiny quality-of-life improvement: _"I just want a nicer way to use `caffeinate`."_ But it ended up being my:

- First **Oh My Zsh plugin**
- First little experiment in "turn an annoyance into a tool"
- A reminder that many dev problems are solvable with a thin layer of ergonomics on top of existing primitives

If you:

- Work in clamshell mode
- Run long builds/tests/AI tasks
- Live in the terminal

…then `caffeinate` is probably already the right tool for you. `caff` just makes it **nicer**.
