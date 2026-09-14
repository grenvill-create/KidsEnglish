# -*- coding: utf-8 -*-
"""
smart_extractor.py - 高精度智能用车信息提取器
支持：
1. 空间几何对齐（横向同行提取 / 纵向垂直表格列对齐）
2. 丰富同义词与低分辨率表头容错池（覆盖目的地/姓名/手机/事由/人数/日期/发车地/状态等）
3. 智能正则语义提取（针对非表格聊天/审批流截图）
4. 严格边界截断（防止误把"是否往返/一级审核/附件"等抓入到达地或事由）
5. 校园地名与 OCR 常见错别字自动纠错（如 寺?心/寺+心/寺F->青中心，本~/本鄙->本部，霁陵路->零陵路，溥溪路->漕溪路）
6. 严格执行业务固定规则（出发地点固定零陵路453号、起止时间固定07:30与20:30、南模中学与郭老师等）
"""

import re
from datetime import datetime, timedelta

# ============================================================
# 业务固定规则配置 (严格保持)
# ============================================================

FIXED_RULES = {
    'ApplyOrganize': '上海市南洋模范中学',
    'CCRY2':         '郭老师',
    'VehicleType':   '358',
    'StartAdress':   '零陵路453号',   # 始终固定出发地为零陵路453号
    'DefaultReason': '开会或者单位学习',
    'FixedStartTime': '07:30',
    'FixedEndTime':   '20:30',
    'PersonCount':   '2',            # 乘车人数固定为2
}

# ============================================================
# 字段同义词与提取定义 (含 OCR 低分辨率表头容错)
# ============================================================

SYNONYM_MAP = {
    'date': [
        '用车日期', '出车日期', '申请日期', '使用日期', '日期', '用车时间', '用=时', '用车#阆', '用车时'
    ],
    'name': [
        '用车人姓名', '申请人姓名', '用车人', '申请人', '联系人', '经办人', '老师', '姓名', '中*人', '申*人'
    ],
    'mobile': [
        '用车人手机', '申请人手机', '联系人手机', '手机号', '手机号码', '手机', '联系电话', '联系方式', '电话'
    ],
    'person_count': [
        '乘车人数', '随车人数', '乘车人', '同行人数', '总人数', '人数', '用车人数',
        '座位', '匡位', '匡应'
    ],
    'reason': [
        '用车事由', '出车事由', '用车原因', '事由说明', '具体事由', '出车任务', '工作任务', '活动内容', '事项', '事由'
    ],
    'start_address': [
        '出发地点', '发车地点', '上车地点', '始发地', '出发地', '发车地', '发车', '起点',
        '炭亍地', '灰午地'
    ],
    'end_address': [
        '目的地', '目的地点', '到达地点', '到达地', '送达地点', '送达地', '终点', '去往', '去向',
        '目的', '目地', '月的地', '目的讪', '目地地', '闫内山', '目的地点'
    ]

}

# 用于判断是否为水平表格表头行的一组特征词
TABLE_HEADER_KEYWORDS = [
    '车辆', '车辆名称', '车牌', '车牌号', '申请人', '用车人', '联系人', '姓名',
    '座位', '人数', '乘车人数', '用车时间', '时间', '发车地', '出发地', '发车地点',
    '出发地点', '目的地', '到达地', '到达地点', '送达地', '送达地点', '状态', '操作',
    '事由', '用车事由', '审核状态', '月的地', '目的讪', '目地', '炭亍地', '灰午地',
    '中*人', '匡应', '匡位', '用=时', '用车#阆', '状忑', '操|', '宁辆', '车犄', '午辎'
]

# 常见表单字段/后续标签（用于防止误抓多余内容作为目的地或事由）
BOUNDARY_KEYWORDS = [
    '是否往返', '一级审核', '二级审核', '审核人', '审批人', '审核状态', '审批状态',
    '用车人', '申请人', '乘车人', '随车人', '联系人', '经办人', '姓名',
    '手机', '电话', '出发地点', '到达地点', '发车地', '目的地', '起点', '终点',
    '用车日期', '日期', '时间', '开始时间', '结束时间', '车型', '人数', '事由',
    '备注', '附件', '提交', '取消', '确认', '返回', '车辆', '司机',
    '月的地', '目的讪', '目地', '炭亍地', '灰午地', '中*人', '匡应', '匡位', '状忑', '操|'
]

