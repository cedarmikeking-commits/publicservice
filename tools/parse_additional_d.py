#!/usr/bin/env python3
"""Parse downloaded Sichuan 2026, Jiangxi 2026 and Gansu 2025 originals."""
from pathlib import Path
import json,re,collections,hashlib
import openpyxl,pdfplumber
from parse_initial import clean,record,unit_type,COLLECTED,OUT

def parse_sc():
 s=openpyxl.load_workbook(COLLECTED/'SC-2026.xlsx',data_only=True,read_only=True).worksheets[0]
 groups={};current=None;program_rows=0
 for i,c in enumerate(s.values,1):
  if i<4:continue
  if c[1]:
   name=clean(c[1]);code=clean(c[0]);key=(name,code)
   current=groups.get(key)
   if not current:
    current=record(c[1],'四川省','中职','SC-2026',f'工作表“{s.title}”第{i}行起',localAdmissionCode=code,authority=clean(c[4]),ownership=clean(c[3]),address=clean(c[5]),unitType=unit_type(name),sourceRows=[])
    groups[key]=current
  if current and c[7]:current['sourceRows'].append(i);program_rows+=1
 for r in groups.values():r['sourceProgramRows']=len(r['sourceRows']);r['sourceLocator']+=f'；{len(r["sourceRows"])}条专业点'
 assert len(groups)==343,len(groups)
 return list(groups.values()),{'schoolRows':len(groups),'programRows':program_rows,'expectedSchoolRows':343,'note':'招生代码单列，绝不冒充学校机构码；只取教育部门343校原件'}

def parse_jx():
 included=[];excluded=[];ordinals=[];pages=[]
 with pdfplumber.open(COLLECTED/'JX-2026.pdf') as pdf:
  for pi,p in enumerate(pdf.pages,1):
   ts=p.extract_tables();assert len(ts)==1,(pi,len(ts));n=0;last={}
   for ri,c in enumerate(ts[0],1):
    ordinal=clean(c[0])
    if not re.fullmatch(r'\d+',ordinal):continue
    assert len(c)==14,(pi,ri,len(c))
    code,name,typ=clean(c[1]),clean(c[2]),clean(c[5]);ordinals.append(int(ordinal));n+=1
    # Empty cells within a shared, vertically merged city/ownership are not
    # inferred across unrelated rows; leave them unspecified instead.
    base=dict(name=name,code=code,sourceId='JX-2026',sourceLocator=f'原PDF第{pi}页（印刷页码{pi+2}）表第{ri}行；序号{ordinal}',sourceOrdinal=ordinal)
    if '人社' in typ or re.search('技工学校|技师学院|高级技工',typ):
     excluded.append({**base,'reason':'原表办学类型为人社行政部门技工院校，单列排除'});continue
    r=record(c[2],'江西省','中职','JX-2026',base['sourceLocator'],code=code,city=clean(c[7]),authority=clean(c[4]),ownership=clean(c[3]),address=clean(c[8]),unitType=unit_type(name,code),schoolSubtype=typ,sourceOrdinal=ordinal,qualityTier=clean(c[6]))
    if len(code)!=10:r['codeFormatIssue']='原件标识码不是10位，原样保留'
    included.append(r)
   pages.append({'page':pi,'rows':n})
 assert len(ordinals)==280 and sorted(ordinals)==list(range(1,281)),(len(ordinals),set(range(1,281))-set(ordinals))
 assert len(included)==189 and len(excluded)==91,(len(included),len(excluded))
 return included,excluded,{'allRows':280,'educationRows':189,'technicalExcluded':91,'pageCounts':pages,'warning':'省级公文由江西教育传媒集团转载，原考试院链接404；原件机构码和原文分类保留'}

def inspect_gs():
 with pdfplumber.open(COLLECTED/'GS-2025.pdf') as f:
  print('GS pages',len(f.pages))
  for i,p in enumerate(f.pages):
   text=p.extract_text() or ''
   if '中等职业学校' in text:
    print('PAGE',i+1,'\n',text[:4500])
    ts=p.extract_tables();print('TABLES',len(ts));print(ts[0][:5] if ts else '')

if __name__=='__main__':
 sc,sa=parse_sc();jx,ex,ja=parse_jx()
 (OUT/'additional_d_records.json').write_text(json.dumps(sc+jx,ensure_ascii=False,indent=2))
 (OUT/'additional_d_audit.json').write_text(json.dumps({'SC-2026':sa,'JX-2026':ja},ensure_ascii=False,indent=2))
 (OUT/'additional_d_exclusions.json').write_text(json.dumps(ex,ensure_ascii=False,indent=2))
 print('parsed SC',len(sc),'JX',len(jx),'excluded',len(ex))
 inspect_gs()
