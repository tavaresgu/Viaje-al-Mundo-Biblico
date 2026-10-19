const fs=require('node:fs'),path=require('node:path');
module.exports=function(){
 const root=__dirname,folder=path.join(root,'imagens');
 if(!fs.existsSync(folder))return;
 const files=fs.readdirSync(folder).filter(file=>/^\d+\.png$/i.test(file)).sort((a,b)=>parseInt(a)-parseInt(b));
 if(!files.length)return;
 const indexPath=path.join(root,'index.html');let html=fs.readFileSync(indexPath,'utf8');
 const replacements=new Map();let position=0;
 const dimensions=new Map();
 for(const file of files){const bytes=fs.readFileSync(path.join(folder,file));if(bytes.toString('hex',0,8)!=='89504e470d0a1a0a')throw Error('Invalid PNG: '+file);dimensions.set('imagens/'+file,{width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)});}
 html=html.replace(/<img\b[^>]*>/g,tag=>{
   const src=tag.match(/\bsrc="([^"]+)"/)?.[1];
   if(!src||src.startsWith('data:')||/display\s*:\s*none/.test(tag))return tag;
   // Repeated product covers share the same updated file.
   let replacement=replacements.get(src);
   if(!replacement&&position<files.length){replacement='imagens/'+files[position++];replacements.set(src,replacement);}
   if(!replacement)return tag;
   const size=dimensions.get(replacement);
   tag=tag.replace(/\bsrc="[^"]+"/,'src="'+replacement+'"').replace(/\s(?:width|height)="[^"]*"/g,'');
   return tag.replace(/>$/,' width="'+size.width+'" height="'+size.height+'">');
 });
 fs.writeFileSync(indexPath,html);
 const hero='imagens/'+files[0],size=dimensions.get(hero);
 const checkoutPath=path.join(root,'checkout.html');let checkout=fs.readFileSync(checkoutPath,'utf8');
 checkout=checkout.replace(/<img\b[^>]*class="product"[^>]*>/,tag=>tag.replace(/\bsrc="[^"]+"/,'src="'+hero+'"').replace(/\bwidth="[^"]+"/,'width="'+size.width+'"').replace(/\bheight="[^"]+"/,'height="'+size.height+'"'));
 fs.writeFileSync(checkoutPath,checkout);
 fs.writeFileSync(path.join(root,'asset-info.json'),JSON.stringify({hero,updatedImages:files.length},null,2));
 console.log('Updated '+position+' images in numeric order; reused cover in offer and checkout.');
};
if(require.main===module)module.exports();
