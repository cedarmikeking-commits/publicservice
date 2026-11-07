#!/usr/bin/env python3
"""Rebuild AH all-province subject table and GD province-affiliated list."""
from pathlib import Path
import json,collections,re
import xlrd,pdfplumber
from parse_initial import clean,record,unit_type,ROOT,COLLECTED,OUT

def parse_ah():
 sh=xlrd.open_workbook(COLLECTED/'AH-2026.xls').sheet_by_index(0)
 groups={}
 for i in range(2,sh.nrows):
  c=sh.row_values(i);name=clean(c[6]);city=clean(c[7]);assert name
  key=(name,city)
  if key not in groups:
   r=record(c[6],'安徽省','中职','AH-2026',f'工作表“{sh.name}”第{i+1}行起；专业点表学校名去重',city=city,authority=clean(c[9]),ownership=clean(c[8]),unitType=unit_type(name),schoolSponsorType=clean(c[10]),sourceRows=[],sourceOrdinal=clean(c[0]),remarks=clean(c[11]))
   groups[key]=r
  r=groups[key];r['sourceRows'].append(i+1)
  assert r['authority']==clean(c[9]) and r['ownership']==clean(c[8]),(name,i)
 for r in groups.values():r['sourceProgramRows']=len(r['sourceRows']);r['sourceLocator']+=f"；原表专业记录{len(r['sourceRows'])}行"
 assert sum(r['sourceProgramRows'] for r in groups.values())==2538
 assert len(groups)==185,len(groups)
 return list(groups.values())

def parse_gd_s():
 rs=[]
 with pdfplumber.open(COLLECTED/'GD-S-2026.pdf') as pdf:
  for pi,p in enumerate(pdf.pages,1):
   tables=p.extract_tables();assert len(tables)==1
   for ri,c in enumerate(tables[0][1:],2):
    assert re.fullmatch(r'\d+',clean(c[0]))
    name,code,rem=clean(c[1]),clean(c[2]),clean(c[9])
    r=record(c[1],'广东省','中职','GD-S-2026',f'省属附件第{pi}页表第{ri}行；序号{clean(c[0])}',code=code,authority=clean(c[4]),ownership=clean(c[3]),unitType='附设中职部' if '附设中职班' in rem else unit_type(name,code),address=clean(c[5]),website=clean(c[6]),sourceOrdinal=clean(c[0]),remarks=rem,sourceScope='省属')
    if r['unitType']=='附设中职部':r['educationScope']='原件备注附设中职班，学校本名原样保留，不代表新增独立院校'
    rs.append(r)
 assert len(rs)==15,len(rs)
 return rs

def parse_sh():
 rs=[];excluded=[];dup=[]
 with pdfplumber.open(COLLECTED/'SH-2026.pdf') as pdf:
  for pi,page in enumerate(pdf.pages,1):
   # Official PDF's rotated watermark is 76pt; school names are 12pt.
   p=page.filter(lambda o:o['object_type']!='char' or o.get('size',0)<30)
   for ti,t in enumerate(p.extract_tables(),1):
    for ri,c in enumerate(t,1):
     ordinal=clean(c[0])
     if not re.fullmatch(r'\d+',ordinal):continue
     name=clean(c[1])
     r=record(c[1],'上海市','中职','SH-2026',f'第{pi}页第{ti}表第{ri}行；正文序号{ordinal}',city='上海市',sourceOrdinal=ordinal,unitType=unit_type(name))
     if '技工学校' in name:
      r['excludedReason']='原件列入上海中职招生表的技工学校；本次教育部门中职口径分列排除，不冒充独立中职学校';excluded.append(r)
     else:rs.append(r)
   if pi==len(pdf.pages):
    text=clean(p.extract_text());part=text.split('注：1.',1)[1].split('7所学校',1)[0]
    names=part.split('、');assert len(names)==7
    for ai,name in enumerate(names,1):
     r=record(name,'上海市','中职','SH-2026',f'第{pi}页附注1，第{ai}个单独艺体类中职学校名',city='上海市',unitType=unit_type(name),sourceOrdinal='附注1-'+str(ai))
     old=next((x for x in rs if x['name']==name),None)
     if old:
      old['additionalSourceLocators']=[r['sourceLocator']];dup.append({'name':name,'kept':old['sourceLocator'],'duplicate':r['sourceLocator']})
     else:rs.append(r)
 assert len(rs)==61,len(rs)
 assert len(excluded)==2
 assert len({r['name'] for r in rs})==len(rs)
 return rs,excluded,dup

