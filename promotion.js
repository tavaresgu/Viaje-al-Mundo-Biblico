(() => {
 const config=window.BIBLICAL_STORE, offer=config.promotion;
 if(!offer)return;
 const demo=offer.demo===true;
 const formatMoney=value=>new Intl.NumberFormat('es-ES',{style:'currency',currency:config.currency}).format(value);
 const duration=Math.round((Number.isFinite(offer.countdownMinutes)&&offer.countdownMinutes>0?offer.countdownMinutes:14+13/60)*60*1000);
 // Start a fresh countdown on each page visit. No saved deadline or expiry state.
 let deadline=Date.now()+duration;
 const banner=document.querySelector('#comprar .urgencia-inner');
 if(banner && Number.isFinite(deadline)){
   banner.replaceChildren();
   const label=document.createElement('p');label.className='offer-kicker';label.textContent=(demo?'DEMO · ':'')+'PRECIO DE BIENVENIDA POR TIEMPO LIMITADO';
   const title=document.createElement('p');title.className='offer-title';title.textContent='Aprovecha este precio antes de que termine el plazo';
   const clock=document.createElement('div');clock.className='offer-clock';clock.setAttribute('aria-label','Tiempo restante para acceder al precio promocional');
   const parts=['días','h','min','seg'].map(unit=>{const box=document.createElement('div');box.className='offer-time';const number=document.createElement('strong');number.textContent='00';const text=document.createElement('span');text.textContent=unit;box.append(number,text);clock.append(box);return {box,number};});
   const note=document.createElement('p');note.className='offer-after';
   note.append(document.createTextNode('⚡ Al finalizar el plazo, vuelve a su precio habitual de '));
   const regularPrice=document.createElement('strong');regularPrice.textContent=formatMoney(offer.regularPrice);note.append(regularPrice,document.createTextNode('.'));
   banner.append(label,title,clock,note);
   function update(){
     if(Date.now()>=deadline)deadline=Date.now()+duration;
     const seconds=Math.max(0,Math.ceil((deadline-Date.now())/1000));
     [Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60].forEach((value,i)=>parts[i].number.textContent=String(value).padStart(2,'0'));
     parts[0].box.hidden=seconds<86400;
   }
   update();setInterval(update,1000);
 }
 const remaining=demo && offer.remaining==null?27:offer.remaining;
 const total=demo && offer.total==null?100:offer.total;
 if(Number.isInteger(remaining)&&remaining>=0){
   const cta=document.querySelector('#oferta [data-mb-buy]');
   if(cta){
     const stock=document.createElement('div');stock.className='offer-stock';
     if(demo){const preview=document.createElement('small');preview.className='offer-stock-preview';preview.textContent='DEMO · VISTA DE LA PROMOCIÓN';stock.append(preview);}
     const head=document.createElement('div');head.className='offer-stock-head';
     const active=document.createElement('span');active.className='offer-stock-active';active.textContent=remaining?'Promoción de bienvenida en curso':'Cupos promocionales agotados';
     const badge=document.createElement('span');badge.className='offer-stock-badge';badge.textContent=remaining?'Últimos cupos':'Agotado';head.append(active,badge);stock.append(head);
     const validTotal=Number.isInteger(total)&&total>0&&remaining<=total;
     const taken=validTotal?Math.round((total-remaining)/total*100):null;
     if(validTotal){
       const bar=document.createElement('div');bar.className='offer-stock-bar';bar.setAttribute('role','progressbar');bar.setAttribute('aria-label','Porcentaje de cupos promocionales utilizados');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','100');bar.setAttribute('aria-valuenow',String(taken));
       const fill=document.createElement('div');fill.className='offer-stock-fill';fill.style.width=taken+'%';bar.append(fill);stock.append(bar);
     }
     const footer=document.createElement('div');footer.className='offer-stock-footer';
     const limited=document.createElement('span');limited.textContent='Cupos limitados';const percent=document.createElement('strong');percent.textContent=validTotal?taken+'% reservado':remaining+' cupos promocionales disponibles';footer.append(limited,percent);stock.append(footer);
     cta.before(stock);if(!demo&&remaining===0){cta.hidden=true;}
   }
 }
 const examples=[{name:'Emma W.',country:'Reino Unido'},{name:'Lukas M.',country:'Alemania'},{name:'Sophie D.',country:'Francia'},{name:'Giulia R.',country:'Italia'},{name:'Oliver B.',country:'Irlanda'},{name:'Eva S.',country:'Países Bajos'}];
 const purchases=demo?examples:(Array.isArray(offer.purchases)?offer.purchases:[]).filter(p=>p&&typeof p.name==='string'&&typeof p.country==='string'&&Number.isFinite(Date.parse(p.purchasedAt))&&Date.parse(p.purchasedAt)<=Date.now());
 if(!purchases.length)return;
 const toast=document.createElement('aside');toast.className='purchase-toast';toast.setAttribute('aria-live','polite');toast.setAttribute('aria-atomic','true');toast.hidden=true;
 const icon=document.createElement('div');icon.className='purchase-toast-icon';icon.setAttribute('aria-hidden','true');
 const body=document.createElement('div'),label=document.createElement('small'),person=document.createElement('strong'),product=document.createElement('p'),time=document.createElement('span'),close=document.createElement('button');
 label.textContent=demo?'DEMO · COMPRA DE EJEMPLO FICTICIA':'COMPRA RECIENTE';product.textContent='Ha adquirido la colección Viaje al Mundo Bíblico 3D';close.type='button';close.className='purchase-toast-close';close.textContent='×';close.setAttribute('aria-label','Cerrar los avisos de compra');body.append(label,person,product,time);toast.append(icon,body,close);document.body.append(toast);
 let pending,hideTimer,stopped=false,last=-1;
 close.addEventListener('click',()=>{stopped=true;clearTimeout(pending);clearTimeout(hideTimer);toast.hidden=true;});
 const random=(min,max)=>Math.floor(min+Math.random()*(max-min+1));
 function schedule(){if(!stopped)pending=setTimeout(show,random(18000,35000));}
 function show(){
   if(stopped)return;
   if(document.hidden){schedule();return;}
   let index=random(0,purchases.length-1);if(purchases.length>1&&index===last)index=(index+1)%purchases.length;last=index;
   const purchase=purchases[index];person.textContent=purchase.name+' · '+purchase.country;
   if(demo){
     icon.className='purchase-toast-icon purchase-toast-avatar';
     icon.style.backgroundPosition=(index%3)*50+'% '+Math.floor(index/3)*100+'%';
     icon.textContent='';
   }else{
     icon.className='purchase-toast-icon';
     icon.textContent=purchase.name.split(/\s+/).slice(0,2).map(part=>part[0]).join('');
   }
   const minutes=demo?random(1,9):Math.max(0,Math.floor((Date.now()-Date.parse(purchase.purchasedAt))/60000));
   time.textContent=(demo?'Ejemplo: ':'')+(minutes===0?'Hace un momento':minutes<60?'Hace '+minutes+' minuto'+(minutes===1?'':'s'):minutes<1440?'Hace '+Math.floor(minutes/60)+' horas':'Hace '+Math.floor(minutes/1440)+' días');
   toast.hidden=false;hideTimer=setTimeout(()=>{toast.hidden=true;schedule();},6500);
 }
 pending=setTimeout(show,random(6000,10000));
})();
