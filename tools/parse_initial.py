#!/usr/bin/env python3
"""Rebuild initial official records from downloaded unmodified MOE/BJ/FJ originals.
Dependencies: xlrd, pdfplumber, python-docx. No network; no names synthesized.
"""
import json,re,collections,hashlib
from pathlib import Path
import xlrd,pdfplumber
from docx import Document
ROOT=Path(__file__).resolve().parents[1]
COLLECTED=ROOT/'data/national-directory/raw'
OUT=ROOT/'data/national-directory/intermediate'
VERIFIED='2026-11-02'
NAMING_RULE='https://www.moe.gov.cn/srcsite/A03/s7050/202008/t20200827_480729.html'

def clean(x):
    if isinstance(x,float): return str(int(x)) if x.is_integer() else str(x)
    return re.sub(r'\s+','',str(x or '')).replace('\u3000','')

def record(name,province,level,sourceId,locator,**kw):
    r=dict(name=clean(name),originalName=str(name),province=province,level=level,code='',city='',authority='',ownership='',sourceId=sourceId,sourceLocator=locator,unitType='独立学校',verifiedOn=VERIFIED)
    r.update(kw)
    r['recordId']=sourceId+':'+hashlib.sha256((province+'|'+level+'|'+r['name']+'|'+str(r.get('code',''))).encode()).hexdigest()[:16]
    return r

def parse_moe():
    sh=xlrd.open_workbook(COLLECTED/'MOE-2026.xls').sheet_by_index(0)
    prov=''; rs=[]; allrows=0; undergrad=0; high=0
    for i in range(sh.nrows):
        row=sh.row_values(i)
        match=re.fullmatch(r'([^（(]+)[（(]\d+所[）)]',clean(row[0]))
        if match:
            prov=match.group(1);continue
        if clean(row[5]) not in ['本科','专科']: continue
        allrows+=1
        assert prov
        name=clean(row[1]); level=''
        if clean(row[5])=='专科': level='高职';high+=1
        elif re.search(r'职业(?:技术)?大学$',name): level='职教本科';undergrad+=1
        if not level:continue
        remark=clean(row[6]); own='民办' if '民办' in remark else '中外合作办学' if '中外合作办学' in remark else '内地与港澳台地区合作办学' if '内地与港澳台地区合作办学' in remark else ''
        # MOE blank remarks do not explicitly state ownership; do not infer public.
        r=record(row[1],prov,level,'MOE-2026',f'工作表“{sh.name}”第{i+1}行；全国序号{clean(row[0])}',code=clean(row[2]),city=clean(row[4]),authority=clean(row[3]),ownership=own,sourceOrdinal=clean(row[0]),sourceEducationLevel=clean(row[5]),remarks=remark)
        r['classificationMethod']='教育部原表办学层次=专科' if level=='高职' else '教育部原表办学层次=本科，且校名符合《高等学校命名暂行办法》第四条本科层次职业学校命名形式（职业大学/职业技术大学）'
        if level=='职教本科':r['classificationBasisUrl']=NAMING_RULE
        rs.append(r)
    assert allrows==2952,(allrows,'MOE ordinary rows')
    assert high==1540,(high,'MOE higher-vocational')
    assert undergrad==124,(undergrad,'MOE vocational-undergraduate')
    assert len({x['code'] for x in rs})==len(rs)
    return rs

BJ_SPECIAL_NAMES={'北京启喑实验学校','北京市朝阳区安华学校','北京市盲人学校','北京市健翔学校'}
def unit_type(name,code=''):
    if re.search(r'特殊教育|特殊儿童|培智|聋哑|盲校',name) or name in BJ_SPECIAL_NAMES or (code.startswith('51') and len(code)==10):return '特殊教育中职招生单位'
    if re.search(r'中专部|中职部|中职班|中等职业教育部',name) or (len(code)==10 and code.startswith('41')):return '附设中职部'
    return '独立学校'

