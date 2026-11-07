#!/usr/bin/env python3
"""Further source-exact parsing: Gansu attachment, live Hunan/Chongqing tables, Jiaxing evidence."""
from pathlib import Path
import json,re,collections
import pdfplumber
from parse_initial import clean,record,unit_type,COLLECTED,OUT,ROOT

def parse_gs():
 rs=[];city='';expected={};counts=collections.Counter()
 with pdfplumber.open(COLLECTED/'GS-2025.pdf') as f:
  for i in [2,3,4]:
   ts=f.pages[i].extract_tables();assert len(ts)==1,(i,len(ts))
   for ri,row in enumerate(ts[0],1):
    if clean(row[0])=='所在市州':continue
    if row[0]:
     m=re.fullmatch(r'(.+?)[（(](\d+)所[）)]',clean(row[0]));assert m,(i,row)
     city=m[1];expected[city]=int(m[2])
    for ci,x in enumerate(row[1:],2):
     if not x:continue
     name=clean(x);typ=unit_type(name)
     if '校区' in name:typ='原名单单列校区'
     rs.append(record(x,'甘肃省','中职','GS-2025',f'原PDF第{i+1}页（印刷页码{i+6}）附件3表第{ri}行第{ci}列',city=city,unitType=typ,sourceYear=2025,verificationScope='政府文件中职院校办事名录，核验实体及中职归类；非年度招生资格名单'))
     counts[city]+=1
 assert counts==expected,(counts,expected)
 assert len(rs)==145,len(rs)
 return rs,{'listedUnitCount':145,'byCity':dict(counts),'sourceScope':'附件3全省中等职业学校一览表；含原名单单列校区，不等于去重独立法人院校数'}

def parse_live():
 hn=json.loads((COLLECTED/'HN-LIVE-2026-11-02.json').read_text());cq=json.loads((COLLECTED/'CQ-LIVE-2025.json').read_text());rs=[];ex=[]
 for c in hn['rows']:
  ordinal,city,name,own,local=c[:5];typ=unit_type(name)
  if '高等专科学校' in name or re.search(r'职业学院$',name):typ='附设中职部'
  if '高级中学' in name and '职业' not in name:typ='普通高中兼办中职招生单位'
  rs.append(record(name,'湖南省','中职','HN-LIVE',f'浏览器实时表格序号{ordinal}',city=city,ownership=own,localAdmissionCode=local,unitType=typ,sourceOrdinal=ordinal,sourceYear=None,verificationScope='湖南省教育厅动态中职招生平台列名；页面未注明名单年度，不承诺2026招生资格'))
 for c in cq['rows']:
  ordinal,district,name,tier,organizer=c[:5]
  if re.search(r'技工|技师',name):
   ex.append({'name':name,'sourceId':'CQ-LIVE','sourceLocator':f'浏览器实时表格序号{ordinal}','reason':'技工院校单列排除'});continue
  rs.append(record(name,'重庆市','中职','CQ-LIVE',f'浏览器实时表格序号{ordinal}',city='重庆市',district=district,qualityTier=tier,organizer=organizer,ownership='民办' if organizer=='民办' else '',unitType=unit_type(name),sourceOrdinal=ordinal,sourceYear=2025))
 assert len(hn['rows'])==385 and len(cq['rows'])==124
 return rs,ex,{'HN-LIVE':{'originalRows':385,'note':'动态表年度未注明；地方招生代码不冒充国标学校码'},'CQ-LIVE':{'originalRows':124,'technicalExcluded':len(ex),'includedRows':124-len(ex),'searchIndexRows':122,'note':'已以云端浏览器实时124行取代不完整的搜索索引122行'}}

def parse_jiaxing():
 path=ROOT/'data/national-directory/evidence/jiaxing_2024_pdf_web_extracted.txt';s=path.read_text();lines=[]
 for li,line in enumerate(s.splitlines(),1):
  m=re.match(r'L(\d+):\s?(.*)',line)
  if m:lines.append((int(m[1]),m[2]))
 groups=[];current=None
 for li,line in lines:
  m=re.match(r'(\d+)\s*\|\s*(.*)',line)
  if m:current=[int(m[1]),li,m[2]];groups.append(current)
  elif current:current[2]+=' '+line.strip()
 rs=[];ex=[]
 for ordinal,li,line in groups:
  cols=[c.strip() for c in line.split('|')];assert len(cols)==4,(ordinal,cols)
  name,own,auth,addr=cols
  if re.search(r'技师学院',name) and not re.search(r'学校|中等专业',re.sub(r'技师学院','',name)):
   ex.append({'name':clean(name),'sourceId':'ZJ-JX-2024','sourceLocator':f'原PDF第1页表序号{ordinal}；原文缓存L{li}','reason':'无双挂牌中职校名的纯技师单位单列排除'});continue
  rs.append(record(name,'浙江省','中职','ZJ-JX-2024',f'原PDF第1页表序号{ordinal}；原文缓存L{li}',city='嘉兴市',ownership=own,authority=auth,address=addr,sourceOrdinal=str(ordinal),sourceYear=2024,unitType='中职与技工双挂牌单位' if re.search('技师|技工',name) else unit_type(name)))
 assert len(groups)==15,(len(groups),groups)
 return rs,ex,{'originalRows':15,'included':len(rs),'technicalExcluded':len(ex),'scope':'嘉兴市2024年度名单，仅浙江部分覆盖；原PDF未下载成功，保留官方PDF逐校文本缓存证据'}

if __name__=='__main__':
 gs,ga=parse_gs();live,le,la=parse_live();zj,ze,za=parse_jiaxing()
 (OUT/'additional_e_records.json').write_text(json.dumps(gs+live+zj,ensure_ascii=False,indent=2))
 (OUT/'additional_e_audit.json').write_text(json.dumps({'GS-2025':ga,**la,'ZJ-JX-2024':za},ensure_ascii=False,indent=2))
 (OUT/'additional_e_exclusions.json').write_text(json.dumps(le+ze,ensure_ascii=False,indent=2))
 print('GS',len(gs),'live',len(live),'ZJ',len(zj),'excluded',len(le+ze))
