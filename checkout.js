(() => {
 const config=window.BIBLICAL_STORE;
 const offer=config.promotion;
 document.getElementById('price').textContent=new Intl.NumberFormat('es-ES',{style:'currency',currency:config.currency}).format(config.price);
 let destination;
 try {if(config.checkoutUrl){destination=new URL(config.checkoutUrl);if(destination.protocol!=='https:')destination=null;}}catch{}
 if(destination && !(offer&&!offer.demo&&offer.remaining===0)){
   const button=document.getElementById('pay');button.hidden=false;
   document.getElementById('status').hidden=true;
   button.addEventListener('click',()=>{location.assign(destination.href);});
 }
 for(const [label,url] of [['Contacto',config.supportEmail?'mailto:'+config.supportEmail:''],['Condiciones de compra',config.termsUrl],['Política de privacidad',config.privacyUrl]]){
   if(!url)continue;const a=document.createElement('a');a.textContent=label;a.href=url;document.getElementById('links').append(a);
 }
})();