# 错别字与常见校园地名纠错词典
CORRECTIONS = {
    # ── 目的地 / 地名 ──
    '寺?心':  '青中心',
    '寺+心':  '青中心',
    '寺H心':  '青中心',
    '寺F':    '青中心',
    '寺#':    '青中心',
    '寺心':   '青中心',
    '专+心':  '青中心',
    '专4心':  '青中心',
    '专中心': '青中心',
    '本~':    '本部',
    '木_':    '本部',
    '本鄙':   '本部',
    '本部校区': '本部',
    '南模初': '南模初中',
    '南模高': '南模高中',
    '霁陵路': '零陵路453号',
    '霁陵':   '零陵路',
    '溥溪路': '漕溪路',
    '溥溪':   '漕溪',
    '溆':     '淑',
    # ── 表格其他字段与常见 OCR 错别字 ──
    '复用徐汇': '复附徐汇',
    '复用':     '复附',
    '中诗人':   '申请人',
    '申诗人':   '申请人',
    '申诗':     '申请',
    '牛芒':     '本部',
    '午雨名秆': '车辆名称',
    '车\'名称': '车辆名称',
    '车硒':     '车辆',
    '弗车肘阃': '用车时间',
    'l车地':    '发车地',
    '岌亍地':   '发车地',
    '-酌地':    '目的地',
    '巨的地':   '目的地',
    '己幸排':   '已安排',
    '己芒排':   '已安排',
    '泸':       '沪',
    'ELg256':   'EL8256',
    'EL3256':   'EL8256',
    '卞异辛':   '大型客车',
    '巳产排':   '已安排',
    '巳5':      '已安排',
    '卅车':     '拼车',
    '1133':     '1/33',
    '30/3770':  '沪DJ3770',
    '310/3720': '沪DJ3770',
    '013770':   '沪DJ3770',
}


def clean_val(text: str) -> str:
    """清理提取内容中的噪音字符"""
    if not text:
        return ""
    text = text.strip().replace('：', ':')
    # 去除开头的冒号、星号、加号等符号
    text = re.sub(r'^[*:：\s+]+', '', text)
    # 去除尾部的冒号、星号等符号
    text = re.sub(r'[*:：\s+]+$', '', text)
    return text.strip()


def correct_typos(text: str) -> str:
    """自动应用错别字与地名校正（防止递归扩展）"""
    if not text:
        return ""
    text = text.strip()
    # 优先精确匹配
    if text in CORRECTIONS:
        return CORRECTIONS[text]
    # 子串匹配（若目标词已包含正确文本，不再替换）
    # 子串匹配（按 wrong 长度从长到短排序，优先替换更精确的词，避免短词造成误替换）
    sorted_corrections = sorted(CORRECTIONS.items(), key=lambda x: -len(x[0]))
    for wrong, right in sorted_corrections:
        if wrong in text:
            # 如果待替换文本中已经直接包含正确答案（例如"南模初中"中的"南模初"不应扩展），则跳过
            if right in text:
                continue
            text = text.replace(wrong, right)
            return text
    return text




def norm_date_str(text: str) -> str:
    """将各种日期格式统一为 YYYY-MM-DD"""
    if not text:
        return ""
    text = text.replace('/', '-').replace('.', '-').replace('。', '-').strip()
    now_year = datetime.now().year
    
    # 1. YYYY-MM-DD
    m = re.search(r'(\d{4})-(\d{1,2})-(\d{1,2})', text)
    if m:
        return f"{int(m.group(1)):04d}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"
    
    # 2. YYYYMMDD
    m = re.search(r'(\d{4})(\d{2})(\d{2})', text)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    
    # 3. MM-DD 或 M月D日 (严格优先匹配两位日 10~31，再匹配单日 1~9，防与时间连写时数字截断)
    m = re.search(r'(?<!\d)(?:0?([1-9]|1[0-2]))[-月]([12]\d|3[01]|0?[1-9])[日号]?(?=[ \t]*\d{1,2}:\d{2}|$|[^\d])', text)
    if not m:
        m = re.search(r'(?<!\d)(?:0?([1-9]|1[0-2]))[-月]([12]\d|3[01]|0?[1-9])[日号]?', text)
    if m:
        return f"{now_year:04d}-{int(m.group(1)):02d}-{int(m.group(2)):02d}"
    
    return ""


