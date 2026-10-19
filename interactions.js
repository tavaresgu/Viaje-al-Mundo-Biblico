document.querySelectorAll('#preview-dots,#uso-dots').forEach(function(el){el.replaceChildren()});

/* ── Acordeón de la FAQ ── */
function openFaq(btn){
  var item=btn.closest('.faq-item'),open=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(el){el.classList.remove('open')});
  if(!open)item.classList.add('open');
  document.querySelectorAll('.faq-btn').forEach(function(b){b.setAttribute('aria-expanded', String(b.closest('.faq-item').classList.contains('open')))});
}
/* ── Video de la app: reproduce solo cuando está a la vista ── */
(function(){
  var video=document.getElementById('mb-app-demo-video');
  if(!video)return;
  video.muted=true; video.defaultMuted=true;
  var isInView=false;
  function pauseVideo(){ if(!video.paused)video.pause(); }
  function playVideo(){
    if(document.hidden)return;
    var attempt=video.play();
    if(attempt&&typeof attempt.catch==='function')attempt.catch(function(){});
  }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        isInView=entry.isIntersecting&&entry.intersectionRatio>=0.4;
        if(isInView)playVideo(); else pauseVideo();
      });
    },{threshold:[0,0.4,0.75]}).observe(video);
  }else{ playVideo(); }
  document.addEventListener('visibilitychange',function(){
    if(document.hidden)pauseVideo(); else if(isInView)playVideo();
  });
})();
/* ── Carrusel "Así se usa" ── */
(function(){
  var track=document.getElementById('uso-track');
  var prev=document.getElementById('uso-prev');
  var next=document.getElementById('uso-next');
  var dotsWrap=document.getElementById('uso-dots');
  if(!track||!prev||!next)return;
  var slides=[].slice.call(track.querySelectorAll('.uso-slide'));
  if(!slides.length)return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer=null, resume=null, inView=false, current=0;
  function paso(){
    var a=slides[0].getBoundingClientRect();
    if(slides.length>1){ var b=slides[1].getBoundingClientRect(); return Math.round(b.left-a.left); }
    return Math.round(a.width);
  }
  function indiceActual(){ var p=paso(); return p?Math.round(track.scrollLeft/p):0; }
  function alFinal(){ return track.scrollLeft+track.clientWidth>=track.scrollWidth-4; }
  function irA(i,suave){ var p=paso(); track.scrollTo({left:i*p,behavior:(suave&&!reduce)?'smooth':'auto'}); }
  function avanzar(){ if(alFinal())irA(0,true); else irA(indiceActual()+1,true); }
  function retroceder(){ if(track.scrollLeft<=4)irA(slides.length-1,true); else irA(indiceActual()-1,true); }
  var dots=[];
  if(dotsWrap){
    slides.forEach(function(_,i){
      var d=document.createElement('button');
      d.type='button';
      d.className='uso-dot'+(i===0?' is-active':'');
      d.setAttribute('aria-label','Mostrar imagen '+(i+1));
      d.addEventListener('click',function(){pausar();irA(i,true)});
      dotsWrap.appendChild(d); dots.push(d);
    });
  }
  function pintarDots(){
    var i=indiceActual(); if(i===current)return; current=i;
    dots.forEach(function(d,n){d.classList.toggle('is-active',n===i)});
  }
  function arrancar(){
    if(reduce||timer||!inView)return;
    timer=setInterval(function(){ if(document.hidden)return; avanzar(); },4000);
  }
  function detener(){ if(timer){clearInterval(timer);timer=null} }
  function pausar(){ detener(); if(resume)clearTimeout(resume); resume=setTimeout(arrancar,9000); }
  prev.addEventListener('click',function(){pausar();retroceder()});
  next.addEventListener('click',function(){pausar();avanzar()});
  track.addEventListener('pointerdown',pausar);
  track.addEventListener('touchstart',pausar,{passive:true});
  track.addEventListener('wheel',pausar,{passive:true});
  track.addEventListener('mouseenter',detener);
  track.addEventListener('mouseleave',arrancar);
  var raf=null;
  track.addEventListener('scroll',function(){
    if(raf)return; raf=setTimeout(function(){raf=null;pintarDots()},120);
  },{passive:true});
  document.addEventListener('visibilitychange',function(){
    if(document.hidden)detener(); else if(inView)arrancar();
  });
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(entradas){
      entradas.forEach(function(e){
        inView=e.isIntersecting&&e.intersectionRatio>=0.3;
        if(inView)arrancar(); else detener();
      });
    },{threshold:[0,0.3,0.6]}).observe(track);
  }else{ inView=true; arrancar(); }
})();
/* ══ CONTADORES ANIMADOS — 300 / 100 / 9 / 7 ══ */
(function(){
  var nums=[].slice.call(document.querySelectorAll('.counter-num'));
  if(!nums.length)return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animate(el){
    if(el.dataset.done==='1')return;
    el.dataset.done='1';
    var target=parseInt(el.getAttribute('data-target')||'0',10);
    var suffix=el.getAttribute('data-suffix')||'';
    if(reduce){el.textContent=target+suffix;return;}
    var start=performance.now(),duration=1150;
    function frame(now){
      var p=Math.min(1,(now-start)/duration);
      var eased=1-Math.pow(1-p,3);
      el.textContent=Math.floor(target*eased)+suffix;
      if(p<1)requestAnimationFrame(frame); else el.textContent=target+suffix;
    }
    requestAnimationFrame(frame);
  }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){animate(e.target);io.unobserve(e.target);}});
    },{threshold:.55});
    nums.forEach(function(n){io.observe(n)});
  }else{nums.forEach(animate)}
})();

