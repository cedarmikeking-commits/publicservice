#!/usr/bin/env python3
"""Rebuild Guizhou's 2026 official educational-authority mid-vocational list.
The source has one school with seven conflicting institution-code values.
Keep a single school, preserve all source code variants and leave code blank.
"""
import json,re,collections
import openpyxl
from parse_initial import clean,record,unit_type,ROOT,COLLECTED,OUT

def parse_gz():
 w=openpyxl.load_workbook(COLLECTED/'GZ-2026.xlsx',data_only=True)
 groups={};sheets=[];pairset=set();totalPrograms=0;conflicts=[]
 for sh in w:
  sheetNames=set();programs=0
  expected=int(re.search(r'(\d+)$',sh.title).group(1))
  city=re.sub(r'\d+$','',sh.title)
  for ri,c in enumerate(sh.values,1):
   if not isinstance(c[0],(int,float)):continue
   name,code,ownership,authority,address=[clean(x) for x in c[1:6]]
   assert name and code
   # Same school identity also corroborated by authority and address, not merely
   # by an official province-wide numeric total.
   key=(name,authority)
   sheetNames.add(key);pairset.add((name,code));totalPrograms+=1;programs+=1
   loc=f'工作表“{sh.title}”第{ri}行；专业序号{clean(c[0])}'
   if key not in groups:
    r=record(c[1],'贵州省','中职','GZ-2026',loc,code=code,city='' if city=='省属' else city,ownership=ownership,authority=authority,address=address,unitType=unit_type(name,code),website=clean(c[15]),sourceScope=city,sourceRows=[],sourceProgramRows=0,originalCodes=[],originalAddresses=[])
    groups[key]=r
   r=groups[key];assert r['ownership']==ownership
   r['sourceRows'].append(loc);r['sourceProgramRows']+=1
   if code not in r['originalCodes']:r['originalCodes'].append(code)
   if address not in r['originalAddresses']:r['originalAddresses'].append(address)
  assert len(sheetNames)==expected,(sh.title,len(sheetNames),expected)
  sheets.append({'sheet':sh.title,'expectedSchoolsFromSourceTitle':expected,'parsedSchoolIdentities':len(sheetNames),'programRows':programs})
 rs=list(groups.values())
 for r in rs:
  if len(r['originalAddresses'])>1:
   r['address']='';r['addressStatus']='multiple_source_values_unresolved';r['addressIssue']='原件同校多个地址值（部分逐次递增），未确认正确地址，留空并保留originalAddresses'
  if len(r['originalCodes'])>1:
   conflicts.append({'name':r['name'],'sourceCodes':r['originalCodes'],'authority':r['authority'],'address':r['address'],'sourceRows':r['sourceRows'],'resolution':'同省同名、同主管合并成一条学校身份，机构码及地址多值逐项保留；机构码冲突未解决，code留空而非选择或编造'})
   r['code']='';r['codeStatus']='source_code_conflict';r['codeFormatIssue']='原件同一学校出现7个逐次递增机构码，无法确认哪一个正确；code留空，originalCodes保留全部原值'
  elif not re.fullmatch(r'(?:\d{10}|[0-9A-Z]{18})',r['code']):
   r['codeStatus']='source_code_format_unusual';r['codeFormatIssue']='原件代码长度或字符格式异常，逐字保留，不改写'
  else:r['codeStatus']='as_published'
  r['identifierType']='统一社会信用代码（原件“机构代码”列）' if len(r['code'])==18 else '学校机构代码（原文）'
 assert len(rs)==131,len(rs)
 assert len({r['name'] for r in rs})==131
 assert len(pairset)==137,len(pairset)
 assert len(conflicts)==1
 audit={'schoolCount':len(rs),'programRows':totalPrograms,'sourceNameCodePairsBeforeSchoolIdentityResolution':len(pairset),'schoolIdentityKey':'规范校名+主管部门；同一学校各专业重复记录合并，机构码或地址冲突不虚增学校','codeConflicts':conflicts,'sheets':sheets,'sourceScope':'教育厅官方附件1，未导入另一个技工院校附件','sourceReleaseDate':'2026-06-10','sourceUrl':'https://jyt.guizhou.gov.cn/zwgk/tzgg/202606/t20260610_90504460.html','attachmentUrl':'https://jyt.guizhou.gov.cn/zwgk/tzgg/202606/P020260611509445922538.xlsx','addressConflicts':[{'name':r['name'],'sourceAddresses':r['originalAddresses'],'resolution':'不擅选正确地址，address留空，保留全部原值'} for r in rs if len(r['originalAddresses'])>1],'nonstandardSingleCodes':[{'name':r['name'],'code':r['code'],'sourceLocator':r['sourceLocator']} for r in rs if r.get('codeStatus')=='source_code_format_unusual']}
 return rs,audit
if __name__=='__main__':
 rs,audit=parse_gz()
 (OUT/'additional_c_records.json').write_text(json.dumps(rs,ensure_ascii=False,indent=2))
 (OUT/'additional_c_audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
 print(json.dumps(audit,ensure_ascii=False,indent=2))