def parse_xj():
 groups={};programRows=0;tableCounts=[];allMoeNames={r['name'] for r in __import__('parse_initial').parse_moe()}
 with pdfplumber.open(COLLECTED/'XJ-2026.pdf') as pdf:
  for pi,p in enumerate(pdf.pages,1):
   tables=p.extract_tables();assert len(tables)==1,(pi,len(tables))
   tableCounts.append({'page':pi,'tableCount':len(tables),'rows':len(tables[0])-1})
   for ti,t in enumerate(tables,1):
    for ri,c in enumerate(t,1):
     if not c[0] or c[0]=='学校名称':continue
     assert len(c)==10,(pi,ri,len(c))
     name,code=clean(c[0]),clean(c[1]);key=(name,code);programRows+=1
     assert name and code,(pi,ri)
     loc=f'第{pi}页第{ti}表第{ri}行'
     if key not in groups:
      r=record(c[0],'新疆维吾尔自治区','中职','XJ-2026',loc,code=code,authority=clean(c[3]),ownership=clean(c[2]),unitType='附设中职部' if name in allMoeNames else unit_type(name,code),address=clean(c[4]),sourceRows=[],sourceProgramRows=0)
      if not re.fullmatch(r'\d{10}',code):r['codeFormatIssue']='原件机构代码非10位数字（含社会信用代码/地方代码等），逐字保留，不补造'
      if r['unitType']=='附设中职部':r['educationScope']='自治区中职招生资质名单中的高校办学单位，原名保留'
      groups[key]=r
     r=groups[key];r['sourceRows'].append(loc);r['sourceProgramRows']+=1
     assert r['authority']==clean(c[3]) and r['ownership']==clean(c[2]),(name,pi,ri)
 assert len(groups)==91,len(groups)
 assert programRows==858,programRows
 assert len({r['name'] for r in groups.values()})==91
 return list(groups.values()),{'programRows':programRows,'uniqueSchoolCodePairs':len(groups),'pageCount':len(pdf.pages),'pageTables':tableCounts,'scopeNote':'新疆自治区教育厅发布名录，未对新疆生产建设兵团另行名录作完整核对；不宣称含兵团全疆全量'}

if __name__=='__main__':
 sh,excluded,dup=parse_sh();xj,xjaudit=parse_xj()
 rs=parse_ah()+parse_gd_s()+sh+xj
 (OUT/'additional_a_records.json').write_text(json.dumps(rs,ensure_ascii=False,indent=2))
 (OUT/'additional_a_exclusions.json').write_text(json.dumps(excluded,ensure_ascii=False,indent=2))
 audit={'counts':dict(collections.Counter(r['sourceId'] for r in rs)),'total':len(rs),'AH':{'programRows':2538,'uniqueSchoolNames':185,'scope':'全省具备学历教育办学资质和招生资格专业名单，按市区与学校名去重','schoolCode':'原表没有机构代码，全部留空；专业代码不误当机构代码'},'GD_S':{'uniqueSchoolNames':15,'scope':'省属15条，不能单独作为广东全省覆盖','containsHigherEducationUnitsWithSecondaryClasses':sum(r['unitType']=='附设中职部' for r in rs if r['sourceId']=='GD-S-2026')},'SH':{'mainList':57,'appendixList':7,'withinSourceDuplicates':dup,'excludedTechnicalSchools':2,'retainedUniqueRecords':61,'watermarkFilter':'排除PDF中字号>=30的76pt水印，保留12pt正文校名；不根据污染后的文字手工猜名'},'XJ':xjaudit}
 (OUT/'additional_a_audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in audit.items() if k!='XJ'},ensure_ascii=False,indent=2));print('XJ', {k:v for k,v in xjaudit.items() if k!='pageTables'})
