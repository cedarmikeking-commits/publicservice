#!/usr/bin/env python3
"""Convert officially sourced school directories to auditable offline assets.

Input: one or more CSV / XLSX files (XLS requires optional xlrd dependency).
Do not classify ordinary bachelor's universities as vocational bachelor's by default.
Usage:
    python tools/import_school_directory.py --output src/apps/assets/national-school-catalog.js \
      --source '教育主管部门名单 URL' --date 2026-06-17 --level 高职 files/高职目录.xlsx

Columns: 学校名称 (or 院校名称), 省份/所在省份, 办学层次, 学校标识码, 所在地.
For an official sheet which only says 本科, vocational本科 must be explicitly flagged or
provided through --level 职教本科 from a verified vocational本科-specific list.
Records with unknown province/level are exported to rejected CSV instead of guessed.
"""
import argparse,csv,json,re,sys,datetime
from pathlib import Path
PROVINCES=['北京市','天津市','河北省','山西省','内蒙古自治区','辽宁省','吉林省','黑龙江省','上海市','江苏省','浙江省','安徽省','福建省','江西省','山东省','河南省','湖北省','湖南省','广东省','广西壮族自治区','海南省','重庆市','四川省','贵州省','云南省','西藏自治区','陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区']
ALIASES={re.sub(r'(省|市|壮族自治区|回族自治区|维吾尔自治区|自治区)$','',p):p for p in PROVINCES}
COLS={
 'name':['院校名称','学校名称','学校全称','名称','name'],
 'province':['省份','所在省份','省区市','地区','所在地区','province'],
 'level':['办学层次','院校层次','学校类型','类别','层次','level'],
 'code':['学校标识码','学校代码','标识码','school_code'],
 'city':['所在地','所在城市','城市','city']}
def norm(s):return re.sub(r'\s+','',str(s or ''))
def resolve(row,keys):
 for key in keys:
  if norm(key) in row and norm(row[norm(key)]):return str(row[norm(key)]).strip()
 return ''
def province(s):
 s=norm(s)
 if s in PROVINCES:return s
 if s in ALIASES:return ALIASES[s]
 for p in PROVINCES:
  if s.startswith(p):return p
 return ''
def level(s,default):
 s=norm(s)
 if s in ['职业本科','职教本科','本科层次职业学校','职业本科院校']:return '职教本科'
 if s in ['高职','专科','高职(专科)','高职（专科）','高职专科']:return '高职'
 if s in ['中职','中等职业学校','中等职业','职业高中','中等专业学校','技工学校']:return '中职'
 # Plain "本科" cannot be equated with vocational bachelor.
 if s in ['','普通本科','本科'] and default in ['职教本科','高职','中职']:
  return default if s!='普通本科' else ''
 return ''
def rows(path):
 if path.suffix.lower()=='.csv':
  for enc in ('utf-8-sig','gb18030'):
   try:
    with path.open(encoding=enc,newline='') as f:
     yield from csv.reader(f)
    return
   except UnicodeDecodeError:continue
  raise ValueError('无法解码 CSV: '+str(path))
 elif path.suffix.lower()=='.xlsx':
  from openpyxl import load_workbook
  wb=load_workbook(path,read_only=True,data_only=True)
  for ws in wb:
   for row in ws.iter_rows(values_only=True):yield list(row)
 elif path.suffix.lower()=='.xls':
  try:import xlrd
  except ImportError:raise RuntimeError('读取旧版 XLS 需要 pip install xlrd；也可在 Excel 中另存为 XLSX')
  wb=xlrd.open_workbook(str(path))
  for ws in wb.sheets():
   for j in range(ws.nrows):yield ws.row_values(j)
 else:raise ValueError('只支持 CSV、XLSX、XLS')
def parse_file(path,default,source,date):
 out=[];reject=[];headers=None;lastprovince='';name_i=-1
 for line_no,raw in enumerate(rows(path),1):
  values=[str(c or '').strip() for c in raw]
  if not any(values):continue
  row_norm=[norm(v) for v in values]
  if any(v in COLS['name'] for v in row_norm):
   headers=row_norm;continue
  if len([v for v in values if v])==1:
   p=province(values[0])
   if p:lastprovince=p
   continue
  if not headers:continue
  obj={headers[i]:values[i] if i<len(values) else '' for i in range(len(headers))}
  name=resolve(obj,COLS['name'])
  if not name or name in ['总计','合计']:continue
  p=province(resolve(obj,COLS['province'])) or lastprovince
  lev=level(resolve(obj,COLS['level']),default)
  if not p or not lev:
   reject.append({'file':str(path),'line':line_no,'name':name,'province':resolve(obj,COLS['province']),'level':resolve(obj,COLS['level']),'reason':'缺少省份或明确职业办学层次'})
   continue
  out.append({'name':name,'province':p,'level':lev,'code':resolve(obj,COLS['code']),'city':resolve(obj,COLS['city']),'source':source,'sourceDate':date})
 return out,reject
def main():
 ap=argparse.ArgumentParser()
 ap.add_argument('files',nargs='+',type=Path)
 ap.add_argument('--level',choices=['职教本科','高职','中职'],help='仅用于来源已经明确限定办学层次的名单，不能用于普通本科名单')
 ap.add_argument('--source',required=True,help='具体省教育主管部门或教育部发布的名单 URL / 标题')
 ap.add_argument('--date',required=True,help='名单发布时间，如 2026-06-17')
 ap.add_argument('--output',type=Path,default=Path('src/apps/assets/national-school-catalog.js'))
 args=ap.parse_args()
 collected=[];rejected=[]
 for file in args.files:
  a,b=parse_file(file,args.level,args.source,args.date);collected+=a;rejected+=b
 seen={};conflicts=[]
 for x in collected:
  k=(norm(x['name']),x['province'])
  if k in seen and seen[k]['level']!=x['level']:
   conflicts.append({'name':x['name'],'province':x['province'],'levels':[seen[k]['level'],x['level']]});continue
  seen[k]=x
 data=list(seen.values());data.sort(key=lambda x:(PROVINCES.index(x['province']),x['level'],x['name']))
 meta={'version':args.date,'verified':False,'source':args.source,'count':len(data),'rejected':len(rejected),'conflicts':len(conflicts),'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 args.output.parent.mkdir(parents=True,exist_ok=True)
 args.output.write_text('window.MVERI_NATIONAL_CATALOG_DATA='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\nwindow.MVERI_NATIONAL_CATALOG_META='+json.dumps(meta,ensure_ascii=False)+';\n',encoding='utf-8')
 report=args.output.with_suffix('.import-report.json')
 report.write_text(json.dumps({'summary':meta,'unclassified':rejected,'conflicts':conflicts},ensure_ascii=False,indent=2),encoding='utf-8')
 print(f'已转换 {len(data)} 所，未识别 {len(rejected)}，归类冲突 {len(conflicts)}。来源核验仍需人工确认。')
 print('数据:',args.output,'报告:',report)
 if conflicts:sys.exit(2)
if __name__=='__main__':main()