# ============================================================
# 空间几何对齐解析器
# ============================================================

def parse_with_geometry(boxes, log_cb=None) -> dict:
    """
    基于 OCR 的文本位置坐标进行智能配对。
    自动检测是否为表格表头排版：
    - 表格列结构：严格沿垂直方向向下对齐寻找单元格数据
    - 键值表单结构：先沿水平方向向右寻找，未找到再向下寻找
    """
    def _log(msg, level="INFO"):
        if log_cb:
            log_cb(msg, level)

    # 预处理各个 item 的中心坐标及范围
    items = []
    for bbox, text, prob in boxes:
        text = text.strip()
        if not text:
            continue
        xs = [pt[0] for pt in bbox]
        ys = [pt[1] for pt in bbox]
        x_min, x_max = min(xs), max(xs)
        y_min, y_max = min(ys), max(ys)
        w = max(10, x_max - x_min)
        h = max(10, y_max - y_min)
        clean_t = correct_typos(clean_val(text))
        items.append({
            'text': text,
            'clean_text': clean_t,
            'prob': prob,
            'x_min': x_min,
            'x_max': x_max,
            'y_min': y_min,
            'y_max': y_max,
            'cx': (x_min + x_max) / 2.0,
            'cy': (y_min + y_max) / 2.0,
            'w': w,
            'h': h
        })

    result = {}

    def is_table_header_layout(lbl_item):
        """检查该标签是否处于表格表头行中（同一水平线上存在其他表头关键词）"""
        same_line_headers = 0
        for it in items:
            if it is lbl_item:
                continue
            if abs(it['cy'] - lbl_item['cy']) < max(12.0, lbl_item['h'] * 0.6):
                if any(h_kw in it['text'] for h_kw in TABLE_HEADER_KEYWORDS):
                    same_line_headers += 1
        return same_line_headers >= 1

    # 查找关键词项在 items 中的匹配
    def find_label_item(synonyms):
        for it in items:
            t = it['clean_text']
            for syn in synonyms:
                if syn in t:
                    # 检查是否标签本身后面就跟着内容（例如："用车人姓名 徐若伦"）
                    after_text = t.replace(syn, '').strip(':：* ')
                    if after_text:
                        return it, after_text
                    return it, None
        return None, None

    # 遍历字段查找
    for field_key, syns in SYNONYM_MAP.items():
        lbl_item, inline_val = find_label_item(syns)
        if inline_val:
            val = correct_typos(clean_val(inline_val))
            result[field_key] = val
            _log(f"同行标签内解析到 [{field_key}]: {val}", "OK")
            continue

        if not lbl_item:
            continue

        is_table = is_table_header_layout(lbl_item)

        # ── 场景 1：如果检测为表格表头，优先严格沿垂直列向下投影寻找单元格 ──
        if is_table:
            down_candidates = []
            for it in items:
                if it is lbl_item:
                    continue
                # 处于下方
                if it['y_min'] >= lbl_item['y_max'] - 5 and it['y_min'] - lbl_item['y_max'] < lbl_item['h'] * 5.0:
                    # X 轴中心对齐 (列对齐范围)
                    x_dist = abs(it['cx'] - lbl_item['cx'])
                    if x_dist < max(60.0, lbl_item['w'] * 0.9):
                        y_dist = it['y_min'] - lbl_item['y_max']
                        down_candidates.append((y_dist, x_dist, it))

            if down_candidates:
                down_candidates.sort(key=lambda x: (x[0], x[1]))
                val_item = down_candidates[0][2]
                val = correct_typos(val_item['clean_text'])
                if not any(b_kw in val for b_kw in BOUNDARY_KEYWORDS):
                    result[field_key] = val
                    _log(f"表格列垂直对齐解析到 [{field_key}]: {val} (原文本: {val_item['text']})", "OK")
                    continue

        # ── 场景 2：普通表单/单行键值结构，查找水平右侧最近项 ──
        right_candidates = []
        for it in items:
            if it is lbl_item:
                continue
            y_diff = abs(it['cy'] - lbl_item['cy'])
            if y_diff < lbl_item['h'] * 1.2:
                if it['x_min'] >= lbl_item['x_min'] + 20:
                    dist = it['x_min'] - lbl_item['x_max']
                    right_candidates.append((dist, it))

        if right_candidates:
            right_candidates.sort(key=lambda x: x[0])
            val_item = right_candidates[0][1]
            val = correct_typos(val_item['clean_text'])
            # 必须不是其他标签
            if not any(b_kw in val for b_kw in BOUNDARY_KEYWORDS):
                # ── 多行续接：若值项下方紧接着有续行（x 与值项对齐，无标签词），合并拼接 ──
                val_parts = [val]
                base_x_min = val_item['x_min']
                base_x_max = val_item['x_max']
                cur_y_max = val_item['y_max']
                for _ in range(4):  # 最多续接4行
                    continuations = []
                    for it2 in items:
                        if it2 is lbl_item or it2 is val_item:
                            continue
                        if it2['y_min'] > cur_y_max and it2['y_min'] - cur_y_max < val_item['h'] * 2.5:
                            # x 轴与值项有重叠或对齐
                            x_overlap = min(base_x_max, it2['x_max']) - max(base_x_min, it2['x_min'])
                            if x_overlap > -20:
                                # 续行不能是标签词
                                if not any(b_kw in it2['clean_text'] for b_kw in BOUNDARY_KEYWORDS):
                                    continuations.append((it2['y_min'], it2))
                    if not continuations:
                        break
                    continuations.sort(key=lambda x: x[0])
                    cont_item = continuations[0][1]
                    cont_text = correct_typos(cont_item['clean_text'])
                    val_parts.append(cont_text)
                    cur_y_max = cont_item['y_max']
                    val_item = cont_item  # 移动锚点
                if len(val_parts) > 1:
                    val = ''.join(val_parts)
                    _log(f"多行合并后 [{field_key}]: {val}", "OK")
                result[field_key] = val
                _log(f"水平对齐解析到 [{field_key}]: {val}", "OK")
                continue

        # ── 场景 3：普通表单上下排列结构，查找下方最近项 ──
        if not is_table:
            down_candidates = []
            for it in items:
                if it is lbl_item:
                    continue
                if it['y_min'] > lbl_item['y_max'] and it['y_min'] - lbl_item['y_max'] < lbl_item['h'] * 3.0:
                    overlap = min(lbl_item['x_max'], it['x_max']) - max(lbl_item['x_min'], it['x_min'])
                    if overlap > -50:
                        dist = it['y_min'] - lbl_item['y_max']
                        down_candidates.append((dist, it))

            if down_candidates:
                down_candidates.sort(key=lambda x: x[0])
                val_item = down_candidates[0][1]
                val = correct_typos(val_item['clean_text'])
                if not any(b_kw in val for b_kw in BOUNDARY_KEYWORDS):
                    result[field_key] = val
                    _log(f"垂直对齐解析到 [{field_key}]: {val}", "OK")
                    continue

    return result


