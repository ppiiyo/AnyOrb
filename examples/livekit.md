# LiveKit Agents + ANYORB

```html
<script src="https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js"></script>
<script type="module">
import { Room, RoomEvent } from "https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.esm.mjs";

const orb = new AnyOrb(document.getElementById("host"), {
  theme: "nova",
  particles: 1400,
  state: "connecting"
});

const room = new Room();
await room.connect(wsUrl, token);

room.on(RoomEvent.TrackSubscribed, (track) => {
  if (track.kind !== "audio") return;
  const el = track.attach();
  el.style.display = "none";
  document.body.appendChild(el);

  const ctx = new AudioContext();
  const src = ctx.createMediaStreamSource(el.srcObject);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  src.connect(analyser);
  orb.connectAnalyser(analyser);
});

room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
  const agentSpeaking = speakers.some(s => s.identity.startsWith("agent"));
  orb.setState(agentSpeaking ? "speaking" : "listening");
});

room.on(RoomEvent.Disconnected, () => orb.setState("idle"));
</script>
```
