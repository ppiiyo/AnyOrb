# LiveKit Agents → ANYORB

```html
<script src="https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js"></script>
<div id="orb" style="width:240px;height:240px"></div>
```

```js
import { Room, RoomEvent, Track } from "livekit-client";

const orb = new AnyOrb(document.getElementById("orb"), {
  state: "connecting",
  theme: "nova",
});

const room = new Room();
await room.connect(wsUrl, token);
orb.setState("idle");

room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
  if (track.kind !== Track.Kind.Audio) return;
  const el = track.attach(); // HTMLAudioElement
  el.play().catch(() => {});

  const ctx = new AudioContext();
  const src = ctx.createMediaElementSource(el);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  src.connect(analyser);
  // src.connect(ctx.destination); // if not using element playback only

  orb.connectAnalyser(analyser);
  orb.setState("speaking"); // agent track
});

// Map agent state from your data channel / attributes if available:
// orb.setState("listening" | "thinking" | "speaking" | "idle")
```

User mic (listening pulse):

```js
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const ctx = new AudioContext();
const src = ctx.createMediaStreamSource(stream);
const analyser = ctx.createAnalyser();
src.connect(analyser);
orb.connectAnalyser(analyser);
orb.setState("listening");
```
