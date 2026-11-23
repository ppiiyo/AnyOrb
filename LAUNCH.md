# Launch kit — ANYORB

## One-liner

Zero-dependency voice orb for AI agents — one script tag, works in Webflow/Framer/WordPress, not only React.

## Show HN (title ≤ 80 chars)

**Show HN: AnyOrb – zero-dep voice presence orb (one script tag, any stack)**

### Body

Almost every voice-agent orb is a React component (orb-ui, ElevenLabs UI, etc.). Fine if you’re already on React. Not fine for Webflow, Framer, WordPress, Vue, or a plain landing page.

AnyOrb is a ~15 KB Web Component + canvas particle engine:

- Six agent states: idle, connecting, listening, thinking, speaking, error
- Audio-reactive via AnalyserNode or setLevel(0..1)
- Zero runtime dependencies, MIT
- Drop-in: one script tag

Demo: https://ppiiyo.github.io/AnyOrb  
Repo: https://github.com/ppiiyo/AnyOrb  

```html
<script src="https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js"></script>
<voice-orb state="idle" theme="glacier" style="width:240px;height:240px"></voice-orb>
```

Recipes for OpenAI Realtime, LiveKit, ElevenLabs, Vapi in /examples.

Happy to take feedback on the state machine and integration surface.

## Reddit r/webdev / r/javascript

**Title:** Zero-dependency voice orb for AI agents (Web Component, works outside React)

**Body:** Short version of Show HN + demo GIF/link + “looking for feedback from people embedding voice agents in no-code tools.”

## X / Twitter thread (short)

1/ Most voice AI orbs are React-only.  
If you live in Webflow, Framer, or plain HTML — you’re stuck.

2/ AnyOrb: one script tag, ~15 KB, six agent states, audio-reactive particles.  
Web Component. Zero deps.

3/ Demo → https://ppiiyo.github.io/AnyOrb  
GitHub → https://github.com/ppiiyo/AnyOrb

## Awesome-list PR blurb

```
- [AnyOrb](https://github.com/ppiiyo/AnyOrb) - Zero-dependency voice presence engine (Web Component). One script tag; works in Webflow, Framer, WordPress, and any stack. Audio-reactive particle orb for voice AI agents.
```

## LiveKit / Pipecat community note

> Built a tiny zero-dep orb that only needs an AnalyserNode — handy when you want presence UI without pulling React into the client. Happy to add more LiveKit-specific examples if useful: https://github.com/ppiiyo/AnyOrb/blob/main/examples/livekit.md

## Checklist before posting

- [ ] GitHub Pages enabled (Settings → Pages → main / root)
- [ ] Live demo loads: https://ppiiyo.github.io/AnyOrb
- [ ] CDN works: jsDelivr URL in README
- [ ] GIF or short screen capture of idle → listen → speak (optional but strong)
