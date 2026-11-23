# ElevenLabs Conversational AI → ANYORB

```html
<script src="https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js"></script>
<div id="orb" style="width:240px;height:240px"></div>
```

```js
import { Conversation } from "@elevenlabs/client";

const orb = new AnyOrb(document.getElementById("orb"), {
  state: "idle",
  theme: "glacier",
});

const conversation = await Conversation.startSession({
  agentId: "YOUR_AGENT_ID",
  onConnect: () => orb.setState("connecting"),
  onDisconnect: () => orb.setState("idle"),
  onError: () => orb.setState("error"),
  onModeChange: ({ mode }) => {
    // mode is typically "listening" | "speaking" depending on SDK version
    if (mode === "listening") orb.setState("listening");
    else if (mode === "speaking" || mode === "talking") orb.setState("speaking");
    else orb.setState("idle");
  },
});

// Audio: get the remote/output stream or element from the session when available,
// then:
// const analyser = ... from MediaStream / HTMLAudioElement
// orb.connectAnalyser(analyser);

// Fallback: drive level from SDK volume callbacks if exposed
// conversation.on("volume", (v) => orb.setLevel(v));
```

If you only have an `<audio>` element for agent output:

```js
function attachAudioElement(audioEl) {
  const ctx = new AudioContext();
  const src = ctx.createMediaElementSource(audioEl);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  src.connect(analyser);
  src.connect(ctx.destination);
  orb.connectAnalyser(analyser);
}
```
