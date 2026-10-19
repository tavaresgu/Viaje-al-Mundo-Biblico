const fs=require('node:fs'),path=require('node:path');
const replacements={
 'en-GB':'es-ES','en-IE':'es-ES',
 'Biblical World 3D':'Mundo Bíblico 3D',
 'GET THE COLLECTION — CONTINUE TO CHECKOUT':'ACCEDER A MI BIBLIOTECA — IR AL PAGO',
 'Digital collection · Prices in EUR · No shipping required':'Biblioteca digital · Precios en euros · Sin gastos de envío',
 'Digital collection · Prices in EUR · No physical delivery':'Contenido digital · Importe en euros · Sin entrega física',
 'Terms of sale':'Condiciones de compra','Privacy policy':'Política de privacidad','Contact':'Contacto',
 'visual Bible study collection':'biblioteca visual para estudiar las Escrituras',
 'Explore biblical places, routes and settings with visual maps and 3D reconstructions.':'Sitúa cada relato en su entorno con mapas, itinerarios y recreaciones tridimensionales.',
 'Seven visual volumes with maps, routes, 3D reconstructions, timelines, civilisations, daily life and teaching activities.':'Siete volúmenes de consulta con cartografía, escenarios, cronologías y propuestas de estudio.',
 'page preview carousel':'carrusel de vistas del material','Carousel navigation':'Navegación de las vistas',
 'interactive explorer demonstration':'demostración del explorador digital','Interactive map features':'Herramientas del mapa',
 'Welcome kit preview':'Vista del pack de inicio','Previous page':'Página anterior','Next page':'Página siguiente','Previous image':'Imagen anterior','Next image':'Imagen siguiente','Go to image ':'Mostrar imagen ','View page ':'Mostrar página ',
 'LIMITED-TIME LAUNCH OFFER':'PRECIO DE BIENVENIDA POR TIEMPO LIMITADO',
 'Your launch offer ends in':'Aprovecha este precio antes de que termine el plazo',
 'Time remaining until the launch offer ends':'Tiempo restante para acceder al precio promocional',
 "['days','hrs','min','sec']":"['días','h','min','seg']",
 '⚡ Then it returns to its regular price of ':'⚡ Al finalizar el plazo, vuelve a su precio habitual de ',
 'Demo offer ended':'El plazo de prueba ha terminado','The launch offer has ended':'La promoción ha finalizado',
 'Preview complete. Configure your actual offer deadline.':'Vista de prueba finalizada. Configura la fecha real de tu promoción.',
 'The current price is ':'El precio vigente es ',
 'DEMO · OFFER PREVIEW':'DEMO · VISTA DE LA PROMOCIÓN',
 'Launch offer active':'Promoción de bienvenida en curso','Launch allocation sold out':'Cupos promocionales agotados',
 'Only a few left':'Últimos cupos','Sold out':'Agotado',
 'Promotional allocation claimed':'Porcentaje de cupos promocionales utilizados',
 'Limited availability':'Cupos limitados',
 "taken+'% claimed'":"taken+'% reservado'", "remaining+' promotional places left'":"remaining+' cupos promocionales disponibles'",
 'DEMO PURCHASE · FICTIONAL EXAMPLE':'DEMO · COMPRA DE EJEMPLO FICTICIA','RECENT PURCHASE':'COMPRA RECIENTE',
 'Purchased Mundo Bíblico 3D™':'Ha adquirido la colección Mundo Bíblico 3D',
 'Dismiss purchase notifications':'Cerrar los avisos de compra',
 'United Kingdom':'Reino Unido','Germany':'Alemania','France':'Francia','Italy':'Italia','Ireland':'Irlanda','Netherlands':'Países Bajos',
 'Example: ':'Ejemplo: ','Just now':'Hace un momento',
 "minutes+' minute'+(minutes===1?'':'s')+' ago'":"'Hace '+minutes+' minuto'+(minutes===1?'':'s')",
 "Math.floor(minutes/60)+' hours ago'":"'Hace '+Math.floor(minutes/60)+' horas'",
 "Math.floor(minutes/1440)+' days ago'":"'Hace '+Math.floor(minutes/1440)+' días'",
 'Your collection | Mundo Bíblico 3D':'Tu acceso | Mundo Bíblico 3D',
 'Get the complete Mundo Bíblico 3D digital collection. One payment, six bonus volumes and lifetime access.':'Accede a una biblioteca visual de estudio con seis complementos, explorador digital y un único pago.',
 'BIBLICAL WORLD 3D™':'MUNDO BÍBLICO 3D',
 'YOUR VISUAL BIBLE STUDY COLLECTION':'UNA BIBLIOTECA PARA EXPLORAR LAS ESCRITURAS',
 'Bring the world of the Bible into focus.':'Descubre el entorno de cada historia.',
 'Maps, 3D reconstructions and historical context — all in one digital collection.':'Cartografía, escenarios tridimensionales e información histórica para acompañar tu lectura.',
 'The complete visual Bible study collection':'Vista de los volúmenes de la biblioteca bíblica',
 'The complete biblioteca visual para estudiar las Escrituras':'Vista de los volúmenes de la biblioteca bíblica',
 'The complete collection':'Tu biblioteca incluye',
 'One-time payment · Lifetime access':'Un solo pago · Consulta permanente',
 '300+ visual PDF pages':'Más de 300 páginas ilustradas en PDF',
 '100+ maps, routes and biblical settings':'Más de 100 mapas, itinerarios y escenarios',
 '9 sections, from Genesis to Paul’s journeys':'Nueve etapas desde los primeros relatos hasta Pablo',
 'All 6 bonus volumes included':'Seis volúmenes complementarios sin coste extra',
 'Interactive map app and video scenes':'Explorador cartográfico con recreaciones en vídeo',
 'Printable resources for study and teaching':'Recursos imprimibles para tu estudio y tus clases',
 'Continue to secure payment →':'Completar mi compra de forma segura →',
 'Checkout is being prepared. Online payment is not available yet.':'Estamos preparando el acceso al pago. La compra en línea todavía no está habilitada.',
 'Digital delivery by email · No physical shipping':'Entrega digital por correo electrónico · Sin envío físico',
 '15-day seller money-back guarantee':'Garantía de devolución del vendedor durante 15 días',
 '← Back to the collection':'← Volver a los detalles de la colección'
};
module.exports=function(){
 for(const file of ['index.html','interactions.js','promotion.js','store.js','checkout.html','checkout.js']){
   const target=path.join(__dirname,file);let text=fs.readFileSync(target,'utf8');
   for(const [from,to] of Object.entries(replacements))text=from==='Contact'?text.replace(/\bContact\b/g,to):text.split(from).join(to);
   text=text.replace(/\bContactoo+\b/g,'Contacto');
   text=text.replace(/Viaje al Mundo Bíblico 3D™?|La Biblia en Escena 3D™?|Mundo Bíblico 3D™?/g,'Viaje al Mundo Bíblico 3D').replace(/VIAJE AL MUNDO BÍBLICO 3D™?|LA BIBLIA EN ESCENA 3D™?|MUNDO BÍBLICO 3D™?/g,'VIAJE AL MUNDO BÍBLICO 3D');
   fs.writeFileSync(target,text);
 }
};
if(require.main===module)module.exports();
