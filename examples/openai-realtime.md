# OpenAI Realtime + ANYORB

Wire the orb to an OpenAI Realtime (WebRTC) agent voice stream.

```html
<script src="https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js"></script>
<div id="host" style="width:240px;height:240px"></div>
<script>
const orb = new AnyOrb(document.getElementById("host"), {
  theme: "glacier",
  particles: 1600,
  state: "connecting"
});

// After you negotiate the peer connection with the Realtime API:
pc.ontrack = (e) => {
  const ctx = new AudioContext();
  const src = ctx.createMediaStreamSource(e.streams[0]);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  src.connect(analyser);
  orb.connectAnalyser(analyser);   // agent loudness → speaking visuals

  const audio = document.createElement("audio");
  audio.srcObject = e.streams[0];
  audio.autoplay = true;
  document.body.appendChild(audio);
};

// Map session events → orb states
dc.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.type === "input_audio_buffer.speech_started") orb.setState("listening");
  if (msg.type === "response.created")                  orb.setState("thinking");
  if (msg.type === "response.audio.delta")              orb.setState("speaking");
  if (msg.type === "response.done")                     orb.setState("idle");
  if (msg.type === "error")                             orb.setState("error");
});
</script>
```

The orb never talks to OpenAI itself — it only needs a 0..1 level (via `setLevel` or `connectAnalyser`).
