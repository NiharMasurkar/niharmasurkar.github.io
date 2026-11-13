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
    grad.addColorStop(0,'#F78104');
    grad.addColorStop(0.5,'#249EA0');
    grad.addColorStop(1,'#249EA0');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(36,158,160,0.5)';
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

/* ---- Project lightbox modal ---- */
(function(){
  const modal = document.getElementById('projModal');
  if(!modal) return;
  const elMedia = document.getElementById('modalMedia');
  const elLab = document.getElementById('modalLab');
  const elTitle = document.getElementById('modalTitle');
  const elDesc = document.getElementById('modalDesc');
  const elResults = document.getElementById('modalResults');
  let lastFocus = null;

  const elThumbs = document.getElementById('modalThumbs');
  const elCaption = document.getElementById('modalCaption');

  function galleryItems(card){
    let items = [];
    try{ items = JSON.parse(card.getAttribute('data-gallery') || '[]') || []; }catch(e){ items = []; }
    if(!items.length){
      const src = card.getAttribute('data-media');
      if(src && src.trim() !== ''){
        items = [{src: src, type: card.getAttribute('data-media-type'), poster: card.getAttribute('data-poster')}];
      }
    }
    return items;
  }

  function showItem(item, title){
    elMedia.innerHTML = '';
    if(item.type === 'video'){
      const v = document.createElement('video');
      v.controls = true; v.playsInline = true; v.autoplay = true; v.muted = true; v.loop = true;
      if(item.poster && item.poster.trim() !== '') v.poster = item.poster;
      const s = document.createElement('source'); s.src = item.src; v.appendChild(s);
      elMedia.appendChild(v);
    } else {
      const img = document.createElement('img');
      img.src = item.src; img.alt = item.caption || title;
      elMedia.appendChild(img);
    }
    elCaption.textContent = item.caption || '';
  }

  function buildMedia(card){
    const title = card.getAttribute('data-title') || '';
    const items = galleryItems(card);
    elThumbs.innerHTML = '';
    elCaption.textContent = '';
    if(!items.length){
      elMedia.classList.add('empty');
      elMedia.innerHTML = '<div class="media-placeholder big"><span>media coming soon</span></div>';
      return;
    }
    elMedia.classList.remove('empty');
    showItem(items[0], title);
    if(items.length < 2) return;
    items.forEach((item, i)=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.className = (item.type === 'video' ? 'vid' : '') + (i === 0 ? ' on' : '');
      b.setAttribute('aria-label', item.caption || (title + ' media ' + (i + 1)));
      const t = document.createElement('img');
      t.src = item.type === 'video' ? (item.poster || '') : item.src;
      t.alt = '';
      b.appendChild(t);
      b.addEventListener('click', ()=>{
        elThumbs.querySelectorAll('button').forEach(x=>x.classList.remove('on'));
        b.classList.add('on');
        showItem(item, title);
      });
      elThumbs.appendChild(b);
    });
  }

  function open(card){
    lastFocus = document.activeElement;
    buildMedia(card);
    elLab.textContent = card.getAttribute('data-lab') || '';
    elTitle.textContent = card.getAttribute('data-title') || '';
    elDesc.textContent = card.getAttribute('data-description') || '';
    elResults.textContent = card.getAttribute('data-results') || '';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal-close');
    if(closeBtn) closeBtn.focus();
  }
  function close(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    const vid = elMedia.querySelector('video');
    if(vid){ try{ vid.pause(); }catch(e){} }
    if(lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('#projGrid .card').forEach(card=>{
    const preview = card.querySelector('.card-media video');
    if(preview){
      card.addEventListener('mouseenter', ()=>{ const p = preview.play(); if(p) p.catch(()=>{}); });
      card.addEventListener('mouseleave', ()=>preview.pause());
    }
    card.addEventListener('click', ()=>open(card));
    card.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(card); }
    });
  });
  modal.querySelectorAll('[data-close]').forEach(el=> el.addEventListener('click', close));
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape' && modal.classList.contains('show')) close(); });
})();
