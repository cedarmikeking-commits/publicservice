#!/usr/bin/env python3
"""Offline verified-directory build. Only retained source-exact inputs; no network or synthesis."""
from pathlib import Path
import json,re,hashlib,collections,unicodedata,csv,html
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'data/national-directory';I=D/'intermediate'
PROVINCES=['北京市','天津市','河北省','山西省','内蒙古自治区','辽宁省','吉林省','黑龙江省','上海市','江苏省','浙江省','安徽省','福建省','江西省','山东省','河南省','湖北省','湖南省','广东省','广西壮族自治区','海南省','重庆市','四川省','贵州省','云南省','西藏自治区','陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区']
LEVELS=['职教本科','高职','中职'];DATE='2026-11-02'
def dump(path,obj):path.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def norm(s):return re.sub(r'\s+','',unicodedata.normalize('NFKC',str(s or '')))
sources=json.loads((D/'sources.json').read_text())['sources'];srcs={s['id']:s for s in sources}
inputs=['initial_records','additional_a_records','additional_b_records','additional_c_records','additional_d_records','additional_e_records','north_html_records','east_html_records','xizang_records']
raw=[]
for filename in inputs:
 rows=json.loads((I/(filename+'.json')).read_text());assert isinstance(rows,list),filename
 for row in rows:
  r=dict(row)
  if filename=='xizang_records':r['sourceId']=next(s['id'] for s in sources if s['id'].startswith('XZ-') and s['pageUrl']==r['sourceUrl'])
  r['inputFile']=filename+'.json';raw.append(r)
merged={};merge_log=[];conflicts=[]
for r in raw:
 assert r.get('sourceId') in srcs,r
 src=srcs[r['sourceId']];assert r['province'] in PROVINCES and r['level'] in LEVELS,r
 r['name']=re.sub(r'\s+','',r['name']);assert len(r['name'])>=4,r
 r['originalName']=r.get('originalName') or r['name'];r['code']=str(r.get('code') or '').strip()
 r['sourceYear']=r.get('sourceYear',src['dataYear']);r['sourceUrl']=src['pageUrl'];r['verified']=True;r['verifiedOn']=DATE
 for k in ['sourceRef','recordId','id','liveFetchStatus']:r.pop(k,None)
 r['unitType']=r.get('unitType') or ('学校（独立性未核）' if r['level']=='中职' else '高等学校')
 if r['level']=='中职' and r['unitType']=='独立学校':r['unitType']='中职学校'
 r['independentLegalEntityVerified']=r['level']!='中职'
 if r['sourceId']=='GS-2025' and '兰州现代职业学院' in r['name']:r['unitType']='附设中职办学单位'
 campus=None
 if r['sourceId']=='GS-2025' and r['name'].startswith('会宁职业中等专业学校') and '校区' in r['name']:
  campus=r['originalName'];r['name']='会宁职业中等专业学校';r['unitType']='中职学校';r['campuses']=[campus]
 key=(r['province'],r['level'],'code:'+r['code'] if re.fullmatch(r'\d{10}',r['code']) else 'name:'+norm(r['name']))
 ref={'sourceId':r['sourceId'],'locator':r.get('sourceLocator') or r.get('sourceEvidence') or '原文学校名称列','originalName':r['originalName']}
 if r.get('sourceRows'):ref['rows']=r['sourceRows']
 r['sources']=[ref]
 if key in merged:
  old=merged[key]
  if norm(old['name'])!=norm(r['name']):
   conflicts.append({'key':list(key),'names':[old['name'],r['name']],'sourceIds':[old['sourceId'],r['sourceId']]})
   # Do not silently combine unrelated names sharing a faulty institution code.
   key=(*key,'name:'+norm(r['name']))
  if key in merged:
   old=merged[key];old['sources'].append(ref)
   if campus:old.setdefault('campuses',[]).append(campus)
   merge_log.append({'name':r['name'],'province':r['province'],'level':r['level'],'sourceId':r['sourceId'],'reason':'同省同层次同机构码/规范校名合并'+('；同校区合并' if campus else '')});continue
 r['id']='NC-'+hashlib.sha256('|'.join(key).encode()).hexdigest()[:20]
 merged[key]=r
