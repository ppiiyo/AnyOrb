# OpenAI Realtime → ANYORB

Pattern: remote audio track → `AnalyserNode` → `orb.connectAnalyser()`.

```html
<script src="https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js"></script>
<div id="orb" style="width:240px;height:240px"></div>
```

```js
const orb = new AnyOrb(document.getElementById("orb"), {
  state: "connecting",
  theme: "glacier",
  particles: 1800,
});

// After you have a WebRTC peer connection / Realtime session:
function wireRemoteAudio(mediaStream) {
  const ctx = new AudioContext();
  const src = ctx.createMediaStreamSource(mediaStream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.8;
  src.connect(analyser);
  // optional: analyser.connect(ctx.destination) if you also play audio here

  orb.connectAnalyser(analyser);
  orb.setState("listening"); // or speaking when agent talks
}

// Map your session events → states
// e.g. session.on("conversation.item.input_audio_buffer.speech_started", () => orb.setState("listening"))
//      session.on("response.audio.delta" / playback start → "speaking")
//      session idle → "idle" | "thinking"
```

Minimal level-only path (no analyser):

```js
// from your own RMS / volume callback
orb.setLevel(volume01);
```
