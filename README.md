# ANYORB

**Zero-dependency voice presence engine** — one `<script>` tag, any stack.

Audio-reactive particle orb for voice AI agents.  
Works where React components can’t: **Webflow, Framer, WordPress, Vue, Svelte, plain HTML**.

[Live Playground](https://ppiiyo.github.io/AnyOrb) · [anyorb.js (CDN)](https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js) · [npm](https://www.npmjs.com/package/anyorb)

```html
<script src="https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js"></script>
<voice-orb state="idle" theme="glacier" style="width:240px;height:240px"></voice-orb>
```

---

## Why

Almost every voice orb is a **React** component.  
If you ship on Webflow, Framer, WordPress, or a non-React stack, you either drag in React or draw a pulsing circle yourself.

ANYORB is a **native Web Component + ~15 KB canvas engine**. No build step. No framework. Same six agent states as the React libraries — drop it anywhere.

> Not “another pretty orb.”  
> **Works where React components don’t.**

---

## Install

**CDN (no build)**

```html
<script src="https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js"></script>
```

**npm**

```bash
npm i anyorb
# or: pnpm add anyorb / yarn add anyorb
```

```js
import "anyorb"; // registers <voice-orb>
// or
import { AnyOrb } from "anyorb";
```

---

## Quick API

```js
const orb = new AnyOrb(document.querySelector("#host"), {
  theme: "nova",
  particles: 1800,
  state: "idle",
});

orb.setState("listening");   // idle | connecting | listening | thinking | speaking | error
orb.setLevel(0.65);          // 0..1 loudness (attack/release smoothed)
orb.connectAnalyser(analyser); // Web Audio AnalyserNode
orb.set("theme", "ember");
orb.destroy();               // full cleanup (no leaks)
```

### Web Component

```html
<voice-orb
  state="speaking"
  theme="glacier"
  particles="2000"
  style="width:220px;height:220px">
</voice-orb>
```

Attributes: `state`, `theme`, `particles`, `accent`.

Events: `anyorb:statechange` (detail: `{ state }`).

---

## States

| State | Visual |
|-------|--------|
| `idle` | Soft breathing Fibonacci sphere |
| `connecting` | Particles assemble from chaos |
| `listening` | Radius + pulse from mic level |
| `thinking` | Morph to torus, faster spin |
| `speaking` | Wave surface from agent loudness |
| `error` | Brief scatter + palette shift |

## Themes

`glacier` · `nova` · `acid` · `ember` · `rose` · or any `accent` hex.

---

## Integration recipes

One pattern everywhere: **remote audio → `AnalyserNode` → `orb.connectAnalyser()`** (or `setLevel`).

| Provider | Guide |
|----------|--------|
| OpenAI Realtime (WebRTC) | [examples/openai-realtime.md](./examples/openai-realtime.md) |
| LiveKit Agents | [examples/livekit.md](./examples/livekit.md) |
| ElevenLabs Conversational | [examples/elevenlabs.md](./examples/elevenlabs.md) |
| Vapi | [examples/vapi.md](./examples/vapi.md) |
| Bare embed | [examples/basic.html](./examples/basic.html) |

---

## Features

- **Zero runtime dependencies**
- Web Component + class API
- Transparent canvas, `ResizeObserver`, DPR-aware
- Pauses when tab hidden; respects `prefers-reduced-motion`
- `destroy()` — safe mount/unmount cycles
- ~15 KB source (MIT)

---

## Playground

Open [ppiiyo.github.io/AnyOrb](https://ppiiyo.github.io/AnyOrb):

- Scripted conversation simulator  
- Live level meter  
- Settings drawer (particles, glow, trails, quality…)  
- Theme switcher · Export PNG · Copy embed snippet  

---

## GitHub Pages

Repo → **Settings → Pages** → Source: **Deploy from a branch** → `main` / root.  
Site: `https://ppiiyo.github.io/AnyOrb`

---

## License

MIT