records=sorted(merged.values(),key=lambda r:(LEVELS.index(r['level']),PROVINCES.index(r['province']),r['name']))
assert len({r['id'] for r in records})==len(records)
by_level=collections.Counter(r['level'] for r in records);by_source=collections.Counter(r['sourceId'] for r in raw)
assert by_level['高职']==1540 and by_level['职教本科']==124,by_level
# Resolve source provenance to every retained original or scoped textual evidence.
for s in sources:
 file=ROOT/s['localFile'];assert hashlib.sha256(file.read_bytes()).hexdigest()==s['sha256'],s['id']
 s['extractedRowsBeforeCrossSourceMerge']=by_source[s['id']]
 s['retainedRecordsReferencingSource']=sum(any(x['sourceId']==s['id'] for x in r['sources']) for r in records)
 for r in records:
  if r['sourceId']==s['id'] and (r.get('codeFormatIssue') or r.get('codeConflict')):
   r['dataQualityNote']=r.get('codeFormatIssue') or '原件机构码冲突，未擅自选定'
# Province-level coverage is a scope statement, never a school-count estimate.
notes={
 '北京市':('source_complete','2026来源提取完整','普通中专27+职业高中46；不含另列技工及未取得的成人中职名录。'),
 '福建省':('source_complete','2026来源提取完整','附件1全部161条逐校信息；含高校中职办学单位，技工另列。'),
 '安徽省':('source_complete','2026来源提取完整','全省原表2538专业点去重185校；未提供学校机构码。'),
 '广东省':('source_complete','2026来源提取完整','省属15+21地市332=347；含附设中职班，保留年检结果。'),
 '贵州省':('source_complete','2026来源提取完整','中职附件131校；机构码与地址冲突原样保留，技工另列。'),
 '四川省':('source_complete','2026来源提取完整','教育部门343校2880专业点；原表经省级媒体转载取得，技工74另列。'),
 '江西省':('source_complete','2026来源提取完整','教育部门189校；采用江西教育传媒原公文附件，人社91另列。'),
 '上海市':('scoped_complete','2026招生名单已提取','正文与艺体附注去重、排除纯技工后61条；未取得成人中职全表。'),
 '云南省':('historical_complete','2025学校名录已提取','2025-09-01时点201校=普通193+成人8；不能等同2026招生资格。'),
 '新疆维吾尔自治区':('partial','自治区名单已提取，兵团待核','40页858专业行去重91个学校单位；未核对兵团另行名录。'),
 '湖南省':('dynamic','动态目录已提取，年度待核','官方实时385行；页面未标名单年度，含附设中职及特殊教育单位。'),
 '重庆市':('historical_complete','2025目录已提取','实时124行，排除28技工后96条；不等同2026招生资格。'),
 '甘肃省':('historical_scoped','2025公文办事名录已提取','政府文件附件145个学校/校区名称，合并同校两校区后144条；非年度招生资格。'),
 '天津市':('partial','仅部分学校核验','政府中职目录与单校公开页20条；未取得全市完整名单。'),
 '内蒙古自治区':('partial','仅部分城市核验','鄂尔多斯5、通辽5；不是全区逐校全表。'),
 '宁夏回族自治区':('partial','仅学校实体核验','从省教育厅毕业学校列核验14所中职实体；非学校招生资格名录。'),
 '江苏省':('partial','仅部分城市核验','常州10、常熟4；不是江苏全省名单。'),
 '湖北省':('partial','仅武汉市属名单核验','2025武汉市属58条，含11个附设中职班；不是全省名单。'),
 '浙江省':('partial','仅嘉兴历史名单核验','2024嘉兴15行中保留13个中职/双挂牌单位、排除2个纯技师单位；非全省。'),
 '西藏自治区':('partial','仅3所学校实体核验','拉萨2所、林芝1所；未取得全区年度逐校招生资格名录。')}
gaps={
 '河北省':'尚未取得可用官方逐校原件，未生成院校记录。','山西省':'尚未取得可用官方逐校原件，未生成院校记录。',
 '辽宁省':'已定位丹东市级原件，本轮尚未完成原件获取与逐校核验。','吉林省':'已定位四平市级原件，本轮尚未完成原件获取与逐校核验。',
 '黑龙江省':'已定位普通中专招生计划，尚未完成省内/省外学校及其他中职类别的逐校核验。',
 '山东省':'已定位2025/2026省级PDF；当前原件连接失败，本轮未取得完整可复核逐校数据。',
 '河南省':'省教育厅页面拒绝当前云端浏览器访问；公示稿与最终名单尚未完成核对。',
 '广西壮族自治区':'已定位历史省级附件，当前连接失败；2026逐校原件未取得。',
 '海南省':'省教育厅公告返回403，未取得可解析原件。',
 '陕西省':'已定位2024全省文件；附件获取未成功，未计入已核验记录。',
 '青海省':'尚未取得可用官方逐校原件，未生成院校记录。'}
