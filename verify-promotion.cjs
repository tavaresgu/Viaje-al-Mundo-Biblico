const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element {
 constructor(){this.children=[];this.hidden=false;this.textContent='';this.style={};this.attributes={};}
 append(...items){this.children.push(...items);}
 before(item){this.beforeItem=item;}
 replaceChildren(...items){this.children=items;}
 setAttribute(name,value){this.attributes[name]=value;}
 addEventListener(type,fn){this[type]=fn;}
}
function run(promotion){
 const banner=new Element(),cta=new Element(),price=new Element(),body=new Element();let timers=[],intervals=[],now=Date.now();class TestDate extends Date{static now(){return now;}}
 const context={window:{BIBLICAL_STORE:{price:16.99,currency:'EUR',promotion}},document:{body,hidden:false,querySelector:s=>s.includes('urgencia-inner')?banner:s.includes('data-mb-buy')?cta:price,createElement:()=>new Element(),createTextNode:text=>({textContent:text})},Intl,Date:TestDate,Number,Math,setTimeout:(fn,delay)=>{timers.push({fn,delay});return timers.length;},clearTimeout(){},setInterval:fn=>{intervals.push(fn);return intervals.length;},clearInterval(){}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/promotion.js','utf8'),context);return {banner,cta,price,body,timers,context,advance:ms=>{now+=ms;intervals.forEach(fn=>fn());}};
}
const demo=run({demo:true,endsAt:'',remaining:null,regularPrice:34,purchases:[]});
assert.match(demo.banner.children[0].textContent,/DEMO/);assert.equal(demo.cta.beforeItem.children[2].attributes['aria-valuenow'],'73');assert.equal(demo.cta.beforeItem.children[2].children[0].style.width,'73%');assert.equal(demo.cta.beforeItem.children[3].children[1].textContent,'73% reservado');assert.equal(demo.banner.children[3].children[1].textContent,new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(34));assert.equal(demo.body.children.length,1);assert.ok(demo.timers[0].delay>=6000&&demo.timers[0].delay<=10000);demo.timers[0].fn();assert.equal(demo.body.children[0].hidden,false);assert.match(demo.body.children[0].children[1].children[0].textContent,/FICTICIA/);
const expired=run({demo:false,countdownMinutes:15,remaining:0,regularPrice:34,purchases:[]});expired.advance(15*60*1000);assert.equal(expired.context.window.BIBLICAL_STORE.price,16.99);assert.equal(expired.cta.hidden,true);assert.equal(expired.body.children.length,0);assert.equal(expired.banner.children[2].hidden,false);assert.equal(expired.banner.children[2].children[2].children[0].textContent,'15');expired.advance(60000);assert.equal(expired.banner.children[2].children[2].children[0].textContent,'14');expired.advance(3600000);assert.equal(expired.banner.children[2].children[2].children[0].textContent,'15');
const blank=run({demo:false,remaining:null,regularPrice:34,purchases:[]});assert.equal(blank.banner.children[2].children[2].children[0].textContent,'14');assert.equal(blank.banner.children[2].children[3].children[0].textContent,'13');assert.equal(blank.cta.beforeItem,undefined);assert.equal(blank.body.children.length,0);
const actual=run({demo:false,endsAt:'2099-01-01T00:00:00Z',remaining:5,regularPrice:34,purchases:[{name:'Lector A.',country:'Irlanda',purchasedAt:new Date(Date.now()-120000).toISOString()}]});actual.timers[0].fn();assert.equal(actual.body.children[0].children[1].children[0].textContent,'COMPRA RECIENTE');assert.match(actual.body.children[0].children[1].children[3].textContent,/Hace 2 minutos/);actual.body.children[0].children[2].click();assert.equal(actual.body.children[0].hidden,true);
console.log('Promotion verified: labelled preview, expiry, zero allocation, missing data, actual timestamps and dismissal.');
