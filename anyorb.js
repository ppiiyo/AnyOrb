/* ANYORB v0.1 — voice presence engine. Zero dependencies. MIT.
   Usage: <script src="anyorb.js"></script> then <voice-orb state="idle" theme="glacier"></voice-orb>
   or: new AnyOrb(element, { theme:"nova", particles:1600 }) */
(() => {
"use strict";
const TAU = Math.PI * 2;
const STATES = ["idle","connecting","listening","thinking","speaking","error"];
const THEMES = {
  glacier:{core:"#59d8ff",second:"#3a6bff"},
  nova:{core:"#ff4fd8",second:"#7a3bff"},
  acid:{core:"#8dff6a",second:"#2bd9a8"},
  ember:{core:"#ffb347",second:"#ff5e3a"},
  rose:{core:"#ff8fb8",second:"#c44fff"}
};
const hexRgb = h => { h=h.replace("#",""); if(h.length===3) h=h.split("").map(c=>c+c).join(""); const n=parseInt(h,16); return [n>>16&255,n>>8&255,n&255]; };
const mix = (a,b,t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
const rgbStr = c => `rgb(${c[0]|0},${c[1]|0},${c[2]|0})`;
function hueShift(rgb,deg){
  let [r,g,b]=rgb.map(v=>v/255); const mx=Math.max(r,g,b),mn=Math.min(r,g,b); let h=0,s=0,l=(mx+mn)/2;
  if(mx!==mn){const d=mx-mn; s=l>.5?d/(2-mx-mn):d/(mx+mn);
    h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4; h/=6;}
  h=(h+deg/360)%1; if(h<0)h+=1;
  const q=l<.5?l*(1+s):l+s-l*s, p=2*l-q, f=t=>{t=(t%1+1)%1; return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p;};
  return [f(h+1/3)*255,f(h)*255,f(h-1/3)*255];
}
const DEFAULTS = {
  particles:1600, scale:1, speed:.7, turbulence:.18, tilt:18, zoom:1, spin:.5,
  glow:.7, trails:.25, psize:1, gravity:.5, grav:true, links:true, tint:true,
  animate:true, quality:"balanced", theme:"glacier", accent:null, state:"idle", interactive:true
};
const DPR = {eco:1, balanced:1.5, sharp:2};

class AnyOrb {
  constructor(host, opts={}){
    this.host = host;
    this.o = Object.assign({}, DEFAULTS, opts);
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("role","img");
    this.canvas.setAttribute("aria-label","Animated voice agent orb");
    this.ctx = this.canvas.getContext("2d",{alpha:true});
    host.appendChild(this.canvas);
    this.state = STATES.includes(this.o.state)?this.o.state:"idle";
    this.stateTime = 0; this.time = 0; this._last = 0; this._dirty = true;
    this.level = 0; this._target = 0; this.smoothLevel = 0;
    this.rotY = Math.random()*TAU; this.velY = 0; this.rotX = this.o.tilt*Math.PI/180;
    this.ripples = []; this.analyser = null; this._td = null;
    this.pointer = {x:0,y:0,active:false,down:false};
    this._drag = null; this.fps = 60; this._seed = Math.random()*1000;
    this._onFrame = typeof opts.onFrame==="function"?opts.onFrame:null;
    this._rebuild(); this._recolor();
    this._resize = this._resize.bind(this); this._loop = this._loop.bind(this);
    this._ro = typeof ResizeObserver!=="undefined" ? new ResizeObserver(this._resize) : null;
    if(this._ro) this._ro.observe(host); else window.addEventListener("resize",this._resize);
    this._bind(); this._resize();
    if(this.state==="connecting") this._scatter(4.2);
    this._raf = requestAnimationFrame(this._loop);
  }
  _rand(i,j){ const n=Math.sin(i*127.1+j*311.7+this._seed)*43758.5453; return n-Math.floor(n); }
  _rebuild(){
    const N = Math.max(60, Math.min(6000, this.o.particles|0));
    this.particles = []; this._order = [];
    for(let i=0;i<N;i++){
      this.particles.push({x:(this._rand(i,1)-.5)*8,y:(this._rand(i,2)-.5)*8,z:(this._rand(i,3)-.5)*8,
        u:(i+.5)/N, v:this._rand(i,4), w:this._rand(i,5), j:this._rand(i,6),
        sx:0, sy:0, pz:1});
      this._order.push(i);
    }
    this._dirty = true;
  }
  _scatter(r){ for(const p of this.particles){ p.x=(Math.random()-.5)*2*r; p.y=(Math.random()-.5)*2*r; p.z=(Math.random()-.5)*2*r; } }
  _recolor(){
    const th = this.o.accent ? {core:this.o.accent, second:null} : (THEMES[this.o.theme]||THEMES.glacier);
    let core = hexRgb(th.core);
    let second = th.second ? hexRgb(th.second) : hueShift(core,45).map(v=>v*.72);
    if(this.o.tint){
      if(this.state==="error"){ core=mix(core,[255,77,109],.75); second=mix(second,[255,40,70],.6); }
      else if(this.state==="thinking"){ core=mix(core,[199,123,255],.3); }
      else if(this.state==="connecting"){ core=mix(core,[255,179,71],.2); }
    }
    this._core=core; this._second=second; this._coreS=rgbStr(core); this._secondS=rgbStr(second);
    this._bright=rgbStr(mix(core,[255,255,245],.72));
    this._dirty=true;
  }
  _resize(){
    const w=this.host.clientWidth||300, h=this.host.clientHeight||300;
    this.w=w; this.h=h;
    this.dpr=Math.min(window.devicePixelRatio||1, DPR[this.o.quality]||1.5);
    this.canvas.width=Math.round(w*this.dpr); this.canvas.height=Math.round(h*this.dpr);
    this.canvas.style.width=w+"px"; this.canvas.style.height=h+"px";
    this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
    this._dirty=true;
  }
  _bind(){
    this._ev=[];
    const on=(el,ev,fn,opt)=>{el.addEventListener(ev,fn,opt);this._ev.push([el,ev,fn,opt]);};
    if(this.o.interactive){
      const c=this.canvas;
      on(c,"pointerdown",e=>{
        c.setPointerCapture(e.pointerId);
        this.pointer.down=true; this.pointer.active=true;
        this.pointer.x=e.clientX; this.pointer.y=e.clientY;
        this._drag={x:e.clientX,y:e.clientY,t:performance.now(),moved:0};
        this._dirty=true;
      });
      on(c,"pointermove",e=>{
        this.pointer.x=e.clientX; this.pointer.y=e.clientY; this.pointer.active=true;
        if(this._drag&&this.pointer.down){
          const dx=e.clientX-this._drag.x, dy=e.clientY-this._drag.y;
          this._drag.moved+=Math.abs(dx)+Math.abs(dy);
          this.velY=dx*.012; this.rotY+=dx*.006;
          this.o.tilt=Math.max(-75,Math.min(75,this.o.tilt+dy*.25));
          this.rotX=this.o.tilt*Math.PI/180;
          this._drag.x=e.clientX; this._drag.y=e.clientY;
          this._emit("paramchange",{key:"tilt",value:this.o.tilt});
        }
        this._dirty=true;
      });
      const up=e=>{
        if(this._drag&&this._drag.moved<7&&performance.now()-this._drag.t<350){
          const r=c.getBoundingClientRect();
          this.pulse(e.clientX-r.left,e.clientY-r.top);
          this._emit("pulse",{x:e.clientX-r.left,y:e.clientY-r.top});
        }
        this.pointer.down=false; this._drag=null;
        if(e.pointerType!=="mouse") this.pointer.active=false;
        this._dirty=true;
      };
      on(c,"pointerup",up);
      on(c,"pointercancel",()=>{this.pointer.down=false;this.pointer.active=false;this._drag=null;});
      on(c,"pointerleave",()=>{if(!this.pointer.down)this.pointer.active=false;this._dirty=true;});
      on(c,"wheel",e=>{
        e.preventDefault();
        this.o.zoom=Math.max(.5,Math.min(2,this.o.zoom*Math.exp(-e.deltaY*.0012)));
        this._emit("paramchange",{key:"zoom",value:this.o.zoom});
        this._dirty=true;
      },{passive:false});
    }
    on(document,"visibilitychange",()=>{this._last=0;this._dirty=true;});
  }
  _emit(type,detail){ this.host.dispatchEvent(new CustomEvent("anyorb:"+type,{detail,bubbles:true})); }
  setState(s){
    if(!STATES.includes(s)||s===this.state) return;
    const prev=this.state; this.state=s; this.stateTime=0;
    if(s==="connecting") this._scatter(4.2);
    if(s==="error"){ this._scatter(2.6); this.velY+=(Math.random()-.5)*3; }
    this._recolor();
    this._emit("statechange",{state:s,prev});
    this._dirty=true;
  }
  setLevel(v){ this._target=Math.max(0,Math.min(1,+v||0)); this._dirty=true; }
  connectAnalyser(an){ this.analyser=an; this._td=new Uint8Array(an.fftSize); }
  disconnectAnalyser(){ this.analyser=null; this._td=null; }
  pulse(x,y){ this.ripples.push({x,y,age:0}); if(this.ripples.length>8)this.ripples.shift(); this._dirty=true; }
  set(key,val){
    if(!(key in DEFAULTS)&&key!=="accent") return;
    this.o[key]=val;
    if(key==="particles") this._rebuild();
    else if(key==="quality") this._resize();
    else if(key==="theme"||key==="accent"||key==="tint") this._recolor();
    else if(key==="tilt") this.rotX=val*Math.PI/180;
    this._dirty=true;
    this._emit("paramchange",{key,value:val});
  }
  setParams(obj){ for(const k in obj) this.set(k,obj[k]); }
  _targetPos(p,i,lvl){
    const s=this.state, t=this.time;
    let x,y,z;
    if(s==="thinking"){
      const a=p.v*TAU, b=p.w*TAU;
      const R=1.55+.15*Math.cos(a*3+t*.6), tube=.55*Math.sqrt(p.w);
      x=(R+tube*Math.cos(b))*Math.cos(a); y=tube*Math.sin(b); z=(R+tube*Math.cos(b))*Math.sin(a);
    } else {
      let R=1.9;
      const breathe=1+.025*Math.sin(t*.5+p.u*4);
      if(s==="idle"||s==="connecting") R*=breathe;
      else if(s==="listening") R*=breathe*(1+lvl*.42)+lvl*.1*Math.sin(t*20+p.j*40);
      else if(s==="speaking"){ const yy0=1-2*p.u; R*=breathe*(1+lvl*.3*Math.sin(yy0*5+t*8)+lvl*.22); }
      else if(s==="error") R=2.3+(p.j-.5)*1.1+Math.sin(t*26+p.j*60)*.08;
      const yy=1-2*p.u, rr=Math.sqrt(Math.max(0,1-yy*yy)), th=i*2.3999632297;
      x=Math.cos(th)*rr*R; y=yy*R; z=Math.sin(th)*rr*R;
    }
    if(this.o.turbulence>0){
      const tb=this.o.turbulence*.22;
      x+=Math.sin(t*1.7+p.j*31)*tb; y+=Math.cos(t*1.3+p.v*29)*tb; z+=Math.sin(t*2.1+p.w*37)*tb;
    }
    return [x,y,z];
  }
  _render(animating,dt){
    const ctx=this.ctx,w=this.w,h=this.h,o=this.o;
    if(o.trails>0&&animating){
      ctx.globalCompositeOperation="destination-out";
      ctx.globalAlpha=1-o.trails;
      ctx.fillStyle="#000"; ctx.fillRect(0,0,w,h);
    } else ctx.clearRect(0,0,w,h);
    const cx=w*.5, cy=h*.5;
    const scale=Math.min(w,h)*.3*o.scale*o.zoom;
    const spinMul=this.state==="thinking"?2.4:1;
    if(animating){ this.rotY+=dt*(o.spin*.35*spinMul+this.velY); this.velY*=Math.exp(-3*dt); }
    const ca=Math.cos(this.rotY),sa=Math.sin(this.rotY),cr=Math.cos(this.rotX),sr=Math.sin(this.rotX);
    const k=animating?1-Math.exp(-3.4*dt):1;
    const lvl=this.smoothLevel, N=this.particles.length;
    const rect=this.o.interactive?this.canvas.getBoundingClientRect():null;
    const px0=this.pointer.x-(rect?rect.left:0), py0=this.pointer.y-(rect?rect.top:0);
    for(let i=0;i<N;i++){
      const p=this.particles[i], tg=this._targetPos(p,i,lvl);
      p.x+=(tg[0]-p.x)*k; p.y+=(tg[1]-p.y)*k; p.z+=(tg[2]-p.z)*k;
      let x=p.x*ca-p.z*sa, z=p.x*sa+p.z*ca, y=p.y*cr-z*sr; z=p.y*sr+z*cr;
      const persp=7/(7+z), px=cx+x*scale*persp, py=cy+y*scale*persp;
      let dx=0,dy=0;
      if(o.grav&&this.pointer.active&&rect){
        const ax=px0-px, ay=py0-py, d2=ax*ax+ay*ay;
        const str=Math.exp(-d2/(scale*scale*.7))*o.gravity*(this.pointer.down?.34:.16);
        dx=ax*str; dy=ay*str;
      }
      for(const r of this.ripples){
        const ax=px-r.x, ay=py-r.y, d=Math.hypot(ax,ay)||1, diff=d-r.age*230;
        const f=Math.exp(-diff*diff/1200)*(1-r.age/1.3)*24;
        dx+=ax/d*f; dy+=ay/d*f;
      }
      p.sx=px+dx; p.sy=py+dy; p.pz=persp;
    }
    this._order.sort((a,b)=>this.particles[a].pz-this.particles[b].pz);
    ctx.globalCompositeOperation="lighter";
    const eco=o.quality==="eco", glowK=.5+o.glow*.65, sizeK=o.psize*Math.min(w,h)/420;
    const fade=this.state==="connecting"?Math.min(1,this.stateTime/1.1):1;
    for(let n=0;n<N;n++){
      const p=this.particles[this._order[n]];
      const alpha=Math.min(.92,(.16+p.j*.5)*p.pz*glowK)*fade;
      const r=Math.max(.25,(0.5+p.j*1.3)*p.pz*sizeK);
      const col=p.j>.8?this._bright:p.j>.34?this._coreS:this._secondS;
      if(!eco&&p.j>.96){
        ctx.globalAlpha=alpha*o.glow*.1; ctx.fillStyle=this._coreS;
        ctx.beginPath(); ctx.arc(p.sx,p.sy,r*4,0,TAU); ctx.fill();
        ctx.globalAlpha=alpha*o.glow*.22;
        ctx.beginPath(); ctx.arc(p.sx,p.sy,r*2,0,TAU); ctx.fill();
      }
      ctx.globalAlpha=alpha; ctx.fillStyle=col;
      ctx.beginPath(); ctx.arc(p.sx,p.sy,r,0,TAU); ctx.fill();
    }
    if(o.links&&!eco){
      ctx.lineWidth=.5; ctx.strokeStyle=this._coreS; ctx.globalAlpha=.08*glowK*fade;
      for(let i=0;i<N-3;i+=31){
        const p=this.particles[i],q=this.particles[i+3];
        const d=Math.hypot(p.sx-q.sx,p.sy-q.sy);
        if(d<scale*.45&&d>5){ ctx.beginPath(); ctx.moveTo(p.sx,p.sy); ctx.lineTo(q.sx,q.sy); ctx.stroke(); }
      }
    }
    if(this.state==="listening"&&lvl>.03){
      ctx.globalAlpha=.14*lvl; ctx.lineWidth=1; ctx.strokeStyle=this._coreS;
      ctx.beginPath(); ctx.arc(cx,cy,scale*1.9*(1+lvl*.42)+6,0,TAU); ctx.stroke();
    }
    for(const r of this.ripples){
      ctx.globalAlpha=Math.max(0,.18*(1-r.age/1.3)); ctx.lineWidth=.7; ctx.strokeStyle=this._coreS;
      ctx.beginPath(); ctx.arc(r.x,r.y,r.age*230,0,TAU); ctx.stroke();
    }
    ctx.globalCompositeOperation="source-over"; ctx.globalAlpha=1;
  }
  _loop(stamp){
    this._raf=requestAnimationFrame(this._loop);
    if(document.hidden) return;
    const dt=this._last?Math.min((stamp-this._last)/1000,.04):.016;
    this._last=stamp;
    this.fps+=((1/Math.max(dt,.001))-this.fps)*.06;
    if(this.analyser&&this._td){
      this.analyser.getByteTimeDomainData(this._td);
      let sum=0; for(let i=0;i<this._td.length;i++){const v=(this._td[i]-128)/128; sum+=v*v;}
      this._target=Math.min(1,Math.sqrt(sum/this._td.length)*3.2);
    }
    const atk=this._target>this.smoothLevel?.4:.09;
    this.smoothLevel+=(this._target-this.smoothLevel)*atk;
    const animating=this.o.animate;
    if(animating){
      this.time+=dt*(.25+this.o.speed*1.6);
      this.stateTime+=dt;
      for(let i=this.ripples.length-1;i>=0;i--){ this.ripples[i].age+=dt; if(this.ripples[i].age>1.3)this.ripples.splice(i,1); }
      this._render(true,dt);
    } else if(this._dirty){ this._render(false,dt); this._dirty=false; }
    if(this._onFrame) this._onFrame(this);
  }
  destroy(){
    cancelAnimationFrame(this._raf);
    if(this._ro)this._ro.disconnect(); else window.removeEventListener("resize",this._resize);
    for(const [el,ev,fn,opt] of this._ev) el.removeEventListener(ev,fn,opt);
    this._ev.length=0; this.disconnectAnalyser(); this.ripples.length=0;
    this.canvas.remove(); this._onFrame=null;
  }
}
AnyOrb.DEFAULTS=DEFAULTS; AnyOrb.STATES=STATES; AnyOrb.THEMES=THEMES;
window.AnyOrb=AnyOrb;

if(typeof customElements!=="undefined"&&!customElements.get("voice-orb")){
  class VoiceOrbElement extends HTMLElement{
    static get observedAttributes(){return ["state","theme","particles","accent","quiet"];}
    connectedCallback(){
      if(this.orb) return;
      const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.orb=new AnyOrb(this,{
        state:this.getAttribute("state")||"idle",
        theme:this.getAttribute("theme")||"glacier",
        particles:+(this.getAttribute("particles")||1600),
        accent:this.getAttribute("accent")||null,
        interactive:!this.hasAttribute("quiet"),
        animate:!reduced
      });
    }
    attributeChangedCallback(n,oldV,v){
      if(!this.orb||oldV===v) return;
      if(n==="state") this.orb.setState(v);
      else if(n==="particles") this.orb.set("particles",+v);
      else if(n==="theme") this.orb.set("theme",v);
      else if(n==="accent") this.orb.set("accent",v);
    }
    disconnectedCallback(){ if(this.orb){this.orb.destroy();this.orb=null;} }
  }
  customElements.define("voice-orb",VoiceOrbElement);
}
})();
