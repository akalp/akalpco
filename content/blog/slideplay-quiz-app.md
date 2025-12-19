---
title: "SlidePlay: A Local Quiz App for the Living Room"
date: "2025-11-30T17:40"
description: "A small Node.js + Socket.IO app I built to turn a TV and a few phones into a private, Kahoot-style quiz for family birthdays and living-room events."
tags: ["nodejs", "socketio", "realtime", "side-project", "web"]
---

## TL;DR

GitHub repo: [akalp/SlidePlay](https://github.com/akalp/SlidePlay)

SlidePlay is a small web app I built as a birthday surprise for my dad. It runs only on a local network and turns a TV plus a few phones into a private quiz game.

- Built with **Node.js**, **Express**, and **Socket.IO**.
- Uses three roles: **Player**, **Host**, and **Admin**, all running in the browser.
- All content comes from a single **`slides.json`** file, so new events are mostly “edit JSON, restart, play”.
- Supports **content**, **question**, **scoreboard**, **video**, and **final** slides.
- Adds a scoring model based on **correctness + speed bonus**.
- Implements **remote video control** from the admin view (play / pause / mute / seek / restart).
- Uses `chokidar` to **watch `slides.json` and avatar assets**, so changes appear without restarting.
- In practice it feels like **“a private Kahoot meets Google Slides, served from my laptop over Wi-Fi.”**

The rest of this post is about why I built it, what it does, and how it works under the hood.

---

## Why I built my own tiny quiz app

I built SlidePlay because I wanted my dad’s birthday to feel a bit more interactive than “let’s click through a slideshow”.

I had a few constraints in mind:

- We’d be in the **living room**, with a TV, a laptop, and a bunch of phones/tablets.
- I wanted people to join from their **own devices**, with their own names and avatars.
- I wanted a mix of **photos, short videos, and quiz questions** about him.
- I didn’t want to depend on an external site or account — just **run it on my machine** over the home Wi-Fi.

There are plenty of existing quiz tools, but they often assume:

- Classrooms or big events.
- Cloud accounts and public links.
- A generic brand/theme that doesn’t feel personal.

For a small family evening, that felt wrong. I wanted a mini game show that lived entirely on my laptop and on our TV.

So SlidePlay started as a one-off birthday surprise that I could also reuse for future family or friend events.

## What SlidePlay is

At a high level, SlidePlay is a **real-time slideshow and quiz system**:

- A **Node.js server** runs on my laptop and listens on the local network.
- A **Host view** runs on the TV (or any big screen) and shows slides, questions, and scoreboards.
- An **Admin view** runs on my laptop and lets me control the flow: next/previous slide, reveal answers, jump to a specific slide, control video playback, reload slides.
- **Player views** run on phones and tablets; everyone joins with a name and avatar and answers questions from there.

All three views are standard web pages, and I keep them in sync using **Socket.IO**.

In my head, the pitch is:

> A small, self-hosted “Kahoot + Google Slides” hybrid that only lives on your Wi-Fi.

I don’t use a database or any external service. All state lives in memory for the duration of the session, and all content comes from a single JSON file.

## How it works under the hood

### Express + Socket.IO as the real-time backbone

The backend is a single Node.js process:

- **Express** serves static files from `public/`.
- **Socket.IO** handles live events between players, host, and admin.

On each new Socket.IO connection, I:

- Send down the current state (`slides`, `settings`, `current slide`, `players`).
- Listen for admin commands (next slide, previous slide, goto, reveal, video control).
- Listen for player events (join, answer).
- Broadcast updates to everyone (player list, slide changes, results, scoreboards).

In simplified pseudo-code, the main socket wiring looks like this:

```js
io.on("connection", (socket) => {
  // Initial state for a new client
  socket.on("getState", () => {
    socket.emit("state", {
      slides,
      settings,
      currentSlideId,
      players,
    });
  });

  // Player joins
  socket.on("join", ({ name, avatar }) => {
    players[socket.id] = { name, avatar, score: 0 };
    io.emit("playersUpdated", players);
  });

  // Player answers a question
  socket.on("answer", ({ slideId, choiceIndex }) => {
    handleAnswer({ socketId: socket.id, slideId, choiceIndex });
  });

  // Admin controls
  socket.on("admin:next", () => goToNextSlide());
  socket.on("admin:prev", () => goToPreviousSlide());
  socket.on("admin:goto", (slideId) => goToSlide(slideId));
  socket.on("admin:reveal", () => revealCurrentAnswer());

  // Clean up on disconnect
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("playersUpdated", players);
  });
});
```

`server.js` keeps in-memory state for:

- Loaded slides and settings.
- The current slide ID.
- The list of players and scores.
- The active question state (who has answered, who is still pending).

### Slides as data: `slides.json`

I didn’t want to rebuild the app for every event. Instead, I treat slides as pure data.

All content is defined in `public/slides.json`. At the top, there is a `settings` object for game behavior. Then there is a `slides` array of slide objects.

A simplified version looks like this:

```json
{
  "settings": {
    "pointsPerCorrect": 100,
    "maxSpeedBonus": 50,
    "speedBonusWindowSec": 10,
    "revealDelayMs": 3000,
    "autoAdvanceAfterReveal": false
  },
  "slides": [
    {
      "id": 1,
      "type": "content",
      "title": "Welcome",
      "text": "Happy Birthday!"
    },
    {
      "id": 2,
      "type": "video",
      "title": "Memory Lane",
      "video": "assets/video.mp4"
    },
    {
      "id": 3,
      "type": "question",
      "title": "Favourite dessert?",
      "choices": ["Option A", "Option B", "Option C"],
      "answerIndex": 1
    },
    {
      "id": 4,
      "type": "scoreboard",
      "title": "Scores so far"
    },
    {
      "id": 5,
      "type": "final",
      "title": "Thanks for playing",
      "text": "🎉"
    }
  ]
}
```

The supported slide types are:

- `content` – basic text/image slides.
- `video` – video slides that I can remote-control from the admin page.
- `question` – multiple choice questions with a single correct answer.
- `scoreboard` – a sorted list of players and scores.
- `final` – a closing slide at the end.

To build a new event, I usually just:

1. Replace images and videos in `public/assets/`.
2. Edit `public/slides.json` to match the new story.
3. Run `npm start` and open the URL on the TV and phones.

I don’t have to touch JavaScript for normal content changes.

### Scoring: correctness + speed bonus

I wanted the game to feel like a quiz show, not just a static poll. SlidePlay keeps a score for each player and uses a simple model:

- When a question starts, I snapshot which players are currently connected.
- Each of those players can answer **once**.
- A correct answer gets base points plus a speed bonus.
- A wrong answer gives zero points.
- When everyone in that snapshot has answered (or disconnected), the server reveals the answer.

The core scoring function is roughly:

```js
function gradeAnswer(slide, choiceIndex, elapsedMs) {
  const correct = choiceIndex === slide.answerIndex;
  if (!correct) return { correct: false, delta: 0 };

  let delta = settings.pointsPerCorrect;

  const windowMs = settings.speedBonusWindowSec * 1000;
  const clamped = Math.max(0, Math.min(windowMs, elapsedMs));
  const bonusRatio = 1 - clamped / windowMs;
  const bonus = Math.round(bonusRatio * settings.maxSpeedBonus);

  delta += bonus;
  return { correct: true, delta };
}
```

When a question is done, I:

1. Reveal the correct answer on the host and player screens.
2. Update scores and broadcast them.
3. Optionally auto-advance to the next slide after `revealDelayMs`.

It’s not a complex system, but it’s enough to create some friendly competition.

### Three browser roles: Player, Host, Admin

SlidePlay splits the UI into three separate pages with different responsibilities.

#### Player (phones and tablets)

The player view (`/`) is what everyone uses on their phones:

- Join with a **name and avatar**.
- See the current slide in a simple layout.
- For questions, tap one of the answer buttons.
- After reveal, see whether the answer was correct and how many points they got.

#### Host (TV or projector)

The host view (`/host.html`) is what I put on the TV:

- Show the current slide in a large, clean format.
- For questions, highlight the correct choice after reveal and list who answered what (with timing).
- For scoreboard slides, show a sorted list of players and scores.

This is the “stage” view everyone in the room watches.

#### Admin (laptop, tablet or phone)

The admin view (`/admin.html`) is my control panel:

- Buttons for **Previous**, **Next**, and **Goto** slide.
- A **Force Reveal** button to reveal early.
- A **Reload JSON** button to re-read `slides.json`.
- Remote video controls (Play, Pause, Restart, Mute/Unmute, Seek).
- A small live scoreboard panel.

Under the hood, all three views are basic Socket.IO clients listening to a subset of events they care about.

### Remote video control

I wanted to mix in short videos (old clips, fun moments) without losing control from the admin panel.

For `video` slides, I treat the admin as a remote control for the host:

```js
// Admin asks to control the video
socket.emit("admin:videoControl", { action: "play" });

// Server forwards to host clients
socket.on("admin:videoControl", (payload) => {
  if (!isValid(payload)) return;
  io.to("host").emit("host:videoControl", payload);
});

// Host applies the action
socket.on("host:videoControl", ({ action, time }) => {
  const video = document.getElementById("hostVideo");
  if (!video) return;

  switch (action) {
    case "play":
      video.play();
      break;
    case "pause":
      video.pause();
      break;
    case "restart":
      video.currentTime = 0;
      video.play();
      break;
    case "mute":
      video.muted = true;
      break;
    case "unmute":
      video.muted = false;
      break;
    case "seek":
      video.currentTime = time;
      break;
  }
});
```

On the player view, I only show the text for the video slide. The actual playback happens on the host screen, which keeps everyone focused on the TV.

> A small practical note here: A small practical note here: Chrome’s autoplay rules matter. Muted autoplay is usually fine, but autoplay with sound is only allowed after the user has interacted with the site (click, tap, etc.), or if Chrome considers the user “engaged” with that domain, or the site is installed as a PWA In other words, if I try to call video.play() from a Socket.IO event before anyone has clicked anything on the host page, Chrome may silently block it. In practice I either start videos muted, or I require at least one manual click on the host view before I rely on remote play commands.

### Avatars and live reload with `chokidar`

For joining, I wanted something more fun than plain text names, so I added avatars.

Avatars are just images in `public/assets/avatars/`. On startup, the server scans that directory and builds a list of available avatar URLs. Players see this list and tap one to choose it.

To avoid restarts while tweaking the event, I also wired in **`chokidar`**:

```js
chokidar.watch("public/slides.json").on("change", () => {
  loadSlidesFromDisk();
  io.emit("slidesReloaded", { slides, settings });
});

if (fs.existsSync(AVATAR_DIR)) {
  chokidar
    .watch(AVATAR_DIR, { ignoreInitial: true })
    .on("add", loadAvatars)
    .on("unlink", loadAvatars);
}
```

This gives me:

- Live slide reload when I edit `slides.json`.
- Live avatar updates when I add/remove avatar images.

For a real event, this is great: I can fix typos, tweak wording, or swap an image a few minutes before we start, without touching the Node.js process.

## The first living-room test

The first real test was on my home network:

- I ran the Node.js server on my laptop.
- I opened the **host view** in a browser and mirrored it to the TV.
- Five people joined as **players** from phones and a tablet over Wi-Fi.

The funniest bug was not in my code but in the browser: I shared the local URL, people tapped it, and Chrome tried to be “smart” and turned it into `https://...`. Of course, my small Node server was only listening on plain `http://`, so nothing worked at first.

Once we realized what was going on and everyone typed the `http://` URL manually, everything clicked:

- Players picked avatars and names.
- I walked through content, video, question, scoreboard, and final slides from the admin panel.
- Scores updated in real time, and the scoreboard slides made the quiz feel real.
- Most importantly, my dad got a custom, interactive birthday quiz built around his own story.

All of it stayed on the local network. No public link, no external service, no uploads.

## Closing thoughts

SlidePlay is not a product I plan to ship. It’s a **small template** that does one thing well:

> Turn a TV and a few phones into a private quiz show that lives entirely on your laptop.

From a technical side, the interesting parts for me were:

- Using **Express + Socket.IO** as a simple real-time backbone.
- Treating slides as **data in `slides.json`**, not hard-coded components.
- Implementing a small but satisfying **scoring system** (correctness + speed).
- Splitting the UI into **Player / Host / Admin** roles.
- Adding **remote video control** and **live reload** with `chokidar`.

If you’ve ever wanted a private “Kahoot meets Google Slides” for your own family, friends, or a small team, this pattern works well: keep everything local, keep the content in one JSON file, and use WebSockets to glue a few simple web pages into something that feels like a live show in your living room.
