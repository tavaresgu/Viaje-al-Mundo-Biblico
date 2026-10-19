(() => {
 const config=window.BIBLICAL_STORE;
 const price=new Intl.NumberFormat('es-ES',{style:'currency',currency:config.currency}).format(config.price);
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node;while(node=walker.nextNode()) {if(node.parentElement.closest('script,style'))continue;if(node.textContent.includes('€16.99'))node.textContent=node.textContent.replaceAll('€16.99',price);if(node.textContent.trim()==='€34.00')node.parentElement.hidden=true;}
 document.querySelectorAll('.btn-pulse,[data-checkout],[data-mb-buy]').forEach(link => {
   const destination=link.closest('#oferta')?'checkout.html':'#comprar';
   if(link.tagName==='A')link.href=destination;
   else link.addEventListener('click',()=>{location.href=destination;});
 });
 document.querySelectorAll('.faq-btn').forEach(button=>button.setAttribute('aria-expanded','false'));
 // The download captured carousel dots; scripts generate fresh functional dots.
 const footer=document.createElement('div');footer.className='europe-footer';
 const note=document.createElement('p');note.textContent='Contenido digital · Importe en euros · Sin entrega física';footer.append(note);
 for(const [label,url] of [['Condiciones de compra',config.termsUrl],['Política de privacidad',config.privacyUrl],['Contacto',config.supportEmail?'mailto:'+config.supportEmail:'']]) {if(!url)continue;const a=document.createElement('a');a.textContent=label;a.href=url;footer.append(a);}
 if(config.sellerName){const p=document.createElement('p');p.textContent=config.sellerName;footer.append(p);}
 document.body.append(footer);
})();
