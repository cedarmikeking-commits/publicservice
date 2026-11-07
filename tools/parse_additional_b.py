#!/usr/bin/env python3
"""Parse official Guangdong 21-city 2026 PDF and Yunnan 2025 master list.
No synthetic school names, inferred school codes, or private contact details.
"""
import json,re,collections
import openpyxl,pdfplumber
from parse_initial import clean,record,unit_type,ROOT,COLLECTED,OUT

def parse_gd_c():
 rs=[];city='';cityurl='';issues=[];pages=[]
 with pdfplumber.open(COLLECTED/'GD-C-2026.pdf') as pdf:
  for pi,p in enumerate(pdf.pages,1):
   ts=p.extract_tables();assert len(ts)==1,(pi,len(ts))
   pageN=0
   for ti,t in enumerate(ts,1):
    for ri,c in enumerate(t,1):
     first=clean(c[0])
     if first and re.search(r'市[（(]',first):
      m=re.fullmatch(r'(.+市)[（(](https?://.+)[）)]',first);assert m,(pi,first)
      city,cityurl=m.groups();continue
     # One cell at p9 last row lacks its ordinal in PDF table extraction.
     # Include a genuine named/code row irrespective of missing ordinal.
     name,code=clean(c[1]),clean(c[2])
     if name=='学校名称':continue
     if not name and not code:continue
     if not code and not first:raise ValueError((pi,ri,c))
     assert len(c)==11
     assert city
     remark=clean(c[10]);typ=unit_type(name,code)
     if typ!='特殊教育中职招生单位' and re.search(r'附设中职班|中职部|职中部',name+remark):typ='附设中职部'
     address=re.sub(r'第\s*\d+\s*页，共\s*\d+\s*页','',c[5] or '')
     r=record(c[1],'广东省','中职','GD-C-2026',f'地市附件第{pi}页第{ti}表第{ri}行；{city}'+(f'序号{first}' if first else '序号单元未提取'),code=code,city=city,authority=clean(c[4]),ownership=clean(c[3]),unitType=typ,address=clean(address),website=clean(c[6]),sourceOrdinal=first,remarks=remark,sourceScope='地市',municipalSourceUrl=cityurl,annualInspection=clean(c[9]))
     if not re.fullmatch(r'\d{10}',code):r['codeFormatIssue']='原件机构代码为非10位内容，原样保留，不编造机构码'
     if not first:issues.append({'name':name,'code':code,'sourceLocator':r['sourceLocator'],'issue':'PDF表格序号单元未提取；学校名、机构码及正文序号5完整，按真实学校行保留，防止漏校'})
     rs.append(r);pageN+=1
   pages.append({'page':pi,'schoolRows':pageN})
 assert len(rs)==332,len(rs)
 assert len({r['name'] for r in rs})==len(rs)
 assert len({r['city'] for r in rs})==21
 return rs,{'count':len(rs),'cityCount':21,'byCity':dict(collections.Counter(r['city'] for r in rs)),'pageRows':pages,'extractionIssues':issues,'annualInspectionNote':'原文名单含上年年检不合格学校，保留原名单及annualInspection字段，不能把列入名单自动等同于当前入驻授权或质量结论'}

def parse_yn():
 w=openpyxl.load_workbook(COLLECTED/'YN-2025.xlsx',data_only=True);assert w.sheetnames==['总表']
 sh=w.active;mode='';rs=[]
 for i,row in enumerate(sh.values,1):
  if isinstance(row[0],str) and row[0].startswith('一、普通'):mode='普通';continue
  if isinstance(row[0],str) and row[0].startswith('二、成人'):mode='成人';continue
  if not isinstance(row[0],(int,float)):continue
  assert mode
  name,code,schooltype,city,sponsor=[clean(c) for c in row[1:6]]
  assert name and re.fullmatch(r'\d{10}',code),(i,row)
  typ=unit_type(name,code)
  r=record(row[1],'云南省','中职','YN-2025',f'工作表“{sh.title}”第{i}行；{mode}中等职业学校序号{clean(row[0])}',code=code,city=city,authority='',ownership='民办' if sponsor=='民办' else '',unitType=typ,sourceOrdinal=clean(row[0]),schoolSubtype=schooltype,educationMode=mode,schoolSponsorType=sponsor,sourceAsOf='2025-09-01')
  rs.append(r)
 assert len(rs)==201,len(rs)
 assert collections.Counter(r['educationMode'] for r in rs)=={'普通':193,'成人':8}
 assert len({r['code'] for r in rs})==201
 return rs,{'count':201,'ordinary':193,'adult':8,'sourceAsOf':'2025-09-01','sourceReleaseDate':'2026-09-21','schoolTypes':dict(collections.Counter(r['schoolSubtype'] for r in rs)),'ownershipNote':'原文列举办者类型，保留schoolSponsorType；未把县级/地级教育部门自动转写公办，authority空值不推断'}

if __name__=='__main__':
 gd,gda=parse_gd_c();yn,yna=parse_yn();rs=gd+yn
 (OUT/'additional_b_records.json').write_text(json.dumps(rs,ensure_ascii=False,indent=2))
 prior=json.loads((OUT/'additional_a_records.json').read_text());gdall=[r for r in prior if r['sourceId']=='GD-S-2026']+gd
 names=collections.defaultdict(list);codes=collections.defaultdict(list)
 for r in gdall:names[r['name']].append(r);codes[r['code']].append(r)
 duplicates=[{'name':n,'sources':[r['sourceId'] for r in rr]} for n,rr in names.items() if len(rr)>1]
 codeconflicts=[{'code':c,'names':[r['name'] for r in rr]} for c,rr in codes.items() if len(rr)>1]
 audit={'counts':dict(collections.Counter(r['sourceId'] for r in rs)),'total':len(rs),'GD_C':gda,'YN':yna,'GD_combined':{'provinceAffiliated':15,'cityAffiliated':332,'totalRows':len(gdall),'uniqueNames':len(names),'uniqueCodes':len(codes),'duplicateNames':duplicates,'duplicateCodes':codeconflicts}}
 (OUT/'additional_b_audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
 print(json.dumps(audit,ensure_ascii=False,indent=2))