def parse_bj(which):
    rs=[];area='';subtype='普通中专' if which=='ZZ' else '职业高中'
    with pdfplumber.open(COLLECTED/f'BJ-{which}-2026.pdf') as pdf:
        for pi,p in enumerate(pdf.pages,1):
            for li,line in enumerate(p.extract_text().splitlines(),1):
                line=line.strip()
                if re.match(r'^[一二三四五六七八九十]、',line):area=line.split('、',1)[1];continue
                if re.match(r'^[\u4e00-\u9fff]+区$',line):area=line;continue
                m=re.match(r'^(\d+)\.(.+)$',line)
                if not m:
                    if line!='北京市燕山职业学校':continue
                    ordinal='未编号';name=line
                else:ordinal=m[1];name=m[2]
                r=record(name,'北京市','中职',f'BJ-{which}-2026',f'第{pi}页第{li}文本行；{area}序号{ordinal}',city='北京市',district=area,sourceOrdinal=ordinal,schoolSubtype=subtype,unitType=unit_type(name),authority='')
                r['unitTypeBasis']='来源列入中职招生资格；按名称识别附设中专部或特殊教育招生单位，未核验法人独立性'
                rs.append(r)
    assert len(rs)==(27 if which=='ZZ' else 46),(which,len(rs))
    assert len({r['name'] for r in rs})==len(rs)
    return rs

FJ_CITIES=['省属','福州市','厦门市','漳州市','泉州市','三明市','莆田市','南平市','龙岩市','宁德市','平潭综合实验区']
def parse_fj():
    d=Document(COLLECTED/'FJ-2026.docx');rs=[]
    for ti,t in enumerate(d.tables[:11]):
        assert len(t.columns)==16
        for ri,row in enumerate(t.rows[2:],3):
            cells=[c.text for c in row.cells]
            assert re.fullmatch(r'\d+',clean(cells[0])),(ti,ri,cells[:3])
            name,code=clean(cells[1]),clean(cells[2])
            assert name and code
            own=clean(cells[11]);r=record(cells[1],'福建省','中职','FJ-2026',f'附件1第{ti+1}表第{ri}行；{FJ_CITIES[ti]}序号{clean(cells[0])}',code=code,city=FJ_CITIES[ti] if ti else '',authority=clean(cells[13]),ownership='公办' if own=='公立' else own,ownershipOriginal=own,schoolAffiliation=clean(cells[12]),sourceOrdinal=clean(cells[0]),unitType=unit_type(name,code),address=clean(cells[10]))
            if r['unitType']=='附设中职部':r['educationScope']='官方中职招生资质名单中的高校办学单位（原件仅列高校名称，保留原名）'
            if r['unitType']=='独立学校':r['unitTypeBasis']='学校名录条目；法人独立性未专项核验'
            if not re.fullmatch(r'\d{10}',code):r['codeFormatIssue']='原件机构代码非10位，逐字保留，不补零或推断'
            rs.append(r)
    assert len({r['name'] for r in rs})==len(rs)
    return rs

if __name__=='__main__':
    rs=parse_moe()+parse_bj('ZZ')+parse_bj('ZG')+parse_fj()
    OUT.mkdir(exist_ok=True)
    (OUT/'initial_records.json').write_text(json.dumps(rs,ensure_ascii=False,indent=2))
    counts=collections.Counter(r['sourceId'] for r in rs)
    issues=[{k:r[k] for k in ('name','code','sourceId','sourceLocator','codeFormatIssue')} for r in rs if r.get('codeFormatIssue')]
    audit={'counts':dict(counts),'total':len(rs),'levels':dict(collections.Counter(r['level'] for r in rs)),'codeFormatIssues':issues,'classificationBasis':{'title':'教育部办公厅关于印发《高等学校命名暂行办法》的通知','url':NAMING_RULE,'article':'第四条','method':'以教育部全国高等学校名单本科行与职业大学/职业技术大学命名后缀交集识别，不将普通本科纳入'},'deduplicationNote':'跨层次保留同名办学主体；学校条目不等于独立法人数量。福建附件1中的高校本名保持原样，单列中职教育层次。','limitations':['MOE备注为空不推断公办性质','中职法人独立性未逐校专项核验','北京职业高中名单包含特殊教育学校，依源保留','原件非10位机构码不修造']}
    (OUT/'initial_audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
    print(json.dumps(audit,ensure_ascii=False,indent=2))