# ============================================================
# 全文智能正则提取器 (针对无结构/截断边界保护)
# ============================================================

def parse_with_regex(raw_text: str, log_cb=None) -> dict:
    """
    全文正则语义提取，具备完备的同义词与边界截断保护。
    """
    def _log(msg, level="INFO"):
        if log_cb:
            log_cb(msg, level)

    res = {}
    lines = [clean_val(l) for l in raw_text.splitlines() if clean_val(l)]
    full_text = " ".join(lines)

    # 1. 用车日期提取
    for syn in SYNONYM_MAP['date']:
        # 支持 "09-02 12:30 ~ 09-02 13:20" 区间格式，取第一个日期
        m = re.search(rf'{re.escape(syn)}\s*[:：\s]*(\d{{1,4}}[-/.月]\d{{1,2}}(?:[-/.]\d{{2,4}})?)', full_text)
        if m:
            d = norm_date_str(m.group(1))
            if d:
                res['date'] = d
                _log(f"正则识别到用车日期: {d}", "OK")
                break
    if 'date' not in res:
        # 全文找独立 YYYY-MM-DD 或 MM-DD
        m = re.search(r'(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})', full_text)
        if m:
            res['date'] = norm_date_str(m.group(1))
        else:
            # 时间区间格式 "09-02 12:30 ~ 09-02 13:20" 提取日期部分
            m = re.search(r'(\d{2})-(\d{2})\s+\d{1,2}:\d{2}', full_text)
            if m:
                res['date'] = norm_date_str(f"{m.group(1)}-{m.group(2)}")
            else:
                m2 = re.search(r'(?:0?([1-9]|1[0-2]))[-/.](0?[1-9]|[12]\d|3[01])', full_text)
                if m2:
                    res['date'] = norm_date_str(m2.group(0))

    # 2. 手机号提取 (11位标准手机号)
    m = re.search(r'(?<!\d)(1[3-9]\d{9})(?!\d)', full_text)
    if m:
        res['mobile'] = m.group(1)
        _log(f"正则识别到手机号: {res['mobile']}", "OK")

    # 3. 乘车人数提取
    for syn in SYNONYM_MAP['person_count']:
        m = re.search(rf'{re.escape(syn)}\s*[:：\s]*(\d+)', full_text)
        if m:
            res['person_count'] = m.group(1)
            _log(f"正则识别到乘车人数: {m.group(1)}", "OK")
            break
    if 'person_count' not in res:
        # 匹配 "2人", "2位" 或 座位比 "1/33"
        m = re.search(r'(?<!\d)([1-9]\d?)\s*[人位名]', full_text)
        if m:
            res['person_count'] = m.group(1)
        else:
            m_seat = re.search(r'(\d+)\s*/\s*\d+', full_text)
            if m_seat:
                res['person_count'] = m_seat.group(1)

    # 4. 用车人姓名提取 (2~4 个中文字符，排除标签干扰)
    for syn in SYNONYM_MAP['name']:
        m = re.search(rf'{re.escape(syn)}\s*[:：\s]*([\u4e00-\u9fa5]{{2,4}})(?=\s|$|[0-9*])', full_text)
        if m:
            cand = m.group(1).strip()
            if not any(b_kw in cand for b_kw in BOUNDARY_KEYWORDS):
                res['name'] = cand
                _log(f"正则识别到姓名: {cand}", "OK")
                break

    # 边界正则：构建截止模式
    boundary_pattern = r'(?=\s*(?:' + '|'.join(re.escape(k) for k in BOUNDARY_KEYWORDS) + r')|\s{3,}|$)'

    # 5. 到达地点提取（支持跨行续行合并）
    for syn in SYNONYM_MAP['end_address']:
        # 优先在原始多行文本中逐行查找，支持目的地值跨行
        m = re.search(rf'{re.escape(syn)}\s*[:\uff1a\s]*([^\n]+)', raw_text)
        if m:
            addr_val = m.group(1).strip()
            # 检查下一行是否是续行（纯数字/地址符号，无新标签）
            lines_after = raw_text[m.end():].strip().split('\n')
            for nxt in lines_after[:3]:
                nxt = nxt.strip()
                if not nxt:
                    break
                # 若下一行是新字段标签则停止
                if any(bkw in nxt for bkw in BOUNDARY_KEYWORDS):
                    break
                # 续行：只含数字/地址字符（无冒号标签）且不含句分隔
                if ':' not in nxt and '：' not in nxt and len(nxt) < 30:
                    addr_val += nxt  # 直接拼接（不加空格）
                else:
                    break
            addr = correct_typos(clean_val(addr_val))
            if addr and not any(addr == b_kw for b_kw in BOUNDARY_KEYWORDS):
                res['end_address'] = addr
                _log(f"正则识别到到达地点(多行): {addr}", "OK")
                break
        # 备用：在 full_text 单行中找
        if 'end_address' not in res:
            m2 = re.search(rf'{re.escape(syn)}\s*[:\uff1a\s]*([^:\n*]+?){boundary_pattern}', full_text)
            if m2:
                addr = correct_typos(clean_val(m2.group(1)))
                if addr and not any(addr == b_kw for b_kw in BOUNDARY_KEYWORDS):
                    res['end_address'] = addr
                    _log(f"正则识别到到达地点: {addr}", "OK")
                    break


    # 6. 具体事由提取 (允许匹配到换行的长文本)
    for syn in SYNONYM_MAP['reason']:
        # 先在 full_text（单行）中找
        m = re.search(rf'{re.escape(syn)}\s*[:：\s]*([^:\n*]+?){boundary_pattern}', full_text)
        if m:
            r_text = clean_val(m.group(1))
            if r_text and not any(r_text == b_kw for b_kw in BOUNDARY_KEYWORDS):
                res['reason'] = r_text
                _log(f"正则识别到具体事由: {r_text}", "OK")
                break
        # 若找不到，在原始多行文本中尝试（适应多行原因）
        if 'reason' not in res:
            m2 = re.search(rf'{re.escape(syn)}\s*[:：\s]*(.+?)(?=\n(?:{"|".join(re.escape(k) for k in BOUNDARY_KEYWORDS)})|$)',
                           raw_text, re.DOTALL)
            if m2:
                r_text = clean_val(re.sub(r'\s+', ' ', m2.group(1)))
                if r_text:
                    res['reason'] = r_text
                    _log(f"多行正则识别到具体事由: {r_text[:40]}...", "OK")
                    break

    # 7. 若 end_address 未从目的地字段直接提取，从用车原因中备用提取目标地址
    if not res.get('end_address') and res.get('reason'):
        # 尝试从原因文本中提取「去XXX」或「到达XXX」后面的地址
        m_dest = re.search(
            r'(?:去|前往|送至|到达|接到|送往)([\u4e00-\u9fa5\d号弄楼室栋区路街道巷]{5,40})',
            res['reason']
        )
        if m_dest:
            res['end_address'] = correct_typos(clean_val(m_dest.group(1)))
            _log(f"从事由备用提取到目的地: {res['end_address']}", "OK")

    # 8. 出发地点 (若图片中有提及，仅作为识别参考)
    for syn in SYNONYM_MAP['start_address']:
        m = re.search(rf'{re.escape(syn)}\s*[:：\s]*([^:\n*]+?){boundary_pattern}', full_text)
        if m:
            s_text = correct_typos(clean_val(m.group(1)))
            if s_text and not any(s_text == b_kw for b_kw in BOUNDARY_KEYWORDS):
                res['start_address'] = s_text
                break

    return res


