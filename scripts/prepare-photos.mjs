import { mkdir, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const outDir = join(process.cwd(),"public","images");
await mkdir(outDir,{recursive:true});
const photos = {
 "hero.jpg": [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=82",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=82",
  "https://images.pexels.com/photos/5490236/pexels-photo-5490236.jpeg?w=1200"
 ],
 "pressao.jpg": [
  "https://images.pexels.com/photos/17026670/pexels-photo-17026670.jpeg?w=850",
  "https://images.pexels.com/photos/5490236/pexels-photo-5490236.jpeg?w=850",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=850&q=80"
 ],
 "clareza.jpg": [
  "https://images.pexels.com/photos/20022690/pexels-photo-20022690.jpeg?w=850",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=850&q=80"
 ],
 "partida.jpg": [
  "https://images.pexels.com/photos/5490236/pexels-photo-5490236.jpeg?w=850",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=850&q=80"
 ]
};
async function download(name, urls) {
 const target = join(outDir,name);
 try { if ((await stat(target)).size > 15000) {console.log(name,"already locally available");return;} }catch{}
 for (const url of urls) {
  for(let attempt=0;attempt<2;attempt++){
   try{
    const response = await fetch(url,{headers:{"user-agent":"Mozilla/5.0 (compatible; EIXO-Site/1.0)","accept":"image/avif,image/webp,image/jpeg,image/*"},signal:AbortSignal.timeout(18000)});
    if(!response.ok) throw new Error("HTTP "+response.status);
    const data=Buffer.from(await response.arrayBuffer());
    if(data.length<15000 || data[0]!==255 || data[1]!==216 || data[2]!==255) throw new Error("Invalid JPEG bytes");
    await writeFile(target,data);
    console.log("Cached",name,data.length,"bytes");
    return;
   }catch(err){console.warn(name,"source failed",String(err).slice(0,140))}
  }
 }
 throw new Error("No valid photograph downloaded for "+name);
}
await Promise.all(Object.entries(photos).map(([name,urls])=>download(name,urls)));
console.log("All 4 editorial photographs available locally.");
