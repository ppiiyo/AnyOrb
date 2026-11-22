# ANYORB

**Zero-dependency voice presence engine** — one file, any stack.

A beautiful, audio-reactive particle orb for voice AI agents. Works everywhere: plain HTML, Webflow, Framer, WordPress, Vue, Svelte, React… just drop a `<script>` tag.

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

## States

| State       | Behavior                                      |
|-------------|-----------------------------------------------|
| `idle`      | Soft breathing sphere                         |
| `connecting`| Particles assemble from chaos                 |
| `listening` | Radius + pulse driven by level                |
| `thinking`  | Morphs into a torus, faster spin              |
| `speaking`  | Wave surface driven by agent loudness         |
| `error`     | Brief scatter + palette shift                 |

## Themes

`glacier` · `nova` · `acid` · `ember` · `rose` (+ custom accent color)

## Features

- **Zero runtime dependencies**
- Web Component + class API
- Transparent canvas, ResizeObserver
- DPR-aware, pauses when tab is hidden
- `prefers-reduced-motion` support
- Full cleanup via `destroy()`
- ~15 KB source

## Playground

Open [`anyorb.html`](./anyorb.html) in a browser for the full interactive demo:

- Live microphone
- Scripted conversation simulator
- Real-time parameter panel
- Theme playground + copy-paste snippets
- Export PNG / download engine

## Integration recipes

The orb only needs a `0..1` level signal. Wire any stack in ~15 lines:

- OpenAI Realtime (WebRTC)
- LiveKit Agents
- ElevenLabs
- Vapi / any Web Audio source

See the “Embed & integrate” tab in the playground.

## License

MIT

---

Made for voice agents that need presence on any page — not just React apps.
