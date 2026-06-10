(function(){
  const canvas = document.getElementById('scope');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, dpr;

  function resize(){
    dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  let pulses = [];

  function bg(){
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for(let x=0;x<=W;x+=W/12){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<=H;y+=H/4){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  }

  function sample(nx, time){
    let v = 0;
    v += Math.sin(nx*22 + time*2.2) * 0.10;
    v += Math.sin(nx*9 - time*1.3) * 0.06;
    for(const p of pulses){
      const age = time - p.t;
      const d = nx - p.x;
      const env = Math.exp(-Math.pow(d*9,2)) * Math.exp(-age*1.6);
      v += Math.sin(d*120 - age*10) * env * p.amp;
    }
    return v;
  }

  function draw(time){
    bg();
    const grad = ctx.createLinearGradient(0,0,W,0);
    grad.addColorStop(0,'#F2A65A');
    grad.addColorStop(0.5,'#45C8B8');
    grad.addColorStop(1,'#45C8B8');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(69,200,184,0.5)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    const steps = Math.max(120, Math.floor(W));
    for(let i=0;i<=steps;i++){
      const nx = i/steps;
      const y = H/2 + sample(nx, time) * (H*0.42);
      if(i===0) ctx.moveTo(nx*W, y); else ctx.lineTo(nx*W, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    pulses = pulses.filter(p => time - p.t < 4);
  }

  let start = performance.now();
  function loop(now){
    draw((now - start)/1000);
    requestAnimationFrame(loop);
  }
  if(reduce){
    draw(0.4);
    pulses.push({x:0.5,t:0.4,amp:1.0});
    draw(0.4);
  } else {
    requestAnimationFrame(loop);
  }

  const panel = document.getElementById('scopePanel');
  if(panel){
    panel.addEventListener('click', function(e){
      const rect = canvas.getBoundingClientRect();
      let x = (e.clientX - rect.left)/rect.width;
      if(x<0||x>1) x = 0.5;
      const t = (performance.now() - start)/1000;
      pulses.push({x:x, t:t, amp:1.0});
      if(reduce){ draw(t); }
    });
  }

  document.querySelectorAll('#projGrid .card').forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      card.style.setProperty('--px', ((e.clientX-r.left)/r.width*100)+'%');
      card.style.setProperty('--py', ((e.clientY-r.top)/r.height*100)+'%');
    });
  });

  const rows = document.querySelectorAll('.tl-row');
  if('IntersectionObserver' in window && !reduce){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach((en)=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
    },{threshold:0.2});
    rows.forEach(r=>io.observe(r));
  } else {
    rows.forEach(r=>r.classList.add('in'));
  }
})();