/* ══ CARRUSEL GRANDE DE PÁGINAS — autoplay + flechas + swipe ══ */
(function(){
  var viewport=document.getElementById('preview-viewport');
  var track=document.getElementById('preview-track');
  var slides=track ? [].slice.call(track.querySelectorAll('.preview-slide')) : [];
  var prev=document.getElementById('preview-prev');
  var next=document.getElementById('preview-next');
  var dotsWrap=document.getElementById('preview-dots');
  var stage=document.getElementById('preview-stage');

  if(!viewport||!track||!slides.length||!prev||!next||!dotsWrap||!stage)return;

  var reduce=window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var current=0;
  var timer=null;
  var resumeTimer=null;
  var settleTimer=null;
  var inView=false;
  var dots=[];

  slides.forEach(function(_,i){
    var d=document.createElement('button');
    d.type='button';
    d.className='preview-dot'+(i===0?' is-active':'');
    d.setAttribute('aria-label','Mostrar página '+(i+1));
    d.addEventListener('click',function(){
      pauseAuto(5500);
      go(i,true);
    });
    dotsWrap.appendChild(d);
    dots.push(d);
  });

  function normalizedIndex(i){
    return (i + slides.length) % slides.length;
  }

  function targetScrollLeft(i){
    var slide=slides[i];
    var viewportRect=viewport.getBoundingClientRect();
    var slideRect=slide.getBoundingClientRect();

    return viewport.scrollLeft
      + (slideRect.left - viewportRect.left)
      - (viewport.clientWidth - slideRect.width)/2;
  }

  function paint(){
    slides.forEach(function(s,i){
      var distance=Math.abs(i-current);
      s.classList.toggle('is-active',i===current);
      s.classList.toggle('is-near',distance===1 || distance===slides.length-1);
    });

    dots.forEach(function(d,i){
      d.classList.toggle('is-active',i===current);
    });
  }

  function go(i,smooth){
    current=normalizedIndex(i);

    viewport.scrollTo({
      left:Math.max(0,targetScrollLeft(current)),
      behavior:(smooth&&!reduce)?'smooth':'auto'
    });

    paint();
  }

  function nearestIndex(){
    var viewportRect=viewport.getBoundingClientRect();
    var viewportCenter=viewportRect.left+viewport.clientWidth/2;
    var best=0;
    var bestDistance=Infinity;

    slides.forEach(function(slide,i){
      var r=slide.getBoundingClientRect();
      var c=r.left+r.width/2;
      var distance=Math.abs(c-viewportCenter);

      if(distance<bestDistance){
        bestDistance=distance;
        best=i;
      }
    });

    return best;
  }

  function stopAuto(){
    if(timer){
      clearInterval(timer);
      timer=null;
    }
  }

  function startAuto(){
    if(reduce||timer||!inView||document.hidden)return;

    timer=setInterval(function(){
      go(current+1,true);
    },3600);
  }

  function pauseAuto(delay){
    stopAuto();

    if(resumeTimer)clearTimeout(resumeTimer);

    resumeTimer=setTimeout(function(){
      startAuto();
    },delay||5000);
  }

  prev.addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    pauseAuto(5000);
    go(current-1,true);
  });

  next.addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    pauseAuto(5000);
    go(current+1,true);
  });

  viewport.addEventListener('pointerdown',function(){
    pauseAuto(6000);
  });

  viewport.addEventListener('touchstart',function(){
    pauseAuto(6000);
  },{passive:true});

  viewport.addEventListener('wheel',function(){
    pauseAuto(6000);
  },{passive:true});

  viewport.addEventListener('scroll',function(){
    if(settleTimer)clearTimeout(settleTimer);

    settleTimer=setTimeout(function(){
      var n=nearestIndex();

      if(n!==current){
        current=n;
        paint();
      }
    },100);
  },{passive:true});

  document.addEventListener('visibilitychange',function(){
    if(document.hidden){
      stopAuto();
    }else{
      startAuto();
    }
  });

  window.addEventListener('resize',function(){
    setTimeout(function(){
      go(current,false);
    },80);
  });

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        inView=entry.isIntersecting && entry.intersectionRatio>=0.18;

        if(inView){
          startAuto();
        }else{
          stopAuto();
        }
      });
    },{threshold:[0,.18,.45,.8]});

    io.observe(stage);
  }else{
    inView=true;
  }

  requestAnimationFrame(function(){
    go(0,false);
    setTimeout(startAuto,650);
  });
})();

