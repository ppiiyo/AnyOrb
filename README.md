# ANYORB

**Zero-dependency voice presence engine** — one file, any stack.

A beautiful, audio-reactive particle orb for voice AI agents.  
Works everywhere: plain HTML, Webflow, Framer, WordPress, Vue, Svelte, React… just drop a `<script>` tag.

[Live Playground →](https://ppiiyo.github.io/AnyOrb) · [Download anyorb.js](https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js)

## Quick start

```html
<script src="https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js"></script>

<voice-orb state="idle" theme="glacier" style="width:220px;height:220px"></voice-orb>
```

Or with the JS API:

```js
const orb = new AnyOrb(document.querySelector("#host"), {
  theme: "nova",
  particles: 1600,
  state: "listening"
});

orb.setState("thinking");
orb.setLevel(0.7);               // 0..1 loudness
orb.connectAnalyser(analyser);   // Web Audio AnalyserNode
orb.destroy();                   // full cleanup
```

## Install

```bash
npm i anyorb
# or
pnpm add anyorb
```

```js
import "anyorb"; // registers <voice-orb>
```

## States

| State        | Behavior                                      |
|--------------|-----------------------------------------------|
| `idle`       | Soft breathing sphere                         |
| `connecting` | Particles assemble from chaos                 |
| `listening`  | Radius + pulse driven by level                |
| `thinking`   | Morphs into a torus, faster spin              |
| `speaking`   | Wave surface driven by agent loudness         |
| `error`      | Brief scatter + palette shift                 |

## Themes

`glacier` · `nova` · `acid` · `ember` · `rose` (+ custom accent color)

## Features

- **Zero runtime dependencies**
- Web Component `<voice-orb>` + class API
- Transparent canvas, `ResizeObserver`
- DPR-aware, pauses when tab is hidden
- `prefers-reduced-motion` support
- Full cleanup via `destroy()`
- ~15 KB source

## Playground

Open the [live demo](https://ppiiyo.github.io/AnyOrb) or open `index.html` locally:

- Live microphone
- Scripted conversation simulator
- Real-time parameter panel
- Theme playground + copy-paste snippets
- Export PNG / download engine

## Integration recipes

The orb only needs a `0..1` level signal:

- [OpenAI Realtime](./examples/openai-realtime.md)
- [LiveKit Agents](./examples/livekit.md)
- [Basic embed](./examples/basic.html)

## Enable GitHub Pages (one-time)

1. Repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / **/** (root)
4. Save → site at `https://ppiiyo.github.io/AnyOrb`

## License

MIT
