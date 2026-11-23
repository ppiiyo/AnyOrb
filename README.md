# ANYORB

**Zero-dependency voice presence engine** — one `<script>` tag, any stack.

Audio-reactive particle orb for voice AI agents.  
Works where React components can’t: **Webflow, Framer, WordPress, Vue, Svelte, plain HTML**.

[Live Playground](https://ppiiyo.github.io/AnyOrb) · [anyorb.js (CDN)](https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js)

```html
<script src="https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js"></script>
<voice-orb state="idle" theme="glacier" style="width:240px;height:240px"></voice-orb>
```

<!-- Demo GIF: add media/anyorb-demo.gif to repo, then uncomment:
![ANYORB states](./media/anyorb-demo.gif)
-->

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
```

```js
import "anyorb"; // registers <voice-orb>
```

---

## Quick API

```js
const orb = new AnyOrb(document.querySelector("#host"), {
  theme: "nova",
  particles: 1800,
  state: "idle",
});

orb.setState("listening");
orb.setLevel(0.65);
orb.connectAnalyser(analyser);
orb.destroy();
```

### Web Component

```html
<voice-orb state="speaking" theme="glacier" style="width:220px;height:220px"></voice-orb>
```

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

Themes: `glacier` · `nova` · `acid` · `ember` · `rose`

---

## Integration recipes

| Provider | Guide |
|----------|--------|
| OpenAI Realtime | [examples/openai-realtime.md](./examples/openai-realtime.md) |
| LiveKit Agents | [examples/livekit.md](./examples/livekit.md) |
| ElevenLabs | [examples/elevenlabs.md](./examples/elevenlabs.md) |
| Vapi | [examples/vapi.md](./examples/vapi.md) |
| Bare embed | [examples/basic.html](./examples/basic.html) |

---

## Features

- Zero runtime dependencies · Web Component + class API
- Transparent canvas, DPR-aware, `prefers-reduced-motion`
- `destroy()` — no leaks · ~15 KB · MIT

## Playground

[ppiiyo.github.io/AnyOrb](https://ppiiyo.github.io/AnyOrb) — conversation simulator, settings, themes, export PNG.

## License

MIT