# ============================================================
# 综合入口与业务固定规则施加
# ============================================================

def smart_extract_car_info(ocr_detail_boxes, raw_text: str, log_cb=None) -> dict:
    """
    智能提取主函数：
    融合空间几何提取 + 正则语义提取 + 错别字校正 + 业务固定规则
    返回标准的表单 dict
    """
    def _log(msg, level="INFO"):
        if log_cb:
            log_cb(msg, level)

    _log("启动 SmartLocalExtractor 高精度提取引擎...", "STEP")

    # 1. 空间几何对齐提取
    geo_res = {}
    if ocr_detail_boxes:
        try:
            geo_res = parse_with_geometry(ocr_detail_boxes, log_cb=log_cb)
        except Exception as e:
            _log(f"空间几何解析异常: {e}，将主要依赖正则提取", "WARN")

    # 2. 全文语义正则提取
    reg_res = parse_with_regex(raw_text, log_cb=log_cb)

    # 3. 结果融合：优先采用几何提取结果，正则作为补充
    merged = {}
    for k in ['date', 'name', 'mobile', 'person_count', 'reason', 'end_address', 'start_address']:
        v = geo_res.get(k) or reg_res.get(k)
        if v:
            merged[k] = clean_val(correct_typos(str(v)))

    # 4. 组装为目标系统的 15 个标准字段
    final_data = {}

    # 日期处理
    raw_date_candidate = merged.get('date', '')
    car_date = norm_date_str(raw_date_candidate)
    if not car_date:
        car_date = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        _log(f"未识别到标准用车日期，使用默认明天: {car_date}", "WARN")
    else:
        _log(f"最终确认用车日期: {car_date}", "OK")

    final_data['_car_date'] = car_date

    # 申请人与手机
    contact_name = merged.get('name', '')
    contact_mobile = merged.get('mobile', '')
    final_data['Contacts'] = contact_name
    final_data['PersonMobile'] = contact_mobile

    # 人数
    raw_count = merged.get('person_count', '2')
    # 处理 "1/33" 或纯数字
    m_p = re.search(r'(\d+)', str(raw_count))
    final_data['PersonCount'] = m_p.group(1) if m_p else '2'

    # 到达地点 (核心优化项，应用纠错与防串联)
    end_addr = merged.get('end_address', '')
    for b_kw in BOUNDARY_KEYWORDS:
        if b_kw in end_addr:
            end_addr = end_addr.split(b_kw)[0].strip()
    end_addr = correct_typos(end_addr)
    final_data['EndAdress'] = end_addr       # 对应界面及表单系统中的"到达地点"
    final_data['EndAddress'] = end_addr
    final_data['end_address'] = end_addr
    final_data['to_location'] = end_addr
    final_data['目的地'] = end_addr
    final_data['到达地点'] = end_addr
    if end_addr:
        _log(f"已识别到目的地/到达地点: {end_addr} -> 自动填入表单【到达地点】", "OK")
    else:
        _log("未识别到目的地/到达地点，请手动补充", "WARN")



    # 具体事由
    reason_val = merged.get('reason', '')
    for b_kw in BOUNDARY_KEYWORDS:
        if b_kw in reason_val:
            reason_val = reason_val.split(b_kw)[0].strip()
    if not reason_val:
        reason_val = FIXED_RULES['DefaultReason']
        _log(f"未识别到事由，应用业务固定规则兜底: {reason_val}", "INFO")
    else:
        _log(f"最终确认具体事由: {reason_val}", "OK")
    final_data['Reason'] = reason_val

    # ============================================================
    # 严格执行用户要求的【业务固定硬编码】
    # ============================================================
    final_data['PersonCount']   = FIXED_RULES['PersonCount']  # 强制固定乘车人数为2
    _log(f"乘车人数应用业务固定规则: {FIXED_RULES['PersonCount']}", "OK")
    final_data['ApplyOrganize'] = FIXED_RULES['ApplyOrganize']
    final_data['VehicleType']   = FIXED_RULES['VehicleType']
    final_data['CCRY2']         = FIXED_RULES['CCRY2']
    final_data['StartAdress']   = FIXED_RULES['StartAdress']  # 强制固定零陵路453号
    _log(f"出发地点应用业务固定规则: {FIXED_RULES['StartAdress']}", "OK")

    # 时间固定为日期 + 07:30 / 20:30
    final_data['CarTime'] = f"{car_date} {FIXED_RULES['FixedStartTime']}"
    final_data['EndTime'] = f"{car_date} {FIXED_RULES['FixedEndTime']}"
    _log(f"起止时间应用业务固定规则: {final_data['CarTime']} 至 {final_data['EndTime']}", "OK")

    # 联动字段：随车人员1、随车人员电话
    final_data['CCRY1']      = contact_name
    final_data['PersonName'] = contact_name
    final_data['PersonTel']  = contact_mobile

    return final_data
