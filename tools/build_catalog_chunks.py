#!/usr/bin/env python3
"""Generate bounded classic scripts for Nginx/Apache and file://; use existing verified JSON only."""
from pathlib import Path
import hashlib,json

ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'src/apps/assets'
compact=lambda value:json.dumps(value,ensure_ascii=False,separators=(',',':'))

def build_chunks():
 data=json.loads((ROOT/'data/national-directory/schools.json').read_text())
 sources=json.loads((ROOT/'data/national-directory/sources.json').read_text())['sources']
 records=data['schools']
 build=hashlib.sha256(compact(records).encode()).hexdigest()[:16]
 target=ASSETS/'national-school-parts-v7219'
 target.mkdir(exist_ok=True)
 groups=[];group=[];size=0
 for record in records:
  encoded=compact(record);length=len(encoded.encode())+1
  if group and size+length>180*1024:
   groups.append(group);group=[];size=0
  group.append(record);size+=length
 if group:groups.append(group)
 parts=[]
 for index,rows in enumerate(groups,1):
  part_id=f'{index:02d}'
  filename=f'part-{part_id}-{build}.js'
  payload=f'window.MVERI_NATIONAL_CATALOG.register({compact(build)},{compact(part_id)},{compact(rows)});\n'
  (target/filename).write_text(payload)
  parts.append({'id':part_id,'file':f'{target.name}/{filename}','count':len(rows),'bytes':len(payload.encode()),'sha256':hashlib.sha256(payload.encode()).hexdigest()})
 template=(ROOT/'tools/templates/national-school-loader.js').read_text()
 for key,value in [('BUILD',build),('METADATA',data['meta']),('SOURCES',sources),('PARTS',parts)]:
  template=template.replace('__CATALOG_'+key+'__',compact(value))
 (ASSETS/'national-school-loader-v7219.js').write_text(template)
 (ASSETS/'national-school-parts-v7219/manifest.json').write_text(json.dumps({'build':build,'count':len(records),'parts':parts},ensure_ascii=False,indent=2)+'\n')
 print(f'Catalog chunks: {len(records)} verified rows, {len(parts)} parts, largest {max(p["bytes"] for p in parts)} bytes.')

if __name__=='__main__':build_chunks()
