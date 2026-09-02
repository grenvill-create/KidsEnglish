#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
用车申请自动化 - 界面版 v3
支持：Ctrl+V 粘贴图片 / 拖拽图片文件 / 点击选择文件
修复：OCR 和 Selenium 均在子线程运行，界面不卡死
"""

import os
import sys
import json
import re
import time
import threading
import tempfile
from datetime import datetime, timedelta
from pathlib import Path

# 全局错误捕获
def global_exception_handler(exctype, value, tb):
    import traceback as _tb
    msg = f"[XX] 程序启动失败！\n错误类型: {exctype.__name__}\n错误信息: {value}\n"
    msg += ''.join(_tb.format_tb(tb))
    print(msg)
    try:
        import tkinter.messagebox as mb
        mb.showerror("启动失败", msg)
    except:
        pass
    sys.exit(1)

sys.excepthook = global_exception_handler

# ============================================================
# 依赖检查
# ============================================================

def ensure_package(pkg, import_name=None):
    import importlib
    name = import_name or pkg
    try:
        importlib.import_module(name)
    except ImportError:
        print(f"[>>] 正在安装依赖: {pkg} ...")
        os.system(f"{sys.executable} -m pip install {pkg} -q")

ensure_package("Pillow", "PIL")
ensure_package("pytesseract")
ensure_package("easyocr")
ensure_package("selenium")

# ============================================================
# easyocr 全局单例（复用，避免每次识别重新加载模型）
# ============================================================

_easyocr_reader = None
_easyocr_lock = threading.Lock()

def get_easyocr_reader(log_cb=None):
    """懒加载 easyocr Reader 单例，线程安全。"""
    global _easyocr_reader
    if _easyocr_reader is None:
        with _easyocr_lock:
            if _easyocr_reader is None:
                if log_cb:
                    log_cb("首次加载 OCR 模型（约5~10秒，后续无需等待）...", "INFO")
                import easyocr as _easyocr_mod
                _easyocr_reader = _easyocr_mod.Reader(['ch_sim', 'en'], verbose=False)
                if log_cb:
                    log_cb("OCR 模型加载完成，已缓存复用", "OK")
    return _easyocr_reader

# ============================================================
# 固定值配置
# ============================================================

FIXED_VALUES = {
    'ApplyOrganize': '上海市南洋模范中学',
    'CCRY2':         '郭老师',
    'VehicleType':   '358',
    'StartAdress':   '零陵路453号',   # 默认出发地点
}

FIELD_DEFS = [
    # (field_id,       中文标签,                    必填,  默认值)
    ('ApplyOrganize',  '申请单位',                  True,  '上海市南洋模范中学'),
    ('PersonCount',    '乘车人数',                  True,  '2'),
    ('Contacts',       '申请人姓名',                True,  ''),
    ('PersonMobile',   '申请人手机',                True,  ''),
    ('CCRY1',          '乘车人员1（同申请人）',      False, ''),
    ('CCRY2',          '乘车人员2',                 False, '郭老师'),
    ('PersonName',     '随车人员姓名（同申请人）',   False, ''),
    ('PersonTel',      '随车人手机（同申请人）',     False, ''),
    ('StartAdress',    '出发地点',                  True,  '零陵路453号'),
    ('EndAdress',      '到达地点',                  True,  ''),
    ('CarTime',        '用车开始时间',              True,  '07:30'),
    ('EndTime',        '用车结束时间',              True,  '20:30'),
    ('VehicleType',    '车型',                      False, '358'),
    ('UseReason',      '用车事由选项（留空自动选）', False, ''),
    ('Reason',         '具体事由',                  True,  ''),
]

# ============================================================
# OCR 和解析函数
# ============================================================

def extract_text_from_image(image_path: str, log_cb=None) -> str:
    def _log(msg, level="INFO"):
        if log_cb:
            log_cb(msg, level)
        else:
            print(f"[{level}] {msg}")

    _log(f"正在识别图片: {Path(image_path).name}", "STEP")
    text = ""

    try:
        from PIL import Image, ImageFilter, ImageEnhance
        import tempfile, os

        # ── 图像预处理：放大 + 锐化 → 提升数字/时间识别率 ──
        _log("预处理图像中...", "INFO")
        try:
            pil_img = Image.open(image_path).convert("RGB")
            # 放大2倍（双三次插值）
            w, h = pil_img.size
            pil_img = pil_img.resize((w * 2, h * 2), Image.BICUBIC)
            # 锐化2次
            pil_img = pil_img.filter(ImageFilter.SHARPEN)
            pil_img = pil_img.filter(ImageFilter.SHARPEN)
            # 增强对比度 +30%
            pil_img = ImageEnhance.Contrast(pil_img).enhance(1.3)
            # 保存为临时文件供 easyocr 使用
            tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
            pil_img.save(tmp.name)
            ocr_input_path = tmp.name
            _log("图像预处理完成（放大2x + 锐化×2 + 对比度+30%）", "OK")
        except Exception as pe:
            _log(f"图像预处理失败（跳过预处理）: {pe}", "WARN")
            ocr_input_path = image_path

        _log("使用 easyocr 识别中...", "INFO")
        reader = get_easyocr_reader(log_cb=log_cb)
        
        # 获取带坐标的详细结果 (用于空间几何对齐)
        boxes_raw = reader.readtext(ocr_input_path, detail=1)
        # 转换 detail_boxes
        detail_boxes = []
        for bbox, t, prob in boxes_raw:
            pts = [[float(p[0]), float(p[1])] for p in bbox]
            detail_boxes.append((pts, str(t), float(prob)))
            
        results = [t for _, t, _ in detail_boxes]
        text = "\n".join(results)

        # 清理临时文件
        if ocr_input_path != image_path:
            try:
                os.unlink(ocr_input_path)
            except Exception:
                pass

        _log(f"easyocr 识别完成，共 {len(text)} 字符，{len(detail_boxes)} 个文本块", "OK")
        return text, detail_boxes
    except Exception as e:
        _log(f"easyocr 失败: {e}，尝试 pytesseract ...", "WARN")

    try:
        import pytesseract
        from PIL import Image
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img, lang='chi_sim+eng')
        _log(f"pytesseract 识别完成，共 {len(text)} 字符", "OK")
        return text, []
    except Exception as e:
        _log(f"pytesseract 失败: {e}", "ERR")

    return text, []


def extract_and_parse_image(image_path: str, log_cb=None) -> dict:
    """
    全新入口：整合图像识别与 SmartLocalExtractor 智能提取引擎。
    严格执行业务固定规则（出发地点固定零陵路453号、起止时间固定07:30与20:30等）。
    """
    raw_text, detail_boxes = extract_text_from_image(image_path, log_cb=log_cb)
    from smart_extractor import smart_extract_car_info
    data = smart_extract_car_info(detail_boxes, raw_text, log_cb=log_cb)
    return data



# ── 用户自定义纠错词典 ────────────────────────────────────────────
# 格式：{"错误识别": "正确字"}
# 如遇到新的错别字，在这里添加即可
OCR_CORRECTIONS = {
    "溆": "淑",
}


def parse_form_data_from_text(ocr_text: str, log_cb=None) -> dict:
    def _log(msg, level="INFO"):
        if log_cb:
            log_cb(msg, level)

    # ── 纠错：替换已知识别错误字 ──────────────────────────────────
    for wrong, correct in OCR_CORRECTIONS.items():
        if wrong in ocr_text:
            ocr_text = ocr_text.replace(wrong, correct)
            _log(f"纠错：'{wrong}' → '{correct}'", "OK")

    _log("开始解析 OCR 文本...", "STEP")
    result = {}
    lines = [l.strip() for l in ocr_text.splitlines() if l.strip()]
    full_text = " ".join(lines)

    _log(f"OCR 原文（前200字）: {full_text[:200]}", "INFO")

    # ── 辅助函数：统一时间格式 ──────────────────────────────────
    def _norm_time(t: str) -> str:
        """把各种 OCR 时间格式统一为 HH:MM"""
        t = t.replace('：', ':').replace('．', ':').replace('。', ':').strip()
        # 匹配 HH:MM 或 H:MM
        m2 = re.match(r'^(\d{1,2}):(\d{2})$', t)
        if m2:
            h, mi = int(m2.group(1)), int(m2.group(2))
            return f"{h:02d}:{mi:02d}"
        # 匹配 HH时MM分
        m2 = re.match(r'^(\d{1,2})[时h](\d{0,2})[分m]?$', t)
        if m2:
            h = int(m2.group(1))
            mi = int(m2.group(2)) if m2.group(2) else 0
            return f"{h:02d}:{mi:02d}"
        return t

    def _norm_date(d: str) -> str:
        """把各种 OCR 日期格式统一为 YYYY-MM-DD"""
        d = d.replace('/', '-').replace('.', '-').replace('。', '-').strip()
        # 紧凑格式：20260326 → 2026-03-26
        m2 = re.match(r'^(\d{4})(\d{2})(\d{2})$', d)
        if m2:
            return f"{m2.group(1)}-{m2.group(2)}-{m2.group(3)}"
        return d

    # ── 用车日期 ─────────────────────────────────────────────
    # 支持 2026-03-26 / 2026/03/26 / 2026.03.26 / 20260326
    m = re.search(
        r'用[\s]*车[\s]*日[\s]*期[\s\S]{0,5}?(\d{4}[-/.\s]\d{1,2}[-/.\s]\d{1,2}|\d{8})',
        full_text
    )
    if not m:
        # 退而求其次：全文找日期
        m = re.search(r'(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})', full_text)
    if m:
        result['_car_date'] = _norm_date(m.group(1))
        _log(f"识别用车日期: {result['_car_date']}", "OK")

    # ── 用车人姓名 ────────────────────────────────────────────
    # 限定：纯汉字 2~4 个（中国人名），防止把后续内容误匹配进来
    m = re.search(r'用[\s]*车[\s]*人[\s]*姓[\s]*名\s*[：:＊*\s]*([\u4e00-\u9fa5]{2,4})', full_text)
    if not m:
        # 退而求其次：只要"姓名"后跟汉字
        m = re.search(r'姓[\s]*名\s*[：:＊*\s]*([\u4e00-\u9fa5]{2,4})', full_text)
    if m:
        name = m.group(1).strip()
        # 过滤掉明显是字段标签的词（这些不是人名）
        _LABEL_WORDS = {'申请人', '用车人', '乘车人', '联系人', '随车人', '负责人', '经办人'}
        if name not in _LABEL_WORDS:
            result['Contacts'] = name
            _log(f"识别姓名: {name}", "OK")
        else:
            _log(f"姓名疑似标签词，已忽略: {name}", "WARN")
    else:
        _log("姓名未识别到，请手动填写", "WARN")

    # ── 手机号 ────────────────────────────────────────────────
    m = re.search(r'用[\s]*车[\s]*人[\s]*手[\s]*机\s*[：:＊*\s]*(1[3-9]\d{9})', full_text)
    if not m:
        m = re.search(r'(1[3-9]\d{9})', full_text)
    if m:
        result['PersonMobile'] = m.group(1)

    # ── 用车开始/结束时间：固定值，跳过OCR识别 ──────────────────
    date = result.get('_car_date', (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d'))
    result['CarTime'] = f"{date} 07:30"
    result['EndTime']  = f"{date} 20:30"
    _log(f"时间固定值：开始 {result['CarTime']}  结束 {result['EndTime']}", "OK")



    # 乘车人数：支持多种 OCR 识别变体
    _log("尝试识别乘车人数...", "DEBUG")
    m = re.search(r'乘车人数[\s：:*]*\s*(\d+)', full_text)
    if not m:
        # OCR 可能识别成"乘车人 数"、"乘 车人数"、"乘车人"|try_number"
        m = re.search(r'乘[\s]*车[\s]*人[\s]*数[\s：:*]*\s*(\d+)', full_text)
    if not m:
        # 更宽泛：只要 "人数" 后面紧跟数字
        m = re.search(r'人[\s]*数[\s：:*]*\s*(\d+)', full_text)
    if m:
        result['PersonCount'] = m.group(1)
        _log(f"乘车人数识别成功: {m.group(0)} → {m.group(1)}", "OK")
    else:
        _log(f"乘车人数未识别到，OCR文本中相关片段: {full_text[max(0,full_text.find('人')-5):full_text.find('人')+15] if '人' in full_text else '无'}", "WARN")

    m = re.search(r'用车事由\s*[：:]*\s*(.{4,60}?)(?=\s*出发地点|\s*到达地点|\s{3,}|$)', full_text)
    if m:
        result['Reason'] = m.group(1).strip()

    # 到达地点 / 目的地：支持多种同义词并填入 EndAdress
    m = re.search(r'(?:到达地点|目的地|送达地点|到达地|送达地|终点|去往)\s*[：:]*\s*(.{2,40}?)(?:\s{3,}|$)', full_text)
    if m:
        result['EndAdress'] = m.group(1).strip()


    # 清理字段尾部的 OCR 噪音（必填星号 * 和多余空格）
    for k in ('StartAdress', 'EndAdress', 'Reason', 'Contacts', 'PersonMobile'):
        if k in result:
            result[k] = result[k].strip().rstrip('*').strip()

    _log(f"解析完成，识别到 {len(result)} 个字段", "OK")

    for k, v in FIXED_VALUES.items():
        if not result.get(k, '').strip():
            result[k] = v

    # ── 规则 1：出发地址永远为"零陵路453号"（强制覆盖，不管 OCR 识别什么）──
    result['StartAdress'] = '零陵路453号'

    # ── 规则 2：用车事由为空时填"开会或者单位学习" ──
    if not result.get('Reason', '').strip():
        result['Reason'] = '开会或者单位学习'

    contact = result.get('Contacts', '').strip()
    mobile  = result.get('PersonMobile', '').strip()
    if not result.get('CCRY1', '').strip() and contact:
        result['CCRY1'] = contact
    if not result.get('PersonName', '').strip() and contact:
        result['PersonName'] = contact
    if not result.get('PersonTel', '').strip() and mobile:
        result['PersonTel'] = mobile

    return result


def normalize_time_fields(data: dict):
    date_str = data.get('_car_date', '')
    if not date_str:
        date_str = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
    for key in ('CarTime', 'EndTime'):
        val = data.get(key, '').strip()
        if val and re.match(r'^\d{1,2}:\d{2}$', val):
            data[key] = f"{date_str} {val}"
        elif not val:
            data[key] = f"{date_str} {'07:30' if key == 'CarTime' else '20:30'}"


# ============================================================
# 派车列表解析（OCR 后处理）
# ============================================================

DISPATCH_COLUMNS = [
    ('vehicle_no',     '车辆',       100),
    ('vehicle_name',   '车辆名称',   100),
    ('applicant',      '申请人',     80),
    ('seat',           '座位',       60),
    ('start_time',     '开始时间',   130),
    ('end_time',       '结束时间',   130),
    ('from_location',  '发车地',     100),
    ('to_location',    '目的地',     100),
    ('status',         '状态',       80),
    ('action',         '操作',       80),
]

# 状态/操作等关键词（用于 OCR 文本与字段映射）
_KNOWN_STATUS = {'已安排', '已派车', '已出车', '已返回', '已取消', '待审核', '未安排', '已完成', '已派', '出车中', '未出车'}
_KNOWN_ACTIONS = {'拼车', '查看', '编辑', '取消', '改派', '详情', '完成', '确认'}

# 常见车辆类型关键词（用于识别"车辆名称"列）
_VEHICLE_NAME_KEYWORDS = (
    '客车', '轿车', '商务', 'SUV', '越野', '皮卡', '面包', '中巴', '大巴',
    '轿车', '小型', '中型', '大型', '微型', '豪华', '普通', '标准'
)
_VEHICLE_NAME_RE = re.compile(
    r'^(?:[\u4e00-\u9fa5]*(?:' + '|'.join(_VEHICLE_NAME_KEYWORDS) + r')[\u4e00-\u9fa5]*)$'
)

# 车牌号正则：1 个汉字 + 1~2 个大写字母 + 4~6 位字母数字
_PLATE_RE = re.compile(r'[\u4e00-\u9fa5][A-Z]{1,2}[0-9A-Z]{4,6}')
# 行首车牌号
_PLATE_LINE_RE = re.compile(r'^[\u4e00-\u9fa5][A-Z]{1,2}[0-9A-Z]{4,6}$')

# 表头关键词
_HEADER_KEYWORDS = ['车辆', '车辆名称', '申请人', '座位', '用车时间', '发车地', '目的地', '状态', '操作']


def _is_header_line(line: str) -> bool:
    """判断一行是否包含表头关键词"""
    if not line:
        return False
    cnt = sum(1 for kw in _HEADER_KEYWORDS if kw in line)
    return cnt >= 2  # 至少 2 个表头词


def _tokenize_dispatch_text(ocr_text: str) -> list:
    """
    把 OCR 文本切成 token 列表。
    策略：
    1. 先按换行切，得到行列表
    2. 跳过表头行
    3. 每行再按空格切（处理"沪PDJ3770 大型客车 郭庆"这种段落式）
    4. 保留车牌号、时间字符串等不可分割的 token
    """
    raw_lines = [l.strip() for l in ocr_text.splitlines() if l.strip()]
    # 去掉表头行
    while raw_lines and _is_header_line(raw_lines[0]):
        raw_lines.pop(0)

    tokens = []
    for line in raw_lines:
        # 如果一整行是车牌号（OCR 把车牌单独识别成一行的常见情况）
        if _PLATE_LINE_RE.match(line):
            tokens.append(line)
            continue
        # 如果一整行是"开始:... 结束:..."形式（保留整行，下面再用正则提取）
        if ('开始' in line and '结束' in line) and ('08' in line or '09' in line or '10' in line or '1' in line or '2' in line):
            tokens.append(line)
            continue
        # 座位（数字/数字）
        if re.match(r'^\d+\s*/\s*\d+$', line):
            tokens.append(line)
            continue
        # 状态/操作
        if line in _KNOWN_STATUS or line in _KNOWN_ACTIONS:
            tokens.append(line)
            continue
        # 其他行按空格拆
        parts = re.split(r'\s+', line)
        for p in parts:
            p = p.strip()
            if p:
                tokens.append(p)
    return tokens


def _is_vehicle_name(token: str) -> bool:
    """判断 token 是否是车辆名称"""
    if not token or len(token) > 10 or len(token) < 2:
        return False
    if _PLATE_LINE_RE.match(token):
        return False
    return bool(_VEHICLE_NAME_RE.match(token)) or token in (
        '轿车', '客车', '商务车', 'SUV', '越野车', '面包车', '皮卡车',
    )


def _parse_time_in_token(token: str) -> tuple:
    """
    在单个 token 或 token 串中提取"开始:XX 结束:YY"。
    返回 (开始, 结束)。
    """
    start, end = '', ''
    m = re.search(r'开[\s]*始\s*[:：]?\s*(\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2})', token)
    if m:
        start = m.group(1).strip()
    m = re.search(r'结[\s]*束\s*[:：]?\s*(\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2})', token)
    if m:
        end = m.group(1).strip()
    return start, end


def _parse_seat_in_token(token: str) -> str:
    """座位字段: '1/33'"""
    m = re.match(r'^(\d+)\s*/\s*(\d+)$', token)
    return m.group(0) if m else ''


def _parse_dispatch_token_block(plate: str, tokens: list, log_cb=None) -> dict:
    """
    从一个 token 块中解析一条派车记录。
    tokens 是从车牌号开始到下一个车牌号前的所有 token。
    """
    def _log(msg, level="INFO"):
        if log_cb:
            log_cb(msg, level)

    record = {fid: '' for fid, _, _ in DISPATCH_COLUMNS}
    record['vehicle_no'] = plate

    # 强特征字段：座位、时间、状态、操作
    remaining = []
    for tk in tokens:
        # 跳过车牌号本身（虽然按理不应出现）
        if tk == plate:
            continue
        # 座位
        seat = _parse_seat_in_token(tk)
        if seat and not record['seat']:
            record['seat'] = seat
            continue
        # 时间（可能一个 token 含"开始"和"结束"两个时间）
        if '开始' in tk or '结束' in tk:
            s, e = _parse_time_in_token(tk)
            if s and not record['start_time']:
                record['start_time'] = s
            if e and not record['end_time']:
                record['end_time'] = e
            # 即使这个 token 还包含其他文本也继续（少见情况）
            if s or e:
                continue
        # 状态
        if tk in _KNOWN_STATUS and not record['status']:
            record['status'] = tk
            continue
        # 操作
        if tk in _KNOWN_ACTIONS and not record['action']:
            record['action'] = tk
            continue
        # 其他进待分配池
        remaining.append(tk)

    # 弱特征字段：车辆名称、申请人、发车地、目的地
    # 顺序逻辑：
    # 1. 车辆名称（特征词匹配）—— 一般紧跟车牌号
    # 2. 申请人（2~4 汉字纯人名）—— 排除已知地名词
    # 3. 发车地 —— 剩余第一个
    # 4. 目的地 —— 剩余第二个

    # 先抽取车辆名称
    name_idx = -1
    for idx, tk in enumerate(remaining):
        if _is_vehicle_name(tk):
            record['vehicle_name'] = tk
            name_idx = idx
            break

    # 抽取申请人：纯汉字 2~4 个，且不是已知地名/车辆类型
    _LOC_BLOCKLIST = {'本部', '青中心', '总校', '分校', '校区', '本部校区', '青中心校区',
                      '校内', '校外', '市区'}
    applicant_idx = -1
    for idx, tk in enumerate(remaining):
        if idx == name_idx:
            continue
        if re.match(r'^[\u4e00-\u9fa5]{2,4}$', tk) and tk not in _LOC_BLOCKLIST:
            record['applicant'] = tk
            applicant_idx = idx
            break

    # 剩余的短汉字 token 分配给发车地、目的地
    leftovers = [tk for idx, tk in enumerate(remaining)
                 if idx not in (name_idx, applicant_idx)
                 and re.match(r'^[\u4e00-\u9fa5]{1,10}$', tk)
                 and tk not in _KNOWN_STATUS and tk not in _KNOWN_ACTIONS]

    if leftovers:
        record['from_location'] = leftovers[0]
    if len(leftovers) >= 2:
        record['to_location'] = leftovers[1]

    return record


def _parse_dispatch_list_from_text(ocr_text: str, log_cb=None) -> list:
    """
    把派车列表 OCR 文本解析为记录列表。
    每条记录是一个 dict（key 见 DISPATCH_COLUMNS）。

    智能处理：
    - 行式（EasyOCR detail=0, paragraph=False）：每行一个字段
    - 段落式（paragraph=True）：一行多字段
    - 混合：一段多行，行内空格分隔
    """
    def _log(msg, level="INFO"):
        if log_cb:
            log_cb(msg, level)

    _log("开始解析派车列表 OCR 文本...", "STEP")
    if not ocr_text or not ocr_text.strip():
        _log("OCR 文本为空", "WARN")
        return []

    raw_lines = [l.strip() for l in ocr_text.splitlines() if l.strip()]
    # 跳过表头行
    while raw_lines and _is_header_line(raw_lines[0]):
        _log(f"跳过表头行: {raw_lines[0]}", "INFO")
        raw_lines.pop(0)
    if not raw_lines:
        _log("未发现数据", "WARN")
        return []

    # 自动判断格式：段落式（每行有多个 token）还是行式（每行 1~2 个 token）
    avg_tokens_per_line = sum(len(re.split(r'\s+', l)) for l in raw_lines) / len(raw_lines)
    paragraph_mode = avg_tokens_per_line >= 4
    _log(f"检测到{'段落式' if paragraph_mode else '行式'}（平均每行 {avg_tokens_per_line:.1f} tokens）", "INFO")

    # 按行分组：找到"以车牌号开头"的行作为锚点
    # 行式：整行就是车牌号
    # 段落式：行首第一个 token 是车牌号
    plate_positions = []
    for i, l in enumerate(raw_lines):
        if _PLATE_LINE_RE.match(l):
            plate_positions.append(i)
        else:
            first_tok = re.split(r'\s+', l)[0] if l else ''
            if _PLATE_LINE_RE.match(first_tok):
                plate_positions.append(i)
    if not plate_positions:
        _log("未识别到任何车牌号，无法分组", "ERR")
        return []
    _log(f"找到 {len(plate_positions)} 个车牌号锚点", "INFO")

    # 按车牌号分组：每条记录 = 锚点行 + 之后到下一个锚点前的所有行
    groups = []
    for k, pos in enumerate(plate_positions):
        end_pos = plate_positions[k + 1] if k + 1 < len(plate_positions) else len(raw_lines)
        block_lines = raw_lines[pos:end_pos]
        if block_lines:
            # 把块内所有行合并成一个 token 列表
            # 关键：含"开始"或"结束"关键词的行（含时间）整行保留为一个 token，
            #     否则按空格切分会破坏时间字符串
            tokens = []
            for line in block_lines:
                if ('开始' in line or '结束' in line) and re.search(r'\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2}', line):
                    tokens.append(line)
                    continue
                for p in re.split(r'\s+', line):
                    p = p.strip()
                    if p:
                        tokens.append(p)
            groups.append(tokens)

    # 解析每组
    records = []
    for block in groups:
        # block[0] 可能是整行（行式）也可能是首 token（段落式）
        # 如果整行不是车牌号且只有一个 token（说明是段落式且整行被作为一个 token），
        # 需要把 block[0] 重新切分：保留"开始:XX 结束:YY"完整
        if not _PLATE_LINE_RE.match(block[0]) and len(block) == 1:
            line = block[0]
            tokens = []
            # 按"开始"/"结束"标签切分：保留含时间的完整子串
            time_pattern = r'(开[\s]*始\s*[:：]?\s*\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2})|(结[\s]*束\s*[:：]?\s*\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2})'
            time_parts = re.split(time_pattern, line)
            for p in time_parts:
                if p is None:
                    continue
                p = p.strip()
                if not p:
                    continue
                # 时间片段：整段保留
                if re.match(r'^开[\s]*始|^结[\s]*束', p):
                    tokens.append(p)
                else:
                    # 非时间片段：按空格切分
                    for sub in re.split(r'\s+', p):
                        sub = sub.strip()
                        if sub:
                            tokens.append(sub)
            block = tokens
        plate = block[0]
        rec = _parse_dispatch_token_block(plate, block, log_cb=log_cb)
        records.append(rec)
        _log(f"解析成功: {rec['vehicle_no']} / 车辆={rec['vehicle_name']} / "
             f"申请人={rec['applicant']} / 座位={rec['seat']} / "
             f"{rec['from_location']}→{rec['to_location']} / {rec['status']}", "OK")

    _log(f"共解析出 {len(records)} 条派车记录", "OK")
    return records


# 兼容性别名
parse_dispatch_list_from_text = _parse_dispatch_list_from_text


# ============================================================
# 通用智能提取框架（多模板自动识别 + 关键词兜底）
# ============================================================

# ── 字段关键词字典（用于通用兜底提取）─────────────────
# 每个字段对应一组关键词，OCR 文本中命中关键词后，提取关键词右侧/下方的值
FIELD_KEYWORDS = {
    'Contacts':       ['申请人', '用车人姓名', '用车人', '姓名', '联系人', '经办人'],
    'PersonMobile':   ['申请人手机', '用车人手机', '手机号', '手机', '联系电话', '联系方式', '电话'],
    'StartAdress':    ['出发地点', '出发地', '发车地', '起点', '出发'],
    'EndAdress':      ['到达地点', '目的地', '到达地', '终点', '到达'],
    'CarTime':        ['用车开始时间', '开始时间', '用车时间', '出发时间', '开始'],
    'EndTime':        ['用车结束时间', '结束时间', '返回时间', '回程时间', '结束'],
    'Reason':         ['用车事由', '事由', '用途', '原因', '说明'],
    'PersonCount':    ['乘车人数', '人数', '随车人数', '人数合计'],
    'ApplyOrganize':  ['申请单位', '单位', '申请部门', '部门'],
    'VehicleType':    ['车型', '车辆类型', '车种'],
    'CCRY2':          ['乘车人员2', '同行人员', '同行人'],
}


class _Template:
    """模板基类：定义检测与解析接口"""
    name = "基类"
    # 关键词：用于检测图片属于哪种模板
    detect_keywords = []
    # 检测阈值：命中关键词比例 >= 此值才认为是该模板
    min_score = 0.4

    @classmethod
    def detect(cls, ocr_text: str) -> float:
        """返回匹配度 0.0~1.0"""
        if not cls.detect_keywords or not ocr_text:
            return 0.0
        hits = sum(1 for kw in cls.detect_keywords if kw in ocr_text)
        return hits / len(cls.detect_keywords)

    @classmethod
    def parse(cls, ocr_text: str, log_cb=None):
        """子类实现：返回 dict（单条记录）或 list[dict]（多条记录）"""
        raise NotImplementedError


class _ApplicationFormTemplate(_Template):
    """用车申请单模板"""
    name = "申请单"
    detect_keywords = ['用车申请', '申请人', '用车人姓名', '用车日期', '出发地点', '到达地点', '用车事由', '乘车人数']
    min_score = 0.4

    @classmethod
    def parse(cls, ocr_text: str, log_cb=None):
        def _log(msg, level="INFO"):
            if log_cb:
                log_cb(msg, level)
        _log("应用【申请单】模板解析...", "STEP")
        data = parse_form_data_from_text(ocr_text, log_cb=log_cb)
        normalize_time_fields(data)
        return data


class _DispatchListTemplate(_Template):
    """派车列表模板"""
    name = "派车列表"
    detect_keywords = ['车辆', '车辆名称', '申请人', '座位', '用车时间', '发车地', '目的地', '状态', '操作']
    min_score = 0.5  # 派车列表关键词更具体，要求更高

    @classmethod
    def parse(cls, ocr_text: str, log_cb=None):
        def _log(msg, level="INFO"):
            if log_cb:
                log_cb(msg, level)
        _log("应用【派车列表】模板解析...", "STEP")
        return _parse_dispatch_list_from_text(ocr_text, log_cb=log_cb)


# 模板注册表（顺序代表优先级）
_TEMPLATES = [
    _DispatchListTemplate,    # 派车列表优先（关键词更具体）
    _ApplicationFormTemplate, # 申请单其次
]


def _parse_generic_by_keywords(ocr_text: str, log_cb=None) -> dict:
    """
    通用兜底提取：扫描文本，按字段关键词附近提取值。
    返回 dict（部分字段可能为空）。
    """
    def _log(msg, level="INFO"):
        if log_cb:
            log_cb(msg, level)

    _log("启动通用关键词提取（兜底模式）...", "STEP")
    result = {}
    lines = [l.strip() for l in ocr_text.splitlines() if l.strip()]
    full_text = "\n".join(lines)

    for field, keywords in FIELD_KEYWORDS.items():
        for kw in keywords:
            # 模式 1：关键词后跟分隔符再跟值（同行）
            # 例："申请人：张三" "申请人 张三" "申请人:张三"
            m = re.search(rf'{re.escape(kw)}\s*[:：\s]\s*([^\s\n]+)', full_text)
            if m:
                val = m.group(1).strip().rstrip('*').strip()
                if val and val not in result:
                    result[field] = val
                    _log(f"  {field} = {val}（关键词 '{kw}' 同行）", "OK")
                    break

            # 模式 2：关键词独占一行，下一行是值
            for i, line in enumerate(lines):
                if kw in line and i + 1 < len(lines):
                    next_line = lines[i + 1].strip().rstrip('*').strip()
                    # 值不能是其他字段的关键词
                    if next_line and not any(other_kw in next_line for other_kws in FIELD_KEYWORDS.values() for other_kw in other_kws if other_kw != kw):
                        if field not in result:
                            result[field] = next_line
                            _log(f"  {field} = {next_line}（关键词 '{kw}' 下一行）", "OK")
                            break
            if field in result:
                break

    # 时间字段特殊处理：把日期+时间合并
    if result.get('CarTime') and not re.search(r'\d{1,2}:\d{2}', result['CarTime']):
        # 只有 HH:MM 没日期，尝试找日期
        m = re.search(r'(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{8})', full_text)
        if m:
            date_str = _norm_date(m.group(1)) if '_norm_date' in globals() else m.group(1)
            result['CarTime'] = f"{date_str} {result['CarTime']}"
    if result.get('EndTime') and not re.search(r'\d{1,2}:\d{2}', result['EndTime']):
        m = re.search(r'(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{8})', full_text)
        if m:
            date_str = _norm_date(m.group(1)) if '_norm_date' in globals() else m.group(1)
            result['EndTime'] = f"{date_str} {result['EndTime']}"

    # ── 规则 1：出发地址永远为"零陵路453号"（强制覆盖）──
    result['StartAdress'] = '零陵路453号'

    # ── 规则 2：用车事由为空时填"开会或者单位学习" ──
    if not result.get('Reason', '').strip():
        result['Reason'] = '开会或者单位学习'

    _log(f"通用提取共识别 {len(result)} 个字段", "OK")
    return result


def auto_extract_from_ocr_text(ocr_text: str, log_cb=None) -> dict:
    """
    通用智能提取入口：
    1. 检测图片属于哪种模板（按关键词命中度）
    2. 命中模板则用模板解析
    3. 都不命中则用通用关键词兜底

    返回 dict：
      {
        'template': '模板名' or '通用兜底' or '未知',
        'data': dict 或 list[dict],
        'is_list': bool,  # 是否为多记录格式
      }
    """
    def _log(msg, level="INFO"):
        if log_cb:
            log_cb(msg, level)

    if not ocr_text or not ocr_text.strip():
        _log("OCR 文本为空，无法提取", "WARN")
        return {'template': '空', 'data': {}, 'is_list': False}

    _log("开始模板检测...", "STEP")
    # 计算各模板匹配度
    scored = []
    for tpl in _TEMPLATES:
        score = tpl.detect(ocr_text)
        scored.append((tpl, score))
        _log(f"  模板【{tpl.name}】匹配度 = {score:.2f}（阈值 {tpl.min_score}）", "INFO")

    # 选最高分且过阈值的
    best_tpl, best_score = max(scored, key=lambda x: x[1])
    if best_score >= best_tpl.min_score:
        _log(f"选中模板【{best_tpl.name}】（匹配度 {best_score:.2f}）", "OK")
        data = best_tpl.parse(ocr_text, log_cb=log_cb)
        is_list = isinstance(data, list)
        return {'template': best_tpl.name, 'data': data, 'is_list': is_list}

    # 全部不达标 → 通用兜底
    _log(f"所有模板匹配度均低于阈值，退化到通用关键词提取", "WARN")
    data = _parse_generic_by_keywords(ocr_text, log_cb=log_cb)
    return {'template': '通用兜底', 'data': data, 'is_list': False}


# ============================================================
# Selenium 相关
# ============================================================

from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

# ── 从 config.json 读取登录信息（密码变更时只需改此文件）──
def _load_config():
    cfg_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.json")
    default = {"url": "https://www.xuhui.gov.cn/gzfwpt/index.jsp",
               "username": "18917981529", "password": "Gzfwpt2020"}
    try:
        with open(cfg_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)
            default.update(cfg)
    except (FileNotFoundError, json.JSONDecodeError):
        pass
    return default

_login_cfg = _load_config()
URL      = _login_cfg["url"]
USERNAME = _login_cfg["username"]
PASSWORD = _login_cfg["password"]


def _driver_alive(driver):
    """检查 WebDriver 实例是否仍然存活（浏览器未被关闭）"""
    try:
        _ = driver.title
        return True
    except Exception:
        return False


def run_selenium_fill(data: dict, log_cb, on_need_manual_add, on_done,
                      existing_driver=None):
    """
    在子线程中运行 Selenium 填写逻辑。
    existing_driver: 传入已有的 driver 实例可跳过启动/登录，直接填表（复用浏览器）
    on_need_manual_add: 找不到"添加"按钮时回调（让界面弹窗等用户点击）
    on_done: 完成后回调(success: bool, msg: str, driver_instance)
             driver_instance 供界面保存，下次复用
    """
    def log(msg, level="INFO"):
        log_cb(msg, level)

    driver = None
    try:
        if existing_driver is not None:
            # ── 复用已有浏览器 ──────────────────────────
            driver = existing_driver
            # 检测 driver 是否仍然存活
            try:
                _ = driver.title  # 如果浏览器已关闭会抛异常
                log("复用已有浏览器，跳过启动和登录", "OK")
            except Exception:
                log("已有浏览器已关闭，重新启动...", "WARN")
                driver = None  # 下面走新建流程

        if driver is None:
            # ── 新建浏览器 + 登录 ───────────────────────
            options = Options()
            options.headless = False

            log("正在启动 Firefox 浏览器...", "STEP")
            try:
                driver = webdriver.Firefox(options=options)
                log("Firefox 启动成功", "OK")
            except Exception as e:
                log(f"Firefox 启动失败: {e}", "ERR")
                on_done(False, f"Firefox 启动失败:\n{e}", None)
                return

        wait = WebDriverWait(driver, 15)
        # 标记是否是复用已有浏览器（影响是否执行完整导航/登录）
        _driver_alive_flag = (existing_driver is not None)

        try:
            # ── 新建浏览器时：打开网站 + 登录 ───────────────
            if existing_driver is None or not _driver_alive(driver):
                log(f"打开网站: {URL}", "STEP")
                driver.get(URL)
                time.sleep(8)
                log(f"页面加载完成: {driver.title}", "OK")

                # 登录
                log("开始登录...", "STEP")
                try:
                    login_entry = WebDriverWait(driver, 8).until(
                        EC.element_to_be_clickable(
                            (By.XPATH, "//a[contains(text(),'登录')] | //button[contains(text(),'登录')]")
                        )
                    )
                    login_entry.click()
                    log("已点击登录入口", "OK")
                    time.sleep(3)
                except:
                    log("未找到登录入口，直接查找输入框", "WARN")

                username_input = wait.until(EC.visibility_of_element_located(
                    (By.XPATH,
                     "//input[@type='text' or @type='tel' or @name='username' or @id='username'"
                     " or contains(@placeholder,'用户') or contains(@placeholder,'账号')"
                     " or contains(@placeholder,'手机')]")
                ))
                username_input.clear()
                username_input.send_keys(USERNAME)
                log(f"已输入用户名: {USERNAME}", "OK")

                password_input = wait.until(
                    EC.visibility_of_element_located((By.XPATH, "//input[@type='password']"))
                )
                password_input.clear()
                password_input.send_keys(PASSWORD)
                log("已输入密码", "OK")

                try:
                    submit = driver.find_element(
                        By.XPATH,
                        "//button[@type='submit'] | //button[contains(text(),'登录')] | //input[@type='submit']"
                    )
                    submit.click()
                    log("已点击登录按钮", "OK")
                except:
                    password_input.send_keys(Keys.RETURN)
                    log("已按回车登录", "OK")

                time.sleep(5)
                log(f"登录完成！当前页面: {driver.title}", "OK")
                driver.save_screenshot("debug_after_login.png")

            # 导航 - 完全复制完整自动化.py 的 find_and_click 逻辑
            def _find_and_click(text):
                log(f"查找并点击【{text}】...", "INFO")
                driver.switch_to.default_content()
                # 先在主页面搜索（可点击）
                try:
                    el = WebDriverWait(driver, 5).until(
                        EC.element_to_be_clickable((By.XPATH, f"//*[contains(text(),'{text}')]"))
                    )
                    driver.execute_script("arguments[0].click();", el)
                    log(f"已在主页面点击【{text}】", "OK")
                    driver.switch_to.default_content()
                    return True
                except:
                    pass
                # 在所有 iframe 中搜索（只要存在即可，不需要可点击）
                iframes = driver.find_elements(By.TAG_NAME, "iframe")
                for i, iframe in enumerate(iframes):
                    try:
                        driver.switch_to.default_content()
                        driver.switch_to.frame(iframe)
                        try:
                            el = WebDriverWait(driver, 3).until(
                                EC.presence_of_element_located((By.XPATH, f"//*[contains(text(),'{text}')]"))
                            )
                            driver.execute_script("arguments[0].click();", el)
                            log(f"已在iframe[{i}]中点击【{text}】", "OK")
                            driver.switch_to.default_content()
                            return True
                        except:
                            pass
                        # 嵌套 iframe（第二层）
                        inner_iframes = driver.find_elements(By.TAG_NAME, "iframe")
                        for j, inner in enumerate(inner_iframes):
                            try:
                                driver.switch_to.default_content()
                                driver.switch_to.frame(iframe)
                                driver.switch_to.frame(inner)
                                try:
                                    el = WebDriverWait(driver, 2).until(
                                        EC.presence_of_element_located((By.XPATH, f"//*[contains(text(),'{text}')]"))
                                    )
                                    driver.execute_script("arguments[0].click();", el)
                                    log(f"已在iframe[{i}][{j}]中点击【{text}】", "OK")
                                    driver.switch_to.default_content()
                                    return True
                                except:
                                    pass
                            except:
                                pass
                    except:
                        driver.switch_to.default_content()
                log(f"未找到【{text}】", "WARN")
                return False

            log("开始导航...", "STEP")
            if existing_driver is None or not _driver_alive_flag:
                # 首次：完整导航
                _find_and_click("使用智慧管家")
                time.sleep(3)
                _find_and_click("公车管理")
                time.sleep(3)
                _find_and_click("车辆派遣")
                time.sleep(3)
            # 每次都点用车申请，确保列表刷新
            _find_and_click("用车申请")
            time.sleep(5)  # 等待用车申请列表页完全加载

            # ── 点击"添加" ──────────────────────────────────
            # EasyUI 按钮结构：<a class="l-btn ..."><span class="l-btn-left">
            #                    <span class="l-btn-text">添加</span></span></a>
            # 需要在所有 iframe（含嵌套）中搜索
            log("查找【添加】按钮...", "STEP")

            # 调试信息：检查当前页面状态
            current_url = driver.current_url
            current_title = driver.title
            log(f"当前页面 URL: {current_url}", "INFO")
            log(f"当前页面标题: {current_title}", "INFO")

            driver.save_screenshot("debug_before_search_add.png")
            log("已保存调试截图: debug_before_search_add.png", "INFO")
            added = False

            ADD_XPATHS = [
                # EasyUI l-btn-text span（精确匹配）
                "//span[contains(@class,'l-btn-text') and normalize-space(text())='添加']",
                # 任意含"添加"文字的可点击元素（normalize-space 去空格）
                "//*[normalize-space(text())='添加']",
                # 包含"添加"文字（模糊匹配）
                "//*[contains(text(),'添加')]",
                # EasyUI 按钮：div 包含 l-btn 类且有"添加"文字的子元素
                "//div[contains(@class,'l-btn') and .//*[contains(text(),'添加')]]",
                # EasyUI 按钮：a 包含 l-btn 类且有"添加"文字的子元素
                "//a[contains(@class,'l-btn') and .//*[contains(text(),'添加')]]",
                # 完全匹配完整自动化.py 的逻辑（虽然可能有问题）
                "//div[contains(@class,'l-btn-text') and contains(text(),'添加')]/..",
                # 最通用的：查找所有包含"添加"的 <a> 标签
                "//a[contains(text(),'添加')]",
            ]

            def _click_add_in_context(context_name=""):
                """在当前 iframe 上下文中尝试所有 xpath 查找并点击【添加】"""
                # 记录点击前的 iframe 数量（用于判断是否弹出了新 iframe/dialog）
                iframes_before = len(driver.find_elements(By.TAG_NAME, "iframe"))

                # 先尝试 xpath 查找
                for idx, xpath in enumerate(ADD_XPATHS):
                    try:
                        el = WebDriverWait(driver, 2).until(
                            EC.presence_of_element_located((By.XPATH, xpath))
                        )
                        log(f"在{context_name}找到元素，xpath[{idx}]={xpath[:50]}...", "INFO")
                        driver.execute_script("arguments[0].scrollIntoView(true);", el)
                        # 点击
                        driver.execute_script("arguments[0].click();", el)

                        # 等待弹窗出现
                        time.sleep(3)

                        # 验证：检查是否弹出了新的 iframe（EasyUI dialog 通常会新建 iframe）
                        driver.switch_to.default_content()
                        iframes_after = len(driver.find_elements(By.TAG_NAME, "iframe"))
                        if iframes_after > iframes_before:
                            log(f"检测到新增 iframe（{iframes_before}→{iframes_after}），表单可能已弹出", "OK")
                            # 在新 iframe 中查找 PersonCount
                            for k in range(iframes_before, iframes_after):
                                try:
                                    driver.switch_to.default_content()
                                    all_iframes = driver.find_elements(By.TAG_NAME, "iframe")
                                    driver.switch_to.frame(all_iframes[k])
                                    try:
                                        driver.find_element(By.ID, "PersonCount")
                                        log(f"表单已在新iframe[{k}]中打开", "OK")
                                        driver.save_screenshot("debug_form_new_iframe.png")
                                        return True
                                    except:
                                        pass
                                    # 检查嵌套
                                    inner_iframes = driver.find_elements(By.TAG_NAME, "iframe")
                                    for m, inner in enumerate(inner_iframes):
                                        try:
                                            driver.switch_to.default_content()
                                            all_iframes = driver.find_elements(By.TAG_NAME, "iframe")
                                            driver.switch_to.frame(all_iframes[k])
                                            driver.switch_to.frame(inner)
                                            try:
                                                driver.find_element(By.ID, "PersonCount")
                                                log(f"表单已在新iframe[{k}][{m}]中打开", "OK")
                                                driver.save_screenshot("debug_form_new_iframe.png")
                                                return True
                                            except:
                                                pass
                                        except:
                                            pass
                                except:
                                    pass

                        # 即使没有新增 iframe，也检查所有现有 iframe 中是否有新的 PersonCount
                        # （可能表单是覆盖在已有 iframe 中打开的）
                        for i, ifr in enumerate(driver.find_elements(By.TAG_NAME, "iframe")):
                            try:
                                driver.switch_to.default_content()
                                driver.switch_to.frame(ifr)
                                try:
                                    driver.find_element(By.ID, "PersonCount")
                                    log(f"点击【添加】后表单已在iframe[{i}]中加载", "OK")
                                    driver.save_screenshot("debug_form_visible_iframe.png")
                                    return True
                                except:
                                    pass
                                inner_iframes = driver.find_elements(By.TAG_NAME, "iframe")
                                if inner_iframes:
                                    for j, inner in enumerate(inner_iframes):
                                        try:
                                            driver.switch_to.default_content()
                                            driver.switch_to.frame(ifr)
                                            driver.switch_to.frame(inner)
                                            try:
                                                driver.find_element(By.ID, "PersonCount")
                                                log(f"点击【添加】后表单已在iframe[{i}][{j}]中加载", "OK")
                                                driver.save_screenshot("debug_form_visible_iframe.png")
                                                return True
                                            except:
                                                pass
                                        except:
                                            pass
                                driver.switch_to.default_content()
                            except:
                                driver.switch_to.default_content()

                        # 表单未找到，继续尝试其他 xpath
                        log(f"xpath[{idx}] 点击后未找到表单，继续尝试...", "DEBUG")
                    except Exception as e:
                        log(f"xpath[{idx}] 查找失败: {e}", "DEBUG")

                # xpath 都找不到，尝试 JavaScript 查找
                try:
                    js_code = """
                    // 查找所有包含"添加"文字的元素
                    var elements = document.getElementsByTagName('*');
                    for (var i = 0; i < elements.length; i++) {
                        var text = elements[i].textContent || elements[i].innerText || '';
                        if (text.trim() === '添加' || text.indexOf('添加') >= 0) {
                            // 优先选择 <a> 或 <button> 或带 l-btn 类的元素
                            var tag = elements[i].tagName.toLowerCase();
                            var cls = elements[i].className || '';
                            if (tag === 'a' || tag === 'button' || cls.indexOf('l-btn') >= 0) {
                                elements[i].scrollIntoView(true);
                                elements[i].click();
                                return true;
                            }
                        }
                    }
                    return false;
                    """
                    result = driver.execute_script(js_code)
                    if result:
                        log(f"在{context_name}用 JavaScript 找到并点击【添加】", "INFO")
                        # JavaScript 点击后也需要验证
                        time.sleep(3)
                        try:
                            driver.switch_to.default_content()
                            person_count_el = WebDriverWait(driver, 3).until(
                                EC.presence_of_element_located((By.ID, "PersonCount"))
                            )
                            log(f"JavaScript 点击后表单已加载", "OK")
                            return True
                        except:
                            pass
                except Exception as e:
                    log(f"JavaScript 查找失败: {e}", "WARN")

                return False

            # 直接在 iframe 中搜索"添加"按钮（主页面可能有其他"添加"文字干扰）
            driver.switch_to.default_content()
            top_iframes = driver.find_elements(By.TAG_NAME, "iframe")
            log(f"主页面共 {len(top_iframes)} 个 iframe，逐一搜索【添加】按钮...", "INFO")
            for i, iframe in enumerate(top_iframes):
                if added:
                    break
                try:
                    driver.switch_to.default_content()
                    driver.switch_to.frame(iframe)
                    # 调试信息
                    try:
                        iframe_url = driver.current_url
                        log(f"iframe[{i}] URL: {iframe_url[:80]}...", "INFO")
                    except:
                        pass
                    try:
                        iframe_src = iframe.get_attribute('src')
                        if iframe_src:
                            log(f"iframe[{i}] src: {iframe_src[:80]}...", "INFO")
                    except:
                        pass

                    log(f"正在 iframe[{i}] 中搜索【添加】按钮...", "INFO")
                    if _click_add_in_context(f"iframe[{i}]"):
                        log(f"已在 iframe[{i}] 中点击【添加】", "OK")
                        added = True
                        break  # 跳出一层 iframe 循环

                    # 二层 iframe（嵌套）
                    inner_iframes = driver.find_elements(By.TAG_NAME, "iframe")
                    log(f"iframe[{i}] 中还有 {len(inner_iframes)} 个嵌套 iframe", "INFO")
                    for j, inner in enumerate(inner_iframes):
                        if added:  # 如果已经找到，直接退出二层循环
                            break
                        try:
                            driver.switch_to.default_content()
                            driver.switch_to.frame(iframe)
                            driver.switch_to.frame(inner)
                            log(f"正在 iframe[{i}][{j}] 中搜索【添加】按钮...", "INFO")
                            if _click_add_in_context(f"iframe[{i}][{j}]"):
                                log(f"已在 iframe[{i}][{j}] 中点击【添加】", "OK")
                                added = True
                                break  # 跳出二层 iframe 循环
                        except Exception as e:
                            log(f"iframe[{i}][{j}] 搜索失败: {e}", "WARN")
                    if added:
                        break  # 跳出一层 iframe 循环
                except Exception as e:
                    log(f"iframe[{i}] 搜索失败: {e}", "WARN")
                    driver.switch_to.default_content()

            if not added:
                log("未找到【添加】按钮，请手动点击后在界面上确认", "WARN")
                event = threading.Event()
                on_need_manual_add(event)
                event.wait()
                log("用户已确认，继续...", "OK")

            time.sleep(4)
            driver.save_screenshot("debug_form_opened.png")

            # 定位表单 iframe（完全复制完整自动化.py 的逻辑）
            log("定位表单所在 iframe...", "STEP")
            def _find_form_iframe():
                driver.switch_to.default_content()
                # 先在主页面搜索
                try:
                    el = driver.find_element(By.ID, "PersonCount")
                    if el:
                        log("表单在主页面中", "INFO")
                        return None
                except:
                    pass
                # 一层 iframe
                iframes = driver.find_elements(By.TAG_NAME, "iframe")
                log(f"共发现 {len(iframes)} 个iframe，逐一搜索表单...", "INFO")
                for i, iframe in enumerate(iframes):
                    try:
                        driver.switch_to.default_content()
                        driver.switch_to.frame(iframe)
                        try:
                            el = driver.find_element(By.ID, "PersonCount")
                            if el:
                                log(f"表单在iframe[{i}]中", "OK")
                                return i
                        except:
                            pass
                        # 嵌套 iframe（第二层）
                        inner_iframes = driver.find_elements(By.TAG_NAME, "iframe")
                        for j, inner in enumerate(inner_iframes):
                            try:
                                driver.switch_to.frame(inner)
                                try:
                                    el = driver.find_element(By.ID, "PersonCount")
                                    if el:
                                        log(f"表单在iframe[{i}][{j}]中", "OK")
                                        return (i, j)
                                except:
                                    pass
                                driver.switch_to.default_content()
                                driver.switch_to.frame(iframes[i])
                            except:
                                driver.switch_to.default_content()
                                driver.switch_to.frame(iframes[i])
                    except:
                        driver.switch_to.default_content()
                driver.switch_to.default_content()
                log("未能在任何iframe中找到表单，将在当前上下文尝试填写", "WARN")
                return None

            def _switch_to_form(form_loc):
                driver.switch_to.default_content()
                if form_loc is None:
                    return
                iframes = driver.find_elements(By.TAG_NAME, "iframe")
                if isinstance(form_loc, tuple):
                    i, j = form_loc
                    driver.switch_to.frame(iframes[i])
                    inner_iframes = driver.find_elements(By.TAG_NAME, "iframe")
                    driver.switch_to.frame(inner_iframes[j])
                else:
                    driver.switch_to.frame(iframes[form_loc])

            form_loc = _find_form_iframe()
            _switch_to_form(form_loc)
            time.sleep(1)

            # 填写文本字段
            def fill_text(fid, val):
                if not val:
                    return False
                js = """
                var id=arguments[0], val=arguments[1];
                var ids=[id];
                if(id==='EndAdress') ids.push('EndAddress','endAdress','endAddress','to_location');
                if(id==='StartAdress') ids.push('StartAddress','startAdress','startAddress','from_location');
                
                for(var k=0; k<ids.length; k++){
                    var curId=ids[k];
                    if(typeof jQuery!=='undefined'){
                        var $e=jQuery('#'+curId);
                        if($e.length){
                            try{ $e.textbox('setValue',val); return 'easyui_ok:'+curId; }catch(e){}
                            try{ $e.numberbox('setValue',val); return 'easyui_numberbox_ok:'+curId; }catch(e){}
                        }
                    }
                    var c=document.getElementById(curId)||document.querySelector('[name=\"'+curId+'\"]');
                    if(c){
                        var inp=c.querySelector('input.textbox-text')||c.querySelector('input:not([type=\"hidden\"])')||(c.tagName==='INPUT'?c:null);
                        if(inp){
                            inp.removeAttribute('readonly'); inp.removeAttribute('disabled');
                            inp.value=val;
                            ['input','change','blur'].forEach(function(t){ inp.dispatchEvent(new Event(t,{bubbles:true})); });
                            return 'dom_ok:'+curId;
                        }
                    }
                }
                return 'not_found';
                """
                try:
                    res = driver.execute_script(js, fid, val)
                    if res and 'ok' in res:
                        log(f"已填写 {fid} = {val} ({res})", "OK")
                        return True
                    log(f"填写 {fid} 返回: {res}", "WARN")
                except Exception as e:
                    log(f"填写 {fid} 失败: {e}", "WARN")
                return False


            def fill_datetime(fid, val):
                if not val:
                    return
                js = """
                var id=arguments[0], val=arguments[1];
                if(typeof jQuery!=='undefined'){
                    var $e=jQuery('#'+id);
                    if($e.length){
                        try{ $e.datetimebox('setValue',val); return 'ok'; }catch(e){}
                    }
                }
                var c=document.getElementById(id);
                if(!c) return 'not_found';
                var inp=c.querySelector('input.textbox-text')||c.querySelector('input:not([type="hidden"])');
                if(inp){ inp.removeAttribute('readonly'); inp.value=val; inp.dispatchEvent(new Event('input',{bubbles:true})); }
                return 'ok';
                """
                try:
                    driver.execute_script(js, fid, val)
                    log(f"已填写时间 {fid} = {val}", "OK")
                except Exception as e:
                    log(f"填写时间 {fid} 失败: {e}", "WARN")

            def fill_combobox(fid, keyword="", index=0):
                # 主方法：用指定 ID 查找
                js = """
                var id=arguments[0], kw=arguments[1], idx=arguments[2];
                if(typeof jQuery==='undefined') return 'no_jquery';
                var $f=jQuery('#'+id);
                if(!$f.length) return 'not_found';
                try{
                    if(kw){
                        // 先尝试 select（精确），再尝试 setText（模糊）
                        try{ $f.combobox('select',kw); }catch(e){
                            try{
                                var d=$f.combobox('getData');
                                var matched=null;
                                for(var i=0;i<d.length;i++){
                                    if((d[i].text||'').indexOf(kw)>=0||(d[i].value||'').indexOf(kw)>=0){
                                        matched=d[i]; break;
                                    }
                                }
                                if(matched){ $f.combobox('setValue',matched.value); }
                                else if(d&&d.length>idx){ $f.combobox('setValue',d[idx].value); }
                            }catch(e2){}
                        }
                    } else {
                        var d=$f.combobox('getData');
                        if(d&&d.length>idx){ $f.combobox('setValue',d[idx].value); }
                    }
                    return 'ok';
                }catch(e){ return 'err:'+e.message; }
                """
                try:
                    res = driver.execute_script(js, fid, keyword, index)
                    if res == 'ok':
                        log(f"下拉框 {fid} 已选择", "OK")
                        return True
                    elif res == 'not_found':
                        # ID 找不到 —— 自动扫描表单中所有 combobox，尝试用关键词匹配
                        log(f"下拉框 {fid} not_found，尝试扫描表单所有下拉框...", "WARN")
                        scan_js = """
                        var kw=arguments[0], idx=arguments[1];
                        if(typeof jQuery==='undefined') return {status:'no_jquery'};
                        // 收集所有带 combobox-f 类的隐藏 input（EasyUI combobox 内核）
                        var found=[];
                        jQuery('input.combobox-f, select').each(function(){
                            var $p=$(this).closest('.combo,div[id]');
                            var pid=$p.attr('id')||$(this).attr('id')||'';
                            found.push({id:pid, name:$(this).attr('name')||''});
                        });
                        // 也找所有有 combobox 数据的元素
                        var tried=[];
                        jQuery('[id]').each(function(){
                            var $e=$(this);
                            try{
                                var d=$e.combobox('getData');
                                if(d&&d.length>0){
                                    var eid=$(this).attr('id');
                                    tried.push(eid);
                                    if(kw){
                                        for(var i=0;i<d.length;i++){
                                            if((d[i].text||'').indexOf(kw)>=0||(d[i].value||'').indexOf(kw)>=0){
                                                $e.combobox('setValue',d[i].value);
                                                return {status:'ok_scan', id:eid, val:d[i].value};
                                            }
                                        }
                                    } else {
                                        if(d.length>idx){
                                            $e.combobox('setValue',d[idx].value);
                                            return {status:'ok_scan', id:eid, val:d[idx].value};
                                        }
                                    }
                                }
                            }catch(e){}
                        });
                        return {status:'scan_failed', tried:tried.join(',')};
                        """
                        try:
                            scan_res = driver.execute_script(scan_js, keyword, index)
                            if isinstance(scan_res, dict):
                                if scan_res.get('status') == 'ok_scan':
                                    log(f"下拉框 {fid} → 扫描到真实ID={scan_res.get('id')}，已选择: {scan_res.get('val')}", "OK")
                                    return True
                                else:
                                    log(f"下拉框 {fid} 扫描失败，已尝试: {scan_res.get('tried','')}", "WARN")
                            else:
                                log(f"下拉框 {fid} 扫描返回: {scan_res}", "WARN")
                        except Exception as e2:
                            log(f"下拉框 {fid} 扫描异常: {e2}", "WARN")
                    else:
                        log(f"下拉框 {fid}: {res}", "WARN")
                except Exception as e:
                    log(f"下拉框 {fid} 失败: {e}", "WARN")
                return False

            # 诊断：打印表单中所有下拉框的 ID、字段名配置和选项
            def _diag_all_comboboxes():
                diag_js = """
                if(typeof jQuery==='undefined') return 'no_jquery';
                var result=[];
                jQuery('[id]').each(function(){
                    try{
                        var d=$(this).combobox('getData');
                        if(d&&d.length>0){
                            var opts_cfg=$(this).combobox('options');
                            var vf=(opts_cfg&&opts_cfg.valueField)||'value';
                            var tf=(opts_cfg&&opts_cfg.textField)||'text';
                            // 打印第一条数据的所有key
                            var firstKeys=Object.keys(d[0]).join(',');
                            var opts=d.slice(0,3).map(function(x){
                                return (x[tf]||x['text']||'?')+'='+(x[vf]||x['value']||'?');
                            }).join('|');
                            result.push($(this).attr('id')+'[vf='+vf+',tf='+tf+',keys='+firstKeys+']['+d.length+'项]:'+opts);
                        }
                    }catch(e){}
                });
                return result.join('; ');
                """
                try:
                    info = driver.execute_script(diag_js)
                    log(f"[诊断] 表单中所有下拉框: {info}", "INFO")
                except:
                    pass

            log("开始填写表单字段...", "STEP")
            _diag_all_comboboxes()  # 先打印所有下拉框ID，方便排查
            for fid, val in [
                ('PersonCount',  data.get('PersonCount', '')),
                ('Contacts',     data.get('Contacts', '')),
                ('PersonMobile', data.get('PersonMobile', '')),
                ('CCRY1',        data.get('CCRY1', '')),
                ('CCRY2',        data.get('CCRY2', '')),
                ('PersonName',   data.get('PersonName', '')),
                ('PersonTel',    data.get('PersonTel', '')),
                ('StartAdress',  data.get('StartAdress', '')),
                ('EndAdress',    data.get('EndAdress', '')),
                ('Reason',       data.get('Reason', '')),
            ]:
                fill_text(fid, val)
                time.sleep(0.3)

            fill_datetime("CarTime", data.get('CarTime', ''))
            time.sleep(0.5)
            fill_datetime("EndTime", data.get('EndTime', ''))
            time.sleep(0.5)

            # ── 通用：强制选中下拉框第一个有效选项 ──
            def _force_select_first(fid):
                """强制选中下拉框第一个有效选项，自动探测 value 字段名"""
                js = """
                var id=arguments[0];
                if(typeof jQuery==='undefined') return 'no_jquery';
                var $f=jQuery('#'+id);
                if(!$f.length) return 'not_found';
                try{
                    var d=$f.combobox('getData');
                    if(!d||!d.length) return 'no_data';
                    // 【关键】探测实际 value/text 字段名（不同系统字段名可能不同）
                    var firstItem=d[0];
                    var vField='value', tField='text';
                    // 探测 value 字段：EasyUI 默认叫 value，但有些系统叫 id/code 等
                    var opts=$f.combobox('options');
                    if(opts && opts.valueField) vField=opts.valueField;
                    if(opts && opts.textField) tField=opts.textField;
                    // 找第一个非空、非"全部"的选项
                    var sel=null;
                    for(var i=0;i<d.length;i++){
                        var t=(d[i][tField]||d[i]['text']||d[i]['label']||'').trim();
                        if(t&&t!=='--全部--'&&t!=='全部'&&t!=='请选择'){
                            sel=d[i]; break;
                        }
                    }
                    if(!sel) sel=d[0];
                    var v=sel[vField];
                    var t=sel[tField]||sel['text']||sel['label']||String(v);
                    // 方式1：EasyUI select（按 text 匹配，最可靠）
                    try{ $f.combobox('select', t); }catch(e){}
                    // 方式2：EasyUI setValue
                    try{ $f.combobox('setValue', v); }catch(e){}
                    try{ $f.combobox('setText', t); }catch(e){}
                    // 方式3：直接写入显示 input
                    var $wrap=$f.closest('.combo').length?$f.closest('.combo'):$f.parent();
                    $wrap.find('input.combo-text, input:not([type="hidden"])').first().val(t);
                    // 方式4：写入隐藏 input（提交用）
                    var $hid=$wrap.find('input[type="hidden"]').first();
                    if(!$hid.length) $hid=$f.next('input[type="hidden"]');
                    if($hid.length){ $hid.val(v); }
                    // 验证回读
                    var checkV=$f.combobox('getValue');
                    var checkT=$f.combobox('getText');
                    return 'ok:vField='+vField+',tField='+tField+' | val='+v+' | txt='+t+' | check='+checkV+'/'+checkT;
                }catch(e){ return 'err:'+e.message; }
                """
                try:
                    res = driver.execute_script(js, fid)
                    if res and res.startswith('ok:'):
                        log(f"下拉框 {fid} 已强制选中: {res[3:]}", "OK")
                        return True
                    else:
                        log(f"下拉框 {fid} 强制选中失败: {res}", "WARN")
                except Exception as e:
                    log(f"下拉框 {fid} 强制选中异常: {e}", "WARN")
                return False

            _force_select_first("ApplyOrganizeID")
            time.sleep(1)

            # ── 车型（VehicleType）：选第一个（小型蓝牌）──
            _force_select_first("VehicleType")
            time.sleep(1)

            # ── 用车事由（ReasonSel，不是UseReason）：默认选第0个或按OCR关键词 ──
            reason_kw = data.get('UseReason', '').strip()
            if not reason_kw:
                # 尝试从 Reason 字段推断（如"应急"→应急用车，"公务"→集体公务）
                reason_text = data.get('Reason', '')
                if '应急' in reason_text:
                    reason_kw = '应急用车'
                elif '接待' in reason_text or '重要' in reason_text:
                    reason_kw = '重要公务接待'
                else:
                    reason_kw = '集体公务'  # 默认
            fill_combobox("ReasonSel", keyword=reason_kw, index=0)
            time.sleep(1)

            # 重要：在提交前同步所有 EasyUI 组件的值到表单隐藏字段
            log("同步 EasyUI 表单值...", "STEP")
            sync_js = """
            var syncLog=[];
            if(typeof jQuery!=='undefined'){
                // 同步 textbox/numberbox（固定 ID 列表）
                ['PersonCount','Contacts','PersonMobile','CCRY1','CCRY2',
                 'PersonName','PersonTel','StartAdress','EndAdress','Reason'].forEach(function(id){
                    try{
                        var $e=jQuery('#'+id);
                        if($e.length){
                            var val=$e.textbox('getValue');
                            var hidden=$e.find('input[type="hidden"]');
                            if(hidden.length) hidden.val(val);
                        }
                    }catch(e){}
                });
                // 同步 datetimebox
                ['CarTime','EndTime'].forEach(function(id){
                    try{
                        var $e=jQuery('#'+id);
                        if($e.length){
                            var val=$e.datetimebox('getValue');
                            var hidden=$e.find('input[type="hidden"]');
                            if(hidden.length) hidden.val(val);
                        }
                    }catch(e){}
                });
                // 同步 combobox —— 扫描所有带 combobox 数据的元素（不限固定ID）
                var cbSummary=[];
                jQuery('[id]').each(function(){
                    try{
                        var $e=$(this);
                        var d=$e.combobox('getData');
                        if(d&&d.length>0){
                            var val=$e.combobox('getValue');
                            var txt=$e.combobox('getText');
                            var hidden=$e.find('input[type="hidden"]');
                            if(hidden.length) hidden.val(val);
                            cbSummary.push($e.attr('id')+'='+txt+'('+val+')');
                        }
                    }catch(e){}
                });
                syncLog.push('comboboxes: '+cbSummary.join('; '));
            }
            return 'sync_done | '+syncLog.join(' | ');
            """
            try:
                res = driver.execute_script(sync_js)
                log(f"表单值同步完成: {res}", "OK")
            except Exception as e:
                log(f"表单值同步失败: {e}", "WARN")

            driver.save_screenshot("debug_form_filled.png")
            log("截图已保存: debug_form_filled.png", "OK")
            log("表单填写完成！请在浏览器中核对后手动点击【提交】", "OK")

            # 填写完成，不关闭浏览器，把 driver 传回界面供下次复用
            on_done(True, "表单填写完成！\n请在浏览器中核对，确认无误后手动点击【提交】按钮。", driver)

        finally:
            pass  # 不关闭浏览器，driver 由界面管理

    except Exception as e:
        import traceback
        err_detail = traceback.format_exc()
        log_cb(f"发生错误: {e}", "ERR")
        log_cb(err_detail, "ERR")
        on_done(False, f"填写过程出错:\n{e}\n\n详情请查看日志区", driver)


# ============================================================
# tkinter 界面
# ============================================================

import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext, ttk
from PIL import Image, ImageTk


class DispatchListApp:
    """
    派车列表 OCR 提取工具——独立 Toplevel 窗口。
    流程：选择/粘贴图片 → OCR 识别 → 解析为结构化记录 → 表格预览 → 复制/导出。
    """

    def __init__(self, parent):
        self.parent = parent
        self.win = tk.Toplevel(parent)
        self.win.title("派车列表提取  |  用车申请自动化")
        self.win.geometry("1100x680")
        self.win.configure(bg="#f5f5f5")

        self.image_path = None
        self.records = []
        self._ocr_running = False

        self._build_ui()
        # 后台预热 OCR 模型（与主窗口共享全局单例）
        threading.Thread(target=self._preheat_ocr, daemon=True).start()

    def _preheat_ocr(self):
        try:
            self.set_status("OCR 模型加载中，首次识别前稍等...")
            get_easyocr_reader(log_cb=self.log)
            self.set_status("就绪  |  请粘贴或选择派车列表截图")
        except Exception as e:
            self.log(f"OCR 模型预热失败: {e}", "WARN")

    def _build_ui(self):
        # ── 顶部标题栏 ─────────────────────────────────────
        title_bar = tk.Frame(self.win, bg="#FF6F00", height=48)
        title_bar.pack(fill="x")
        title_bar.pack_propagate(False)
        tk.Label(title_bar, text="派车列表提取",
                 font=("Microsoft YaHei", 14, "bold"),
                 bg="#FF6F00", fg="white").pack(side="left", padx=20, pady=8)

        # ── 主体 ─────────────────────────────────────
        main_frame = tk.Frame(self.win, bg="#f5f5f5")
        main_frame.pack(fill="both", expand=True, padx=12, pady=8)

        # ── 左侧：图片区 + 按钮 ─────────────────────────
        left_frame = tk.LabelFrame(main_frame, text=" 派车列表截图 ",
                                   font=("Microsoft YaHei", 10),
                                   bg="#f5f5f5", padx=8, pady=8)
        left_frame.pack(side="left", fill="both", expand=True)

        self.image_canvas = tk.Label(
            left_frame,
            text="支持：\n\n Ctrl+V 粘贴截图\n\n📁 点击下方按钮选择文件",
            font=("Microsoft YaHei", 11), bg="#e8e8e8",
            relief="groove", bd=2,
            width=30, height=12, anchor="center"
        )
        self.image_canvas.pack(fill="both", expand=True, pady=(0, 6))
        self.image_canvas.bind("<Button-1>", lambda e: self.select_file())
        # 绑定 Ctrl+V
        self.win.bind_all("<Control-v>", self.on_paste)
        # 拖拽支持
        try:
            from tkinterdnd2 import DND_FILES
            self.image_canvas.drop_target_register(DND_FILES)
            self.image_canvas.dnd_bind('<<Drop>>', self.on_drop)
        except Exception:
            pass

        # 按钮
        btn_frame = tk.Frame(left_frame, bg="#f5f5f5")
        btn_frame.pack(fill="x")
        tk.Button(btn_frame, text="📁 选择图片",
                  command=self.select_file,
                  font=("Microsoft YaHei", 9),
                  bg="#607D8B", fg="white",
                  relief="flat", padx=8, pady=4).pack(side="left", padx=(0, 4))
        self.ocr_btn = tk.Button(btn_frame, text="🔍 识别派车列表",
                                 command=self.process_image,
                                 font=("Microsoft YaHei", 9, "bold"),
                                 bg="#4CAF50", fg="white",
                                 relief="flat", padx=8, pady=4)
        self.ocr_btn.pack(side="left")

        # ── 右侧：结果表格 + 操作按钮 ───────────────────
        right_frame = tk.LabelFrame(main_frame, text=" 识别结果（可全选复制） ",
                                    font=("Microsoft YaHei", 10),
                                    bg="#f5f5f5", padx=8, pady=8)
        right_frame.pack(side="right", fill="both", expand=True, padx=(10, 0))

        # Treeview 表格
        columns = [fid for fid, _, _ in DISPATCH_COLUMNS]
        headings = {fid: label for fid, label, _ in DISPATCH_COLUMNS}
        widths = {fid: w for fid, _, w in DISPATCH_COLUMNS}

        self.tree = ttk.Treeview(right_frame, columns=columns, show="headings", height=20)
        for fid in columns:
            self.tree.heading(fid, text=headings[fid])
            self.tree.column(fid, width=widths[fid], anchor="center")

        vsb = ttk.Scrollbar(right_frame, orient="vertical", command=self.tree.yview)
        hsb = ttk.Scrollbar(right_frame, orient="horizontal", command=self.tree.xview)
        self.tree.configure(yscrollcommand=vsb.set, xscrollcommand=hsb.set)

        self.tree.grid(row=0, column=0, sticky="nsew")
        vsb.grid(row=0, column=1, sticky="ns")
        hsb.grid(row=1, column=0, sticky="ew")
        right_frame.rowconfigure(0, weight=1)
        right_frame.columnconfigure(0, weight=1)

        # 操作按钮
        op_frame = tk.Frame(right_frame, bg="#f5f5f5")
        op_frame.grid(row=2, column=0, columnspan=2, sticky="ew", pady=(8, 0))

        tk.Button(op_frame, text="📋 复制为表格",
                  command=self.copy_to_clipboard,
                  font=("Microsoft YaHei", 9, "bold"),
                  bg="#1976D2", fg="white",
                  relief="flat", padx=10, pady=4).pack(side="left", padx=(0, 4))
        tk.Button(op_frame, text="📊 导出 Excel",
                  command=self.export_excel,
                  font=("Microsoft YaHei", 9),
                  bg="#388E3C", fg="white",
                  relief="flat", padx=10, pady=4).pack(side="left", padx=(0, 4))
        tk.Button(op_frame, text="📄 导出 CSV",
                  command=self.export_csv,
                  font=("Microsoft YaHei", 9),
                  bg="#00796B", fg="white",
                  relief="flat", padx=10, pady=4).pack(side="left", padx=(0, 4))
        tk.Button(op_frame, text="🗑 清空",
                  command=self.clear_results,
                  font=("Microsoft YaHei", 9),
                  bg="#B71C1C", fg="white",
                  relief="flat", padx=10, pady=4).pack(side="right")

        # ── 状态栏 + 日志 ─────────────────────────────
        self.status_var = tk.StringVar(value="就绪  |  请粘贴或选择派车列表截图")
        status_bar = tk.Label(self.win, textvariable=self.status_var,
                              font=("Microsoft YaHei", 9),
                              bg="#e0e0e0", anchor="w", padx=10)
        status_bar.pack(fill="x")

        log_frame = tk.LabelFrame(self.win, text=" 运行日志 ",
                                  font=("Microsoft YaHei", 9), bg="#f5f5f5")
        log_frame.pack(fill="x", padx=12, pady=(0, 8))
        self.log_text = scrolledtext.ScrolledText(
            log_frame, height=6,
            font=("Consolas", 9), bg="#1e1e1e", fg="#d4d4d4",
            insertbackground="white"
        )
        self.log_text.pack(fill="x", padx=5, pady=5)
        self.log_text.tag_config("OK",   foreground="#4EC94E")
        self.log_text.tag_config("WARN", foreground="#F0ADAD")
        self.log_text.tag_config("ERR",  foreground="#F44747")
        self.log_text.tag_config("STEP", foreground="#569CD6")
        self.log_text.tag_config("INFO", foreground="#d4d4d4")

    # ── 输入处理 ──────────────────────────────────────
    def select_file(self):
        path = filedialog.askopenfilename(
            title="选择派车列表截图",
            filetypes=[("图片", "*.png *.jpg *.jpeg *.bmp *.webp"), ("所有", "*.*")]
        )
        if path:
            self.load_image(path)

    def on_paste(self, event=None):
        try:
            from PIL import ImageGrab
            img = ImageGrab.grabclipboard()
            if img is None:
                self.log("剪贴板中没有图片", "WARN")
                return
            # 可能是文件列表（截图软件存的 PNG 路径）
            if isinstance(img, list):
                if not img:
                    self.log("剪贴板为空", "WARN")
                    return
                self.load_image(img[0])
                return
            tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
            img.save(tmp.name)
            self.load_image(tmp.name)
        except Exception as e:
            self.log(f"粘贴失败: {e}", "ERR")

    def on_drop(self, event):
        # tkinterdnd2 拖拽
        path = event.data.strip("{}")
        if path:
            self.load_image(path)

    def load_image(self, path):
        self.image_path = path
        self.log(f"已加载图片: {Path(path).name}", "OK")
        # 缩略图预览
        try:
            img = Image.open(path)
            img.thumbnail((400, 400))
            photo = ImageTk.PhotoImage(img)
            self.image_canvas.configure(image=photo, text="")
            self.image_canvas.image = photo
        except Exception as e:
            self.log(f"预览图加载失败: {e}", "WARN")
        self.set_status(f"已加载图片: {Path(path).name}，点击【识别派车列表】")

    def process_image(self):
        if not self.image_path:
            messagebox.showwarning("提示", "请先选择或粘贴图片", parent=self.win)
            return
        if self._ocr_running:
            return

        self._ocr_running = True
        self.ocr_btn.config(state="disabled", text="识别中...")
        self.set_status("OCR 识别中...")
        self.log("启动 OCR 识别线程...", "STEP")

        def _run():
            try:
                ocr_text, _ = extract_text_from_image(self.image_path, log_cb=self.log)
                records = parse_dispatch_list_from_text(ocr_text, log_cb=self.log)
                self.win.after(0, lambda: self._on_ocr_done(records))
            except Exception as e:
                import traceback
                self.win.after(0, lambda: self._on_ocr_error(str(e), traceback.format_exc()))

        threading.Thread(target=_run, daemon=True).start()

    def _on_ocr_done(self, records):
        self._ocr_running = False
        self.ocr_btn.config(state="normal", text="🔍 识别派车列表")
        self.records = records
        # 刷新表格
        for item in self.tree.get_children():
            self.tree.delete(item)
        for rec in records:
            self.tree.insert("", "end", values=[rec.get(fid, '') for fid, _, _ in DISPATCH_COLUMNS])
        self.set_status(f"识别完成，共 {len(records)} 条记录  |  可复制或导出")
        if not records:
            messagebox.showwarning("提示", "未识别到有效记录，请检查图片是否清晰", parent=self.win)

    def _on_ocr_error(self, err, detail):
        self._ocr_running = False
        self.ocr_btn.config(state="normal", text="🔍 识别派车列表")
        self.log(f"OCR 识别出错: {err}", "ERR")
        self.log(detail, "ERR")
        self.set_status("OCR 识别失败")
        messagebox.showerror("OCR 识别失败", f"{err}\n\n详情请查看日志区", parent=self.win)

    def clear_results(self):
        for item in self.tree.get_children():
            self.tree.delete(item)
        self.records = []
        self.log("已清空结果", "INFO")
        self.set_status("已清空")

    # ── 导出 ─────────────────────────────────────────
    def copy_to_clipboard(self):
        if not self.records:
            messagebox.showwarning("提示", "没有可复制的数据", parent=self.win)
            return
        # TSV 格式：表头 + 数据，制表符分隔
        lines = ["\t".join(label for _, label, _ in DISPATCH_COLUMNS)]
        for rec in self.records:
            lines.append("\t".join(rec.get(fid, '') for fid, _, _ in DISPATCH_COLUMNS))
        text = "\n".join(lines)
        self.win.clipboard_clear()
        self.win.clipboard_append(text)
        self.set_status(f"已复制 {len(self.records)} 条记录到剪贴板（TSV 格式，可粘贴到 Excel）")
        self.log(f"已复制 {len(self.records)} 条记录到剪贴板", "OK")

    def export_excel(self):
        if not self.records:
            messagebox.showwarning("提示", "没有可导出的数据", parent=self.win)
            return
        try:
            import openpyxl
        except ImportError:
            messagebox.showerror("缺少依赖", "导出 Excel 需要 openpyxl 库。\n\n请运行: pip install openpyxl", parent=self.win)
            return

        default_name = f"派车列表_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        path = filedialog.asksaveasfilename(
            title="导出为 Excel",
            defaultextension=".xlsx",
            initialfile=default_name,
            filetypes=[("Excel", "*.xlsx")],
            parent=self.win
        )
        if not path:
            return
        try:
            wb = openpyxl.Workbook()
            ws = wb.active
            ws.title = "派车列表"
            # 表头
            ws.append([label for _, label, _ in DISPATCH_COLUMNS])
            # 数据
            for rec in self.records:
                ws.append([rec.get(fid, '') for fid, _, _ in DISPATCH_COLUMNS])
            # 表头加粗
            from openpyxl.styles import Font
            for cell in ws[1]:
                cell.font = Font(bold=True)
            # 列宽自适应
            for col_idx, (_, label, width) in enumerate(DISPATCH_COLUMNS, 1):
                ws.column_dimensions[openpyxl.utils.get_column_letter(col_idx)].width = width // 7
            wb.save(path)
            self.set_status(f"已导出到 {Path(path).name}")
            self.log(f"已导出 {len(self.records)} 条记录到 {path}", "OK")
            messagebox.showinfo("导出成功", f"已导出 {len(self.records)} 条记录到：\n{path}", parent=self.win)
        except Exception as e:
            self.log(f"导出失败: {e}", "ERR")
            messagebox.showerror("导出失败", str(e), parent=self.win)

    def export_csv(self):
        if not self.records:
            messagebox.showwarning("提示", "没有可导出的数据", parent=self.win)
            return
        import csv
        default_name = f"派车列表_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        path = filedialog.asksaveasfilename(
            title="导出为 CSV",
            defaultextension=".csv",
            initialfile=default_name,
            filetypes=[("CSV", "*.csv")],
            parent=self.win
        )
        if not path:
            return
        try:
            with open(path, "w", encoding="utf-8-sig", newline="") as f:
                writer = csv.writer(f)
                writer.writerow([label for _, label, _ in DISPATCH_COLUMNS])
                for rec in self.records:
                    writer.writerow([rec.get(fid, '') for fid, _, _ in DISPATCH_COLUMNS])
            self.set_status(f"已导出到 {Path(path).name}")
            self.log(f"已导出 {len(self.records)} 条记录到 {path}", "OK")
            messagebox.showinfo("导出成功", f"已导出 {len(self.records)} 条记录到：\n{path}", parent=self.win)
        except Exception as e:
            self.log(f"导出失败: {e}", "ERR")
            messagebox.showerror("导出失败", str(e), parent=self.win)

    # ── 日志/状态 ────────────────────────────────────
    def log(self, msg, level="INFO"):
        ts = datetime.now().strftime("%H:%M:%S")
        self.log_text.insert("end", f"[{ts}] [{level}] {msg}\n", level)
        self.log_text.see("end")

    def set_status(self, text):
        self.status_var.set(text)


class AutoFormApp:
    def __init__(self, root):
        self.root = root
        self.root.title("用车申请自动化 v3")
        self.root.geometry("980x780")
        self.root.resizable(True, True)
        self.root.configure(bg="#f5f5f5")

        self.image_path = None
        self.parsed_data = {}
        self._ocr_running = False
        self._selenium_running = False
        self._driver = None   # 保存浏览器实例，供后续复用

        # ── 批量队列 ──────────────────────────────────
        self._queue = []          # 待处理图片路径列表
        self._queue_index = 0     # 当前处理到第几张（0-based）

        self.setup_ui()

        # ── 后台预热 easyocr 模型 ────────────────────
        threading.Thread(target=self._preheat_ocr, daemon=True).start()

    def _preheat_ocr(self):
        """程序启动后在后台预热 easyocr 模型，让第一次识别更快。"""
        try:
            self.root.after(500, lambda: self.set_status("OCR 模型加载中，首次识别前稍等..."))
            get_easyocr_reader(log_cb=self.log)
            self.root.after(0, lambda: self.set_status("就绪  |  OCR 模型已就绪，请粘贴或选择图片"))
        except Exception as e:
            self.root.after(0, lambda: self.log(f"OCR 模型预热失败: {e}", "WARN"))

    def setup_ui(self):
        # ── 顶部标题栏 ─────────────────────────────────────
        title_bar = tk.Frame(self.root, bg="#1976D2", height=50)
        title_bar.pack(fill="x")
        title_bar.pack_propagate(False)
        tk.Label(title_bar, text="用车申请自动化  v3",
                 font=("Microsoft YaHei", 15, "bold"),
                 bg="#1976D2", fg="white").pack(side="left", padx=20, pady=10)

        # 派车列表提取入口按钮
        tk.Button(title_bar, text="📋 派车列表提取",
                  command=self.open_dispatch_list,
                  font=("Microsoft YaHei", 9, "bold"),
                  bg="#FF6F00", fg="white",
                  relief="flat", padx=12, pady=4).pack(side="right", padx=15)

        # ── 主体区：左侧图片 + 右侧字段 ───────────────────
        main_frame = tk.Frame(self.root, bg="#f5f5f5")
        main_frame.pack(fill="both", expand=True, padx=15, pady=10)

        # ── 左侧：图片区 ────────────────────────────────
        left_frame = tk.LabelFrame(main_frame, text=" 申请表图片 ",
                                   font=("Microsoft YaHei", 10),
                                   bg="#f5f5f5", padx=8, pady=8)
        left_frame.pack(side="left", fill="both", expand=True)

        self.image_canvas = tk.Label(
            left_frame,
            text="支持：\n\n Ctrl+V 粘贴截图\n\n📁 点击下方按钮选择文件\n\n🖱 拖拽文件到此窗口",
            font=("Microsoft YaHei", 11), bg="#e8e8e8",
            relief="groove", bd=2,
            width=38, height=12, anchor="center"
        )
        self.image_canvas.pack(fill="both", expand=True, pady=(0, 6))

        # ── 队列进度标签 ──────────────────────────────
        self.queue_label_var = tk.StringVar(value="队列：0 张图片")
        queue_label = tk.Label(left_frame, textvariable=self.queue_label_var,
                               font=("Microsoft YaHei", 9, "bold"),
                               bg="#f5f5f5", fg="#1976D2", anchor="w")
        queue_label.pack(fill="x", pady=(0, 2))

        # ── 队列列表框 ────────────────────────────────
        queue_list_frame = tk.Frame(left_frame, bg="#f5f5f5")
        queue_list_frame.pack(fill="x", pady=(0, 6))

        self.queue_listbox = tk.Listbox(
            queue_list_frame, height=5,
            font=("Microsoft YaHei", 9),
            bg="#ffffff", selectbackground="#1976D2",
            selectforeground="white",
            relief="groove", bd=1
        )
        self.queue_listbox.pack(side="left", fill="x", expand=True)
        qlb_scroll = ttk.Scrollbar(queue_list_frame, orient="vertical",
                                   command=self.queue_listbox.yview)
        qlb_scroll.pack(side="right", fill="y")
        self.queue_listbox.config(yscrollcommand=qlb_scroll.set)
        self.queue_listbox.bind("<Double-Button-1>", self._on_queue_preview)

        # ── 按钮区 ────────────────────────────────────
        img_btn_frame = tk.Frame(left_frame, bg="#f5f5f5")
        img_btn_frame.pack(fill="x")

        tk.Button(img_btn_frame, text="📁 单张图片",
                  command=self.select_file,
                  font=("Microsoft YaHei", 9),
                  bg="#607D8B", fg="white",
                  relief="flat", padx=8, pady=4).pack(side="left", padx=(0, 4))

        tk.Button(img_btn_frame, text="📂 批量选择",
                  command=self.select_files_batch,
                  font=("Microsoft YaHei", 9, "bold"),
                  bg="#FF6F00", fg="white",
                  relief="flat", padx=8, pady=4).pack(side="left", padx=(0, 4))

        tk.Button(img_btn_frame, text="🗑 清空队列",
                  command=self.clear_queue,
                  font=("Microsoft YaHei", 9),
                  bg="#B71C1C", fg="white",
                  relief="flat", padx=8, pady=4).pack(side="left", padx=(0, 4))

        self.ocr_btn = tk.Button(img_btn_frame, text="🔍 开始识别",
                                 command=self.process_image,
                                 font=("Microsoft YaHei", 9, "bold"),
                                 bg="#4CAF50", fg="white",
                                 relief="flat", padx=8, pady=4)
        self.ocr_btn.pack(side="left")

        # ── 右侧：字段编辑区 ─────────────────────────────
        right_frame = tk.LabelFrame(main_frame, text=" 识别结果（可修改） ",
                                    font=("Microsoft YaHei", 10),
                                    bg="#f5f5f5", padx=8, pady=8)
        right_frame.pack(side="right", fill="both", padx=(10, 0))

        # 滚动容器
        canvas = tk.Canvas(right_frame, bg="#f5f5f5", highlightthickness=0, width=420)
        scrollbar = ttk.Scrollbar(right_frame, orient="vertical", command=canvas.yview)
        self.fields_frame = tk.Frame(canvas, bg="#f5f5f5")

        self.fields_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        canvas.create_window((0, 0), window=self.fields_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # 绑定鼠标滚轮
        canvas.bind_all("<MouseWheel>", lambda e: canvas.yview_scroll(-1*(e.delta//120), "units"))

        self.entries = {}
        self._create_field_entries()

        # ── 提交按钮 ────────────────────────────────────
        self.submit_btn = tk.Button(
            right_frame, text="🚀 确认并填写表单",
            command=self.submit_to_browser,
            font=("Microsoft YaHei", 11, "bold"),
            bg="#1976D2", fg="white",
            relief="flat", padx=15, pady=8
        )
        self.submit_btn.pack(fill="x", pady=(8, 0))

        # ── 批量进度标签 ──────────────────────────────
        self.batch_progress_var = tk.StringVar(value="")
        self.batch_progress_label = tk.Label(
            self.root, textvariable=self.batch_progress_var,
            font=("Microsoft YaHei", 9, "bold"),
            bg="#f5f5f5", fg="#1565C0", anchor="w", padx=15
        )
        self.batch_progress_label.pack(fill="x")

        # ── 进度条（determinate 模式，支持精确进度）────
        self.progress_var = tk.IntVar(value=0)
        self.progress = ttk.Progressbar(
            self.root, mode="determinate",
            variable=self.progress_var, maximum=100
        )
        self.progress.pack(fill="x", padx=15)

        # ── 状态栏 ────────────────────────────────────
        self.status_var = tk.StringVar(value="就绪  |  请先粘贴或选择图片")
        status_bar = tk.Label(self.root, textvariable=self.status_var,
                              font=("Microsoft YaHei", 9),
                              bg="#e0e0e0", anchor="w", padx=10)
        status_bar.pack(fill="x")

        # ── 日志区 ────────────────────────────────────
        log_frame = tk.LabelFrame(self.root, text=" 运行日志 ",
                                  font=("Microsoft YaHei", 9), bg="#f5f5f5")
        log_frame.pack(fill="x", padx=15, pady=(5, 10))
        self.log_text = scrolledtext.ScrolledText(
            log_frame, height=7,
            font=("Consolas", 9), bg="#1e1e1e", fg="#d4d4d4",
            insertbackground="white"
        )
        self.log_text.pack(fill="x", padx=5, pady=5)

        # 保存日志按钮
        save_log_btn = tk.Button(
            log_frame, text="💾 保存日志到文件",
            command=self.save_log,
            font=("Microsoft YaHei", 8),
            bg="#757575", fg="white",
            relief="flat", padx=10, pady=2
        )
        save_log_btn.place(relx=1.0, rely=0.0, anchor="ne", x=-5, y=5)

        # 配置日志颜色标签
        self.log_text.tag_config("OK",   foreground="#4EC94E")
        self.log_text.tag_config("WARN", foreground="#F0AD4E")
        self.log_text.tag_config("ERR",  foreground="#F44747")
        self.log_text.tag_config("STEP", foreground="#569CD6")
        self.log_text.tag_config("INFO", foreground="#d4d4d4")
        self.log_text.tag_config("DEBUG", foreground="#888888")

        # ── 绑定事件 ─────────────────────────────────
        self.root.bind("<Control-v>", self.on_paste)
        self.root.drop_target_register = getattr(self.root, 'drop_target_register', None)
        self._bind_drag_drop()

    def _create_field_entries(self):
        for i, (fid, label, required, default) in enumerate(FIELD_DEFS):
            req_mark = "★" if required else "☆"
            color = "#c62828" if required else "#555"
            tk.Label(self.fields_frame,
                     text=f"{req_mark} {label}",
                     font=("Microsoft YaHei", 9),
                     fg=color, bg="#f5f5f5",
                     width=20, anchor="w"
                     ).grid(row=i, column=0, sticky="w", pady=3, padx=(0, 5))
            entry = tk.Entry(self.fields_frame,
                             font=("Microsoft YaHei", 9),
                             width=30, relief="solid", bd=1)
            entry.grid(row=i, column=1, sticky="ew", pady=3)
            if default:
                entry.insert(0, default)
            self.entries[fid] = entry
        self.fields_frame.columnconfigure(1, weight=1)

    def _bind_drag_drop(self):
        """尝试绑定拖拽（如有 tkinterdnd2 则启用）"""
        try:
            from tkinterdnd2 import DND_FILES
            self.root.drop_target_register(DND_FILES)
            self.root.dnd_bind('<<Drop>>', self._on_drop)
        except:
            pass  # 没有 tkinterdnd2 也无所谓，其他方式仍可用

    def _on_drop(self, event):
        path = event.data.strip().strip('{}')
        if os.path.isfile(path):
            self.load_image(path)

    def log(self, msg, level="INFO"):
        icons = {"INFO": "  ", "OK": "OK", "WARN": "!!", "ERR": "XX", "STEP": ">>", "DEBUG": "**"}
        line = f"[{icons.get(level, '?')}] {msg}\n"
        self.log_text.insert("end", line, level)
        self.log_text.see("end")
        self.root.update_idletasks()

    def save_log(self):
        """保存日志到文件"""
        try:
            content = self.log_text.get("1.0", "end-1c")
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"界面版日志_{timestamp}.txt"
            filepath = os.path.join(os.getcwd(), filename)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            self.log(f"日志已保存: {filename}", "OK")
            self.set_status(f"日志已保存: {filename}")
        except Exception as e:
            self.log(f"保存日志失败: {e}", "ERR")

    def set_status(self, msg):
        self.status_var.set(msg)
        self.root.update_idletasks()

    def set_progress(self, value: int, batch_text: str = ""):
        """
        设置进度条状态。
        value: 0=重置隐藏, -1=不确定滚动(indeterminate), 1~100=确定进度
        batch_text: 显示在进度条上方的批量文字，如"第2张/共5张 · 识别中"
        """
        if value == 0:
            # 重置：隐藏进度条文字，进度归零
            self.batch_progress_var.set("")
            self.progress_var.set(0)
            self.progress.config(mode="determinate")
        elif value == -1:
            # 不确定模式（旧的滚动效果）
            self.progress.config(mode="indeterminate")
            self.progress.start(10)
            if batch_text:
                self.batch_progress_var.set(batch_text)
        else:
            # 确定进度 1~100
            self.progress.config(mode="determinate")
            self.progress.stop()
            self.progress_var.set(max(0, min(100, value)))
            if batch_text:
                self.batch_progress_var.set(batch_text)
        self.root.update_idletasks()

    def _get_batch_prefix(self) -> str:
        """返回当前批量进度前缀，如'第2张/共5张 · '，单张时返回空"""
        total = len(self._queue)
        if total <= 1:
            return ""
        return f"第 {self._queue_index + 1} 张 / 共 {total} 张  ·  "

    # ── 单张选择 ──────────────────────────────────────────────
    def select_file(self):
        """单张图片选择（加入队列）"""
        path = filedialog.askopenfilename(
            title="选择图片",
            filetypes=[("图片文件", "*.png *.jpg *.jpeg *.bmp *.gif *.webp"), ("所有文件", "*.*")]
        )
        if path:
            self._add_to_queue([path])

    # ── 批量选择 ──────────────────────────────────────────────
    def select_files_batch(self):
        """批量选择多张图片（按顺序加入队列）"""
        paths = filedialog.askopenfilenames(
            title="批量选择图片（可多选，按住Ctrl或Shift）",
            filetypes=[("图片文件", "*.png *.jpg *.jpeg *.bmp *.gif *.webp"), ("所有文件", "*.*")]
        )
        if paths:
            self._add_to_queue(list(paths))

    # ── 队列操作 ──────────────────────────────────────────────
    def _add_to_queue(self, paths):
        """将图片列表加入队列"""
        added = 0
        for p in paths:
            if p not in self._queue:
                self._queue.append(p)
                added += 1
        self.log(f"已加入队列 {added} 张图片，共 {len(self._queue)} 张", "OK")
        self._refresh_queue_ui()
        # 如果当前没有图片，自动加载并识别第一张
        if not self.image_path and self._queue:
            self._queue_index = 0
            self._load_current_queue_item()

    def open_dispatch_list(self):
        """打开派车列表提取窗口（单例）"""
        if hasattr(self, '_dispatch_win') and self._dispatch_win is not None and self._dispatch_win.winfo_exists():
            self._dispatch_win.lift()
            self._dispatch_win.focus_force()
            return
        self._dispatch_win = DispatchListApp(self.root)

    def clear_queue(self):
        """清空图片队列"""
        if self._queue and not messagebox.askyesno("确认", "确定清空所有队列图片？"):
            return
        self._queue.clear()
        self._queue_index = 0
        self.image_path = None
        self.image_canvas.config(image="",
            text="支持：\n\n Ctrl+V 粘贴截图\n\n📁 点击下方按钮选择文件\n\n🖱 拖拽文件到此窗口")
        self.image_canvas.image = None
        self._refresh_queue_ui()
        self.log("队列已清空", "INFO")

    def _refresh_queue_ui(self):
        """刷新队列列表框和进度标签"""
        self.queue_listbox.delete(0, "end")
        total = len(self._queue)
        for i, p in enumerate(self._queue):
            name = Path(p).name
            if i < self._queue_index:
                mark = "✓ "
            elif i == self._queue_index and self.image_path:
                mark = "▶ "
            else:
                mark = "  "
            self.queue_listbox.insert("end", f"{mark}[{i+1}] {name}")
            if i < self._queue_index:
                self.queue_listbox.itemconfig(i, fg="#999999")
            elif i == self._queue_index:
                self.queue_listbox.itemconfig(i, fg="#1976D2")
        if total == 0:
            self.queue_label_var.set("队列：0 张图片")
        else:
            done = self._queue_index
            self.queue_label_var.set(f"队列：共 {total} 张  |  第 {done+1} 张处理中")

    def _on_queue_preview(self, event):
        """双击队列列表项预览该图片"""
        sel = self.queue_listbox.curselection()
        if not sel:
            return
        idx = sel[0]
        if 0 <= idx < len(self._queue):
            self._queue_index = idx
            self._load_current_queue_item()

    def _load_current_queue_item(self):
        """加载当前队列索引的图片（预览 + 自动OCR）"""
        if self._queue_index >= len(self._queue):
            return
        path = self._queue[self._queue_index]
        self.load_image(path)
        self._refresh_queue_ui()
        self.root.after(300, self.process_image)

    # ── 粘贴 / 拖拽 ───────────────────────────────────────────
    def on_paste(self, event):
        try:
            from PIL import ImageGrab
            img = ImageGrab.grabclipboard()
            if img:
                temp_path = Path(tempfile.gettempdir()) / f"paste_{int(time.time())}.png"
                img.save(temp_path)
                self._add_to_queue([str(temp_path)])
                return "break"
        except Exception as e:
            self.log(f"粘贴失败: {e}", "WARN")
        return "break"

    def load_image(self, image_path):
        self.image_path = image_path
        name = Path(image_path).name
        self.log(f"已加载图片: {name}", "INFO")
        self.set_status(f"已加载: {name}  |  正在识别...")
        try:
            img = Image.open(image_path)
            img.thumbnail((400, 260), Image.Resampling.LANCZOS)
            photo = ImageTk.PhotoImage(img)
            self.image_canvas.config(image=photo, text="")
            self.image_canvas.image = photo
        except Exception as e:
            self.log(f"图片预览失败: {e}", "WARN")

    def process_image(self):
        if not self.image_path:
            messagebox.showwarning("提示", "请先选择或粘贴图片")
            return
        if self._ocr_running:
            return

        self._ocr_running = True
        self.ocr_btn.config(state="disabled", text="识别中...")
        prefix = self._get_batch_prefix()
        self.set_progress(-1, batch_text=f"{prefix}OCR 识别中...")
        self.set_status(f"{prefix}正在 OCR 识别图片，请稍候...")
        self.log("启动 OCR 识别线程...", "STEP")

        def _run():
            try:
                data = extract_and_parse_image(self.image_path, log_cb=self.log)
                self.parsed_data = data
                # 回到主线程更新界面
                self.root.after(0, lambda: self._on_ocr_done(data))
            except Exception as e:
                import traceback
                self.root.after(0, lambda: self._on_ocr_error(str(e), traceback.format_exc()))

        threading.Thread(target=_run, daemon=True).start()

    def _on_ocr_done(self, data):
        self._ocr_running = False
        self.ocr_btn.config(state="normal", text="🔍 开始识别")
        prefix = self._get_batch_prefix()
        self.set_progress(50, batch_text=f"{prefix}识别完成，等待填表")

        # 填入字段
        for fid, label, required, default in FIELD_DEFS:
            entry = self.entries.get(fid)
            if not entry:
                continue
            val = data.get(fid, '')
            if not val:
                if fid in ('EndAdress', 'EndAddress'):
                    val = (data.get('EndAdress', '') or data.get('EndAddress', '') or 
                           data.get('目的地', '') or data.get('到达地点', '') or
                           data.get('end_address', '') or data.get('to_location', ''))

                elif fid in ('StartAdress', 'StartAddress'):
                    val = (data.get('StartAdress', '') or data.get('StartAddress', '') or 
                           data.get('start_address', '') or data.get('from_location', ''))
                elif fid in ('Contacts', 'name'):
                    val = (data.get('Contacts', '') or data.get('name', '') or 
                           data.get('applicant', ''))
                elif fid in ('PersonMobile', 'mobile'):
                    val = data.get('PersonMobile', '') or data.get('mobile', '')
                elif fid in ('Reason', 'reason'):
                    val = data.get('Reason', '') or data.get('reason', '')

            entry.delete(0, "end")
            if val:
                entry.insert(0, str(val))
            elif fid in FIXED_VALUES:
                entry.insert(0, str(FIXED_VALUES[fid]))
            elif default:
                entry.insert(0, str(default))

        count = sum(1 for fid in self.entries if self.entries[fid].get().strip())
        end_addr_val = self.entries.get('EndAdress', None)
        if end_addr_val and end_addr_val.get().strip():
            self.log(f"已自动填入到达地点: {end_addr_val.get().strip()}", "OK")
        self.log(f"识别完成，界面已自动填入 {count} 个字段，请核对", "OK")
        self.set_status(f"识别完成，已填入 {count} 个字段  |  检查后点击【确认并填写表单】")


    def _on_ocr_error(self, err, detail):
        self._ocr_running = False
        self.ocr_btn.config(state="normal", text="🔍 开始识别")
        self.set_progress(0)
        self.log(f"OCR 识别出错: {err}", "ERR")
        self.log(detail, "ERR")
        self.set_status("OCR 识别失败，请查看日志")
        messagebox.showerror("OCR 识别失败", f"{err}\n\n详情请查看日志区")

    def submit_to_browser(self):
        if self._selenium_running:
            return

        # 从界面读取最新值
        final_data = {fid: entry.get().strip() for fid, entry in self.entries.items()}

        # 校验必填
        missing = [label for fid, label, required, _ in FIELD_DEFS
                   if required and not final_data.get(fid, '').strip()]
        if missing:
            messagebox.showwarning(
                "必填字段为空",
                "以下必填字段尚未填写：\n\n" + "\n".join(f"  ★ {lbl}" for lbl in missing)
            )
            return

        # 确认弹窗
        lines = ["即将填写以下信息，请核对：\n"]
        for fid, label, required, _ in FIELD_DEFS:
            val = final_data.get(fid, '') or "（空/自动选）"
            mark = "★" if required else "☆"
            lines.append(f"{mark} {label}: {val}")
        if not messagebox.askyesno("确认信息", "\n".join(lines)):
            return

        self._selenium_running = True
        self.submit_btn.config(state="disabled", text="填写中，请稍候...")
        prefix = self._get_batch_prefix()
        self.set_progress(-1, batch_text=f"{prefix}浏览器填表中...")
        self.set_status(f"{prefix}正在启动浏览器并填写表单...")
        self.log("启动 Selenium 子线程...", "STEP")

        def _on_need_manual_add(event):
            """界面弹窗提示用户手动点击【添加】"""
            def _show():
                messagebox.showinfo(
                    "需要手动操作",
                    "未能自动找到【添加】按钮。\n\n请在浏览器中手动点击【添加】打开表单，\n然后回到此处点击确定继续。"
                )
                event.set()
            self.root.after(0, _show)

        def _on_done(success, msg, returned_driver):
            self.root.after(0, lambda: self._on_selenium_done(success, msg, returned_driver))

        threading.Thread(
            target=run_selenium_fill,
            args=(final_data, self.log, _on_need_manual_add, _on_done),
            kwargs={"existing_driver": self._driver},
            daemon=True
        ).start()

    def _on_selenium_done(self, success, msg, returned_driver=None):
        self._selenium_running = False
        self.submit_btn.config(state="normal", text="🚀 确认并填写表单")

        total = len(self._queue)
        current_idx = self._queue_index  # 刚处理完的那张

        if success:
            pct = int((current_idx + 1) / total * 100) if total > 0 else 100
            batch_txt = f"第 {current_idx + 1} 张 / 共 {total} 张  ·  填表完成，等待提交" if total > 1 else "填表完成，等待提交"
            self.set_progress(pct, batch_text=batch_txt)
        else:
            self.set_progress(0)

        # 保存（或更新）浏览器实例，供下次复用
        if returned_driver is not None:
            self._driver = returned_driver

        if success:
            has_next = total > 0 and (current_idx + 1) < total

            if has_next:
                # 批量模式：提示用户提交当前张，然后继续
                answer = messagebox.askyesno(
                    "表单填写完成",
                    f"第 {current_idx + 1} 张（共 {total} 张）已填写完毕！\n\n"
                    f"请在浏览器中核对并点击【确定】提交。\n\n"
                    f"提交完成后，点击下方【是】继续处理下一张。\n"
                    f"点击【否】停止批量处理。",
                    icon="question"
                )
                if answer:
                    self._queue_index = current_idx + 1
                    self.log(f"--- 开始处理第 {self._queue_index + 1} 张（共 {total} 张）---", "STEP")
                    self.set_progress(0)  # 开始下一张前重置进度
                    self._refresh_queue_ui()
                    self._load_current_queue_item()
                else:
                    self.set_status(f"批量处理已暂停（已完成 {current_idx + 1}/{total} 张）")
                    self.log(f"批量处理已停止，已完成 {current_idx + 1} 张", "WARN")
            else:
                # 单张 或 最后一张
                if total > 1:
                    self.set_progress(100, batch_text=f"全部完成！共 {total} 张  ·  请提交最后一张")
                    messagebox.showinfo(
                        "全部完成！",
                        f"所有 {total} 张图片均已填写完毕！\n\n"
                        f"请在浏览器中核对并提交最后一张。"
                    )
                    self.set_status(f"全部完成！共处理 {total} 张  |  请在浏览器提交最后一张")
                    self.log(f"批量处理完成，共 {total} 张", "OK")
                    self._queue_index = 0
                    self._refresh_queue_ui()
                else:
                    # 普通单张模式
                    self.set_progress(100, batch_text="填写完成！")
                    self.set_status("表单填写完成！请在浏览器中手动提交")
                    self.log("表单填写完成！", "OK")
                    messagebox.showinfo("完成", msg)
        else:
            self.set_status("填写出错，请查看日志")
            messagebox.showerror("出错", msg)


# ============================================================
# 主入口
# ============================================================

if __name__ == "__main__":
    root = tk.Tk()
    app = AutoFormApp(root)
    root.mainloop()
