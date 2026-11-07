#!/usr/bin/env python3
"""Collect published province school listings to a source-attributed *partial*
Chinese vocational-school directory. Run in an Internet-connected environment:
 python tools/collect_public_school_directory.py

The upstream province pages cite ministry data for colleges and regional
education office lists for secondary vocational schools. These secondary
lists are NOT a nationwide, homogeneous official ministry master dataset;
some provinces include technical schools and sports/special education.

Keep institutional authorization/seat data separate. Do not infer actual
vocational bachelor's classification from generic undergraduate degrees.
"""
from __future__ import annotations
from html.parser import HTMLParser
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from pathlib import Path
import re, json, time, argparse, datetime, csv, sys

PROVINCES={
'shandong':'山东省','henan':'河南省','guangdong':'广东省','sichuan':'四川省',
'jiangxi':'江西省','shaanxi':'陕西省','shanxi':'山西省','guangxi':'广西壮族自治区',
'anhui':'安徽省','yunnan':'云南省','hubei':'湖北省','guizhou':'贵州省',
'liaoning':'辽宁省','fujian':'福建省','jiangsu':'江苏省','chongqing':'重庆市',
'hebei':'河北省','beijing':'北京市','xinjiang':'新疆维吾尔自治区','hunan':'湖南省',
'zhejiang':'浙江省','heilongjiang':'黑龙江省','jilin':'吉林省','hainan':'海南省',
'shanghai':'上海市','ningxia':'宁夏回族自治区','tianjin':'天津市',
'neimenggu':'内蒙古自治区','gansu':'甘肃省','qinghai':'青海省','xizang':'西藏自治区'}
# Normal school-name pattern only provides candidates for vocational bachelor's
# degrees. The verified 2026 vocational bachelor's list must be cross-checked.
BACHELOR_CANDIDATE=re.compile(r'(职业技术大学|职业大学|职业科技大学|职业师范大学)')

class SchoolTableParser(HTMLParser):
 def __init__(self):
  super().__init__();self.section=None;self.heading=False;self.inrow=False
  self.intd=False;self.inanchor=False;self.cell='';self.cells=[];self.rows=[]
  self.tmpheading=''
 def handle_starttag(self,tag,attrs):
  if tag=='h2':self.heading=True;self.tmpheading=''
  if tag=='tr':self.inrow=True;self.cells=[]
  if tag=='td' and self.inrow:self.intd=True;self.cell=''
 def handle_data(self,data):
  if self.heading:self.tmpheading+=data
  if self.intd:self.cell+=data
 def handle_endtag(self,tag):
  if tag=='h2' and self.heading:
   heading=re.sub(r'\s+','',self.tmpheading)
   self.section='本科' if heading.startswith('本科院校') else ('高职' if heading.startswith('专科院校') else ('中职' if heading.startswith('中职学校') else None))
   self.heading=False
  if tag=='td' and self.intd:
   self.cells.append(self.cell.strip());self.intd=False
  if tag=='tr' and self.inrow:
   if self.section and self.cells and self.cells[0] not in ('学校名称',''):
    self.rows.append((self.section,*self.cells))
   self.inrow=False

def fetch(url,retries=3):
 err=None
 for i in range(retries):
  try:
   req=Request(url,headers={'User-Agent':'MVERI-directory-research/1.0 (public data extraction)'})
   with urlopen(req,timeout=30) as resp:return resp.read().decode('utf-8','replace')
  except Exception as e:err=e;time.sleep(min(2**i,5))
 raise RuntimeError(f'{url}: {err}')

def main():
 p=argparse.ArgumentParser()
 p.add_argument('--output',default='src/apps/assets/national-school-catalog.js')
 p.add_argument('--data-dir',default='data/national-directory')
 p.add_argument('--province',action='append',help='Optional province slug, repeatable')
 p.add_argument('--sleep',type=float,default=.35)
 args=p.parse_args()
 d=Path(args.data_dir);d.mkdir(parents=True,exist_ok=True)
 day=datetime.date.today().isoformat()
 schools={};errors=[];counts={k:{'高职':0,'中职':0,'职教本科候选':0} for k in PROVINCES.values()}
 provinces=args.province or list(PROVINCES)
 for slug in provinces:
  if slug not in PROVINCES:errors.append({'province':slug,'error':'unknown slug'});continue
  province=PROVINCES[slug];url=f'https://qunxueyuan.com/school/{slug}/'
  try:
   parser=SchoolTableParser();parser.feed(fetch(url))
   if not parser.rows:raise RuntimeError('No school table rows; inspect HTML structure')
   seen_in_page=set()
   for item in parser.rows:
    sec,name,*details=item
    name=name.strip();name=re.sub(r'\s+','',name)
    if len(name)<3 or (province,name) in seen_in_page:continue
    seen_in_page.add((province,name))
    if sec=='本科':
     if not BACHELOR_CANDIDATE.search(name):continue
     level='职教本科';status='待官方职业本科名单复核';counts[province]['职教本科候选']+=1
    else:
     level=sec;status='第三方整理，待原公告逐项复核';counts[province][level]+=1
    key=(province,name)
    schools[key]={'name':name,'province':province,'level':level,
      'city':details[0] if details else '', 'code':'',
      'supervisor':details[1] if len(details)>1 else '',
      'ownership':details[2] if len(details)>2 else '',
      'source':url,'sourceDate':day,'verified':False,'verificationStatus':status}
   print(province,'parsed',len(parser.rows),'vocational',sum(counts[province].values()),flush=True)
  except Exception as e:
   errors.append({'province':province,'url':url,'error':str(e)});print('FAIL',province,e,file=sys.stderr,flush=True)
  time.sleep(max(args.sleep,0))
 records=sorted(schools.values(),key=lambda r:(r['level'],r['province'],r['name']))
 coverage={x['level']:sum(y['level']==x['level'] for y in records) for x in records}
 meta={'dataStatus':'unverified-compiled-partial','fullNationwide':False,
  'source':'省份分类目录（第三方整理；逐校需核验省级原公告）',
  'date':day,'provincePagesAttempted':len(provinces),'failedPages':errors,
  'provinceCounts':counts,'count':len(records),'countsByLevel':coverage,
  'limitations':['中职有省份缺失或来源混入技工学校','职业本科为名称筛选候选，非官方核定名单',
   '高职来源应与教育部2026年6月名单核对','已收录条数不等于学校法定数量']}
 target=Path(args.output);target.parent.mkdir(parents=True,exist_ok=True)
 # App consumes this window-bound manifest before area/app.js.
 target.write_text('window.MVERI_NATIONAL_CATALOG_DATA='+json.dumps(records,ensure_ascii=False,separators=(',',':'))+';\nwindow.MVERI_NATIONAL_CATALOG_META='+json.dumps(meta,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
 (d/'schools.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
 (d/'coverage-report.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf-8')
 with (d/'schools.csv').open('w',encoding='utf-8-sig',newline='') as f:
  w=csv.DictWriter(f,fieldnames=['name','province','level','city','code','supervisor','ownership','source','sourceDate','verificationStatus']);w.writeheader();w.writerows([{k:v.get(k,'') for k in w.fieldnames} for v in records])
 print('Generated',len(records),'records and coverage report, NOT an official full nationwide list')
 print('Output:',target)
 if errors:print('Failed province pages:',len(errors),'See',d/'coverage-report.json')
 return 2 if errors else 0
if __name__=='__main__':sys.exit(main())