coverage=[]
for p in PROVINCES:
 obj={'province':p,'levels':{}}
 for level in LEVELS:
  n=sum(r['province']==p and r['level']==level for r in records)
  if level!='中职':
   status='source_complete';label='2026教育部名单已核验';note='截至2026-06-17的教育部原始逐校名单。' if n else '教育部该时点名单未列本省该层次学校（0条），并非采集缺失。'
  elif p in notes:status,label,note=notes[p]
  else:status,label,note='uncovered','未覆盖',gaps[p]
  obj['levels'][level]={'count':n,'status':status,'statusLabel':label,'note':note,'nationalSchoolCoverageRate':None if level=='中职' else (1 if n else None)}
 coverage.append(obj)
missing=[p for p in PROVINCES if not any(r['level']=='中职' and r['province']==p for r in records)]
summary=f"已核验职教本科124所、高职1540所；中职{by_level['中职']}条学校/办学单位记录，涉及{31-len(missing)}个省区市，尚有{len(missing)}个省份未取得已核验中职逐校数据。"
cov={'schemaVersion':'1.0','verifiedOn':DATE,'nationalComplete':False,'summary':summary,'scope':'中国内地31省区市；不含港澳台','byLevel':dict(by_level),'secondaryProvincePresence':{'covered':31-len(missing),'total':31,'ratio':round((31-len(missing))/31,6),'meaning':'有至少一条已核验中职信息的省份比例，不是全国学校覆盖率'},'nationalSecondarySchoolCoverageRate':None,'denominatorExplanation':'省份来源年份、招生资格/学校名录/办事目录和附设单位口径不同，未取得统一同年度全国分母，不计算全国中职学校覆盖百分比。','uncoveredSecondaryProvinces':missing,'provinces':coverage}
meta={'version':'V72.18 官方逐校名录核验版（中职部分覆盖）','verified':True,'nationalComplete':False,'count':len(records),'verifiedOn':DATE,'coverage':cov,'unitCountNotice':'记录包括附设中职办学单位；不等同独立法人院校数量。'}
dump(D/'schools.json',{'schemaVersion':'1.0','meta':meta,'schools':records});dump(D/'coverage-report.json',cov);dump(D/'sources.json',{'schemaVersion':'1.0','verifiedOn':DATE,'sources':sources})
js='/* Generated from retained official source-exact data. National secondary coverage is PARTIAL. */\nwindow.MVERI_NATIONAL_CATALOG_DATA='+json.dumps(records,ensure_ascii=False,separators=(',',':'))+';\nwindow.MVERI_NATIONAL_CATALOG_META='+json.dumps(meta,ensure_ascii=False,separators=(',',':'))+';\nwindow.MVERI_NATIONAL_CATALOG_SOURCES='+json.dumps(sources,ensure_ascii=False,separators=(',',':'))+';\n'
(ROOT/'src/apps/assets/national-school-catalog.js').write_text(js,encoding='utf-8')
exclusions=[]
for filename in ['additional_a_exclusions.json','additional_d_exclusions.json','additional_e_exclusions.json']:
 exclusions+=json.loads((I/filename).read_text())
dump(D/'cleaning-audit.json',{'inputRows':len(raw),'outputRecords':len(records),'mergedCount':len(merge_log),'merges':merge_log,'institutionCodeConflicts':conflicts,'exclusions':exclusions,'qualityIssueCount':sum(bool(r.get('codeFormatIssue') or len(r.get('originalCodes',[]))>1) for r in records),'policy':['仅规范空白、原文分类和字段，不编造学校、机构码、公办性质或省级数量','去重键含省份与层次；同校高校主体与中职部不跨层次合并','同一学校专业行重复合并；保留源行及异常原码，未解决码冲突不选值','学校名录与授权、账号及席位台账分离，目录构建不写业务存储']})
tree=[{'level':l,'provinces':[{'province':p,'coverage':next(c for c in coverage if c['province']==p)['levels'][l],'schools':[{'id':r['id'],'name':r['name']} for r in records if r['level']==l and r['province']==p]} for p in PROVINCES]} for l in LEVELS];dump(D/'directory-tree.json',tree)
with (D/'schools.csv').open('w',encoding='utf-8-sig',newline='') as f:
 fields=['id','name','province','level','code','city','unitType','sourceYear','sourceId','sourceUrl','sourceLocator'];w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(records)
print(summary);print('records',len(records),'merges',len(merge_log),'code conflicts',len(conflicts),'sources',len(sources));print('uncovered:',','.join(missing))

# Keep the static runtime bundles in sync after every source-data rebuild.
from build_catalog_chunks import build_chunks
build_chunks()
