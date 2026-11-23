# Vapi → ANYORB

```html
<script src="https://cdn.jsdelivr.net/gh/ppiiyo/AnyOrb@main/anyorb.js"></script>
<div id="orb" style="width:240px;height:240px"></div>
```

```js
import Vapi from "@vapi-ai/web";

const orb = new AnyOrb(document.getElementById("orb"), {
  state: "idle",
  theme: "ember",
});

const vapi = new Vapi("YOUR_PUBLIC_KEY");

vapi.on("call-start", () => orb.setState("connecting"));
vapi.on("speech-start", () => orb.setState("speaking"));
vapi.on("speech-end", () => orb.setState("listening"));
vapi.on("call-end", () => orb.setState("idle"));
vapi.on("error", () => orb.setState("error"));

// Volume / level if available from events — else wire remote stream:
vapi.on("volume-level", (level) => {
  // level often 0..1
  orb.setLevel(level);
});

vapi.start("YOUR_ASSISTANT_ID");

// Optional: when you can access the call MediaStream
// orb.connectAnalyser(analyserFromStream(stream));
```

Helper:

```js
function analyserFromStream(stream) {
  const ctx = new AudioContext();
  const src = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  src.connect(analyser);
  return analyser;
}
```
