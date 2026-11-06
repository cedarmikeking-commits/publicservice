import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.gif':'image/gif','.ico':'image/x-icon','.woff2':'font/woff2','.woff':'font/woff','.pdf':'application/pdf','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};
const legacy=new Set(['site','auth','personal','institution','area','assessment','operations','assets','workspace']);
const port=Number(process.env.PORT)||4173;
const server=http.createServer((req,res)=>{
  let pathname;
  try {pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)} catch {res.writeHead(400);res.end('Bad URL');return}
  if(pathname.includes('\0')){res.writeHead(400);res.end('Bad URL');return}
  let segments=pathname.split('/').filter(Boolean);
  if(legacy.has(segments[0])) segments=['src','apps',...segments];
  if(segments.length===0 || pathname.endsWith('/')) segments.push('index.html');
  const file=path.resolve(root,...segments);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Not found: '+pathname);return}
    res.writeHead(200,{'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)
  });
});
server.listen(port,'0.0.0.0',()=>console.log('MVERI V72 http://localhost:'+port));
