const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = __dirname;
const original = fs.readFileSync(path.join(root, '../mundo-biblico-3d.impultienda.ar/index.html'), 'utf8');
const texts = JSON.parse(fs.readFileSync(path.join(root, 'source-texts.json'), 'utf8'));
const translations = new Map(fs.readFileSync(path.join(root, 'translations-es.txt'), 'utf8').trim().split(/\r?\n/).map(line => {const i = line.indexOf('|'); return [texts[Number(line.slice(0,i))], line.slice(i+1)];}));
let interactive = [...original.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][7][1];
interactive = interactive.replace(/\/\* ── Contador ── \*\/[\s\S]*?(?=\/\* ── Carrusel)/, '');
interactive = interactive.replace(/\/\* ══ CAPTURA DE UTM[\s\S]*?(?=\/\* ══ CONTADORES)/, '');
interactive = interactive.replaceAll('Ir a la imagen ', 'Go to image ').replaceAll('Ver página ', 'View page ');
interactive = interactive.replace("  if(!open)item.classList.add('open');", "  if(!open)item.classList.add('open');\n  document.querySelectorAll('.faq-btn').forEach(function(b){b.setAttribute('aria-expanded', String(b.closest('.faq-item').classList.contains('open')))});");
interactive = "document.querySelectorAll('#preview-dots,#uso-dots').forEach(function(el){el.replaceChildren()});\n" + interactive;
fs.writeFileSync(path.join(root, 'interactions.js'), interactive);
let h = original.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '');
// Translate text nodes without touching markup or embedded binary assets.
h = h.replace(/>[^<>]+</g, fragment => {const inner = fragment.slice(1,-1); const key = inner.trim(); return translations.has(key) ? '>' + inner.replace(key, translations.get(key)) + '<' : fragment;});
h = h.replace(/<html[^>]*>/, '<html lang="en-GB">');
let titleSeen = false;
h = h.replace(/<title>[\s\S]*?<\/title>/g, title => {if(titleSeen)return '';titleSeen=true;return title;});
h = h.replace(/<!--[^]*?-->/g, '');
// Translate metadata and accessible descriptions.
const attributeTranslations = {
 'Mundo bíblico 3D: Biblia geográfica 3D para ubicar lugares, recorridos y escenarios bíblicos y profundizar tu lectura.':'Explore biblical places, routes and settings with visual maps and 3D reconstructions.',
 'Siete volúmenes visuales: mapas, rutas, reconstrucciones 3D, cronología, pueblos, vida cotidiana, los cuatro templos y un cuaderno de evaluaciones. Acceso inmediato y garantía de 15 días.':'Seven visual volumes with maps, routes, 3D reconstructions, timelines, civilisations, daily life and teaching activities.',
 'Carrusel de páginas reales de Mundo Bíblico 3D':'Biblical World 3D page preview carousel',
 'Navegación del carrusel':'Carousel navigation',
 'Demostración del explorador interactivo de Mundo Bíblico 3D':'Biblical World 3D interactive explorer demonstration',
 'Funciones del mapa interactivo':'Interactive map features',
 'Mockup 1x1 del Kit de Bienvenida':'Welcome kit preview'
};
h = h.replace(/\b(alt|aria-label|title|content)="([^"<>]{1,600})"/g, (all, attr, value) => {
 let translated = attributeTranslations[value] || translations.get(value);
 if (!translated && attr === 'alt') translated = 'Biblical World 3D — visual Bible study collection';
 if (!translated && attr === 'aria-label') translated = value.replace('Ver página anterior','Previous page').replace('Ver página siguiente','Next page').replace('Ver imagen anterior','Previous image').replace('Ver imagen siguiente','Next image').replace('Ver página ','View page ').replace('Ir a la imagen ','Go to image ');
 return attr + '="' + (translated || value) + '"';
});
// Remove unavailable vendor integrations and replace their routes with local navigation.
h = h.replace(/<link\b[^>]*href="https:\/\/fonts\.[^>]*>/gi, '');
h = h.replace(/<link\b[^>]*href="data:text\/css[^>]*>/gi, '');
h = h.replace(/<input\b[^>]*type="hidden"[^>]*>/gi, '');
h = h.replace(/href="\/checkout[^" ]*"/g, 'href="checkout.html"');
h = h.replace(/(<a\b[^>]*class="btn-pulse"[^>]*href=)"index.html"/g, '$1"#comprar"');
h = h.replace(/href="index.html"(?=[^>]*class="btn-pulse")/g, 'href="#comprar"');
h = h.replace(/<div class="viendo-ahora"[^>]*>[\s\S]*?<\/p>\s*<\/div>/, '');
h = h.replace(/<div class="urgencia-banner">[\s\S]*?(?=<section class="compra-sec")/, '<div class="urgencia-banner" id="comprar"><div class="urgencia-inner"><p class="urgencia-label">🌍 Digital collection · Prices in EUR · No shipping required</p></div></div>');
h = h.replace('<section class="compra-sec" id="comprar">', '<section class="compra-sec" id="oferta">');
h = h.replace(/<a\b[^>]*class="btn-pulse"[^>]*>[\s\S]*?<\/a>/g, link => {
 if (link.includes('data-mb-buy')) return link.replace(/<span>[\s\S]*?<\/span>/, '<span>📖 GET THE COLLECTION — CONTINUE TO CHECKOUT →</span>');
 return link.replace(/href="[^"]*"/, 'href="#comprar"');
});
h = h.replace(/<div id="notif"[\s\S]*?(?=<\/body>)/, '');
h = h.replace(/https:\/\/[^"\s]+\/1787637564886_demo-app-mundo-biblico-3d-web\.mp4/g, 'assets/interactive-demo.mp4');
h = h.replace(/https:\/\/[^"\s]+\/1787637569222_demo-app-mundo-biblico-3d-poster\.webp/g, 'assets/interactive-poster.webp');
h = h.replace(/(<span\b[^>]*class="counter-num"[^>]*data-target="(\d+)"[^>]*data-suffix="([^"]*)"[^>]*>)0(<\/span>)/g, '$1$2$3$4');
h = h.replace(/<[^>]+class="[^"]*(?:compra-old|compra-precio-old|precio-old|price-old)[^"]*"[^>]*>€34\.00<\/[^>]+>/g, '');
// Retain original style while gently changing the palette.
const colours = {'#0E0B08':'#0C1520','#1A130C':'#152231','#2A1E11':'#203244','#120E09':'#101B29','#17110A':'#142333','#7A4408':'#36536C','#9E5A0C':'#4B6A82','#FFB24A':'#D9B76B','#F5C542':'#E2BF72','#FFD86B':'#F0D393','#FFE08A':'#F2DAA3','#F5B700':'#CE9F48','#CEC2B0':'#C5CCD3','#D8CCBA':'#D0D7DF'};
h = h.replace(/<style[^>]*>[\s\S]*?<\/style>/g, style => {for (const [from,to] of Object.entries(colours)) style = style.replace(new RegExp(from,'gi'),to); return style.replaceAll('225,132,22','94,139,174').replaceAll('160,90,15','65,100,131').replaceAll('245,197,66','226,191,114');});
fs.mkdirSync(path.join(root,'assets'), {recursive:true});
let heroAsset;
const heroOriginal = original.match(/<img[^>]*src="(data:[^"]+)"[^>]*fetchpriority="high"/);
h = h.replace(/data:([\w.+/-]+);base64,([A-Za-z0-9+/=\r\n]+)/g, (all,mime,base64) => {
 const bytes = Buffer.from(base64,'base64');
 const ext = {'image/webp':'webp','image/png':'png','image/jpeg':'jpg','image/svg+xml':'svg','font/woff2':'woff2','font/woff':'woff','video/mp4':'mp4'}[mime] || 'bin';
 const file = 'assets/'+crypto.createHash('sha256').update(bytes).digest('hex').slice(0,16)+'.'+ext;
 if(!fs.existsSync(path.join(root,file))) fs.writeFileSync(path.join(root,file),bytes);
 if(heroOriginal && heroOriginal[1] === all) heroAsset = file;
 return file;
});
// Deduplicate the font CSS downloaded twice.
const seenStyles = new Set();
h = h.replace(/<style[^>]*>[\s\S]*?<\/style>/g, style => {if(seenStyles.has(style))return ''; seenStyles.add(style);return style;});
h = h.replace('</head>', '<link rel="stylesheet" href="europe.css"><link rel="stylesheet" href="clean.css"></head>');
h = h.replace('</body>', '<script src="config.js"></script><script src="interactions.js"></script><script src="store.js"></script><script src="promotion.js"></script></body>');
fs.writeFileSync(path.join(root, 'index.html'),h);
fs.writeFileSync(path.join(root, 'asset-info.json'),JSON.stringify({hero:heroAsset},null,2));
require('./localize-es.cjs')();
require('./update-images.cjs')();
console.log('Adapted landing page. Hero asset:',heroAsset,'Assets:',fs.readdirSync(path.join(root,'assets')).length);
