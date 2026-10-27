# 🪐 算术速算宇宙（Arithmetic Universe）全栈工程与架构实战手册

> **项目定位**：基于纯前端高可用架构与小学数感认知的“零云成本”儿童速算心算进阶系统。
> **技术形态**：微信小程序（易移植至 Web / Vue / React / Uni-app / Flutter）。
> **核心特色**：0 云端数据库费用、纯波形音频合成、护眼极简设计、可视化算理模型、元认知错因诊断、插件化速算星系。

---

## 目录
1. [项目愿景与产品价值](#一-项目愿景与产品价值)
2. [总体架构与技术栈设计](#二-总体架构与技术栈设计)
3. [五大玩法模式与心智模型](#三-五大玩法模式与心智模型)
4. [四大核心速算规则插件与图解算理](#四-四大核心速算规则插件与图解算理)
5. [智能错因诊断引擎与闭环错题本](#五-智能错因诊断引擎与闭环错题本)
6. [零资源依赖的纯前端音频引擎](#六-零资源依赖的纯前端音频引擎)
7. [排坑实战与高可用性能优化](#七-排坑实战与高可用性能优化)
8. [核心目录结构与完整接口规范](#八-核心目录结构与完整接口规范)
9. [跨端移植指南（Web / Vue / React）](#九-跨端移植指南)

---

## 一、 项目愿景与产品价值

### 1.1 痛点洞察
传统的口算刷题存在三大痛点：
1. **机械死记，不知其所以然**：死背口诀（如“头同尾合十”），题目稍作变化或遇到非退位题就盲目乱套公式。
2. **缺乏错因归因**：传统刷题软件只给红叉，孩子不知道是“个位补数找错”还是“十位借位后忘了减 1”。
3. **沉重的云端维护负担**：依赖昂贵的云服务器与云数据库，个人开发者难以为继。

### 1.2 解决方案
“算术速算宇宙”围绕 **“知其然更知其所以然”** 打造：
- **插件化规则引擎**：新增任意口算题型只需编写一个声明式 JS 插件。
- **算理几何/直观模型**：配备小棒拆捆、满十扎捆、乘法分配律与矩形面积拼图，可视化剖析口诀本质。
- **反向找茬（小老师模式）**：通过批改同学作业，训练辨识易错陷阱的元认知能力。
- **100% 本地优先**：终身 0 元云端成本，离线极速运行。
- **护眼柔和美学**：摒弃沉重压抑的黑夜模式与刺眼纯白，采用 `#F8FAFC` 舒缓底色与 `#FFFFFF` 极简微质感卡片。

---

## 二、 总体架构与技术栈设计

### 2.1 架构分层拓扑图

```
┌─────────────────────────────────────────────────────────────┐
│                   算术速算宇宙 Hub (Portal)                  │
│       - 连续打卡天数  - 总星数与段位  - 每日5题/错题/纠错入口  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 通用竞技场 (Universal Arena)                 │
│  - 模式控制器: 每日5题 | 分步指导 | 极速速算 | 小老师 | 错题本 │
│  - 双视觉渲染台: 竖式三列三槽 (加减) / 横向拉开展开 (乘法)    │
│  - 虚拟按键键盘: 84rpx+ 防误触大触控区 + 自动聚焦下一位       │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐┌─────────────────────────────┐
│ 规则注册中心 (Rules Registry) ││ 智能错因引擎 (Diagnosis)     │
│ - sub_regroup (退位减法基石)  ││ - 错题模式智能识别与切片      │
│ - add_carry   (进位加法先锋)  ││ - 定向点拨提示与错题本持久化 │
│ - mul_11      (神仙乘11)     │└─────────────────────────────┘
│ - mul_head_same (头同尾合十)  │┌─────────────────────────────┐
└──────────────────────────────┘│ WebAudio 纯波形合成引擎     │
               │                │ - 木鱼点击 / 大三度答对 / 琶音 │
               ▼                └─────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│           本地持久化存储协议 (math_universe_data)            │
│  - totalStreakDays, totalStars, rankTitle, skills, mistakes │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 本地存储协议规范 (`math_universe_data`)

```typescript
interface MathUniverseStorage {
  totalStreakDays: number;     // 连续打卡天数
  lastCheckinDate: string;     // 上次打卡日期 (YYYY-MM-DD，本地时区)
  totalStars: number;          // 累积获得星数
  rankTitle: string;           // 段位: 心算学徒 | 速算新星 | 心算大师 | 算术宗师
  skills: {
    [ruleId: string]: {
      completedCount: number;  // 累计完成题数
      mastered: boolean;       // 是否精通 (完成>=15且无挂起错题)
      bestSpeedStreak: number; // 极速速算最高连击数
    }
  };
  mistakes: Array<{
    id: string;                // 错题唯一标识
    ruleId: string;            // 所属规则ID
    expr: string;              // 算式表达 (如 "52 - 28")
    a: number;
    b: number;
    op: string;
    answer: number;
    problemMeta: any;          // 原题目生成的元数据
    errorTag: string;          // 错因标签
    errorAdvice: string;       // 纠错点拨建议
    wrongCount: number;        // 错误频次
    resolved: boolean;         // 是否攻克
    timestamp: number;
  }>;
}
```

---

## 三、 五大玩法模式与心智模型

### 3.1 模式 1：每日 5 题通关（习惯养成）
- **题型阶梯生成**：前 2 题为初阶入门，第 3 题混入“辨别防错题”，后 2 题为高难进阶。
- **打卡联动**：全对 5 题后触发五彩粒子撒花，打卡天数 ＋1，增加段位星数。

### 3.2 模式 2：自由分步解剖指导（口诀心算法内化）
- **动态槽位与口诀联动**：算式上方的呼吸灯口诀实时高亮当前正在执行的半句（如 `尾加尾补数`）。
- **动效反馈**：支持借位红点标 `-1`、进位绿点标 `+1`、原十位数划线变小，彻底还原草稿纸心算流程。

### 3.3 模式 3：极速心算盲打竞技（速度与肌肉记忆）
- **大触控虚拟键盘**：采用 84rpx+ 防误触按键设计，九宫格布局。
- **自动光标流转**：输入前两位自动跳格至后两位，支持连续 Combo 动效与即时音效反馈。

### 3.4 模式 4：小老师改错纠错挑战（元认知深化）
- **情景化作业本**：呈现虚拟同学（如小明、乐乐）的算式，故意混入真实学生常犯的典型错误。
- **反向找茬问答**：例如让学生选出“小明把 52-28 算成 34，究竟错在哪一步？”引导学生识别易错点。

### 3.5 模式 5：智能错题重练攻克（复习闭环）
- **挂起队列优先**：从 `mistakes` 过滤 `resolved === false` 的题目。
- **现场攻克**：一旦在错题模式中成功分步解出或盲打答对，系统即刻在底层标记 `resolved = true`，自动更新宇宙大厅挂起错题角标。

---

## 四、 四大核心速算规则插件与图解算理

所有速算规则插件遵循统一的声明式接口：
`{ id, title, category, layoutType, theme, mnemonic, keypadConfig, generateProblem, generateDaily5, getStepSequence }`。

### 4.1 插件 1：100 以内退位减法 (`sub_regroup.js`)
* **核心口诀**：`头减头减 1 ＝ 头 ； 尾 ＋ 尾(补数) ＝ 尾`
* **适用条件**：被减数个位小于减数个位（需退位借 1）。
* **防错辨别设计**：Level 2 随机混入 45% 的不退位题目（如 $58 - 23$），并在第 1 步设置辨识选项：`【个位够减，不需退位！】`，阻止盲目套用口诀。
* **算理图解模型（小棒拆捆）**：
  > 🎋 **以 $52 - 28$ 为例**：
  > 1. 十位有 5 捆小棒（50根），个位有 2 根单根。
  > 2. 个位 2 根不够拿 8 根，从十位借 1 捆（10根）拆开。
  > 3. 从拆开的 10 根中拿走 8 根，剩下的是 8 的补数：$10 - 8 = 2$ 根。
  > 4. 剩下的补数 2 根与原本个位的 2 根合并得 $2 + 2 = 4$ 根。
  > 5. 十位借走了 1 捆，所以头要减头还要减 1：$5 - 2 - 1 = 2$ 捆。答案：24！

### 4.2 插件 2：100 以内进位加法 (`add_carry.js`)
* **核心口诀**：`头 ＋ 头 ＋ 1 ＝ 头 ； 尾 ＋ 尾 － 10 ＝ 尾`
* **适用条件**：两数个位相加满 10。
* **防错辨别设计**：混入不满 10 的加法题（如 $34 + 25$），第一步辨别是否满十进位。
* **算理图解模型（小棒满十成捆）**：
  > 🎋 **以 $37 + 48$ 为例**：
  > 1. 个位 $7 + 8 = 15$ 根单根小棒。
  > 2. 取出 10 根扎成 1 个新的【十捆】，进位给十位。
  > 3. 个位单根只剩 $15 - 10 = 5$ 根。
  > 4. 十位原有 3 捆 + 4 捆，加上新扎的 1 捆，即 $3 + 4 + 1 = 8$ 捆。答案：85！

### 4.3 插件 3：任意两位数乘 11 (`mul_11.js`)
* **核心口诀**：`两头一拉，中间相加；满十向前进一`
* **视觉布局**：`inline_expand`（横向两头拉开）。
* **防泄露百位优化**：中间和满十前百位保持原十位数，计算进位步才动态进阶为最终百位。
* **算理图解模型（乘法分配律）**：
  $$\begin{aligned}
  AB \times 11 &= (A \times 10 + B) \times (10 + 1) \\
  &= A \times 100 + (A + B) \times 10 + B
  \end{aligned}$$
  > 观察展开式：百位是 $A$（原十位），个位是 $B$（原个位），十位正好是 $(A + B)$。如果中间和满十，自然向百位进 1！

### 4.4 插件 4：头同尾合十乘法 (`mul_head_same.js`)
* **核心口诀**：`头 × (头 ＋ 1) 写前边 ； 尾 × 尾 写后边 (占两位)`
* **适用条件**：两乘数十位相同，且个位相加等于 10（如 $34 \times 36$, $72 \times 78$）。
* **算理图解模型（矩形面积拼图）**：
  > 设十位数为 $H$，两尾分别为 $a$ 和 $b$，其中 $a + b = 10$：
  $$\begin{aligned}
  (10H + a)(10H + b) &= 100H^2 + 10H(a + b) + ab \\
  &= 100H^2 + 10H(10) + ab \\
  &= 100H^2 + 100H + ab \\
  &= 100H(H + 1) + ab
  \end{aligned}$$
  > 面积公式直观证明：提取公因式后，百位部分正好是 $H \times (H + 1)$，个位部分就是 $a \times b$！

---

## 五、 智能错因诊断引擎与闭环错题本

### 5.1 错因特征库配置 (`diagnosis.js`)
引擎根据当前步骤 `stepId` 与用户点击的值 `userValue` 进行模式匹配：

```javascript
const ERROR_DIAGNOSES = {
  SUB_FORGOT_HEAD_MINUS_ONE: {
    tag: '忘了头还要减1',
    advice: '被减数个位不够，向十位借了1，十位必须多减1哦！',
    detail: '常出现在算十位时，直接用“头减头”却漏掉了借走的 1。'
  },
  SUB_WRONG_COMPLEMENT: {
    tag: '补数找错了',
    advice: '补数是和减数个位“凑成 10”的数，如 8 的补数是 2，7 的补数是 3。',
    detail: '没有正确凑成 10，导致尾巴加错了数。'
  },
  SUB_UNNEEDED_REGROUP: {
    tag: '不该退位却退位了',
    advice: '被减数个位已经大于或等于减数个位，直接减即可，千万别多借位！',
    detail: '盲目套用口诀导致多减了 1。'
  },
  MUL11_FORGOT_CARRY: {
    tag: '乘11中间满十漏进一',
    advice: '两头一拉中间相加，如果中间和满十（≥10），百位必须 ＋1！',
    detail: '比如 68×11，中间 6+8=14，百位 6 要进位变成 7（答案 748）。'
  }
};
```

### 5.2 诊断与出入库流程
1. **入库触发**：分步答错或盲打提交错误时，调用 `recordMistake(ruleId, problem, stepId, userValue)`。
2. **容量控制**：本地错题上限 50 道，先进先出，杜绝 `wx.setStorageSync` 超限。
3. **出库闭环**：在错题模式完成该题后调用 `resolveMistake(exprStr)`，标记 `resolved: true`。

---

## 六、 零资源依赖的纯前端音频引擎

为杜绝音频文件丢包、404 或加载延迟，采用微信底层的 `WebAudioContext` 纯物理正弦波与三角波振荡器合成：

```javascript
// pages/math_arena/audio.js
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof wx !== 'undefined' && wx.createWebAudioContext) {
      try {
        this.ctx = wx.createWebAudioContext();
      } catch (e) {}
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playClick() {
    this.playTone(600, 'triangle', 0.05, 0.08); // 仿木鱼敲击
  }

  playCorrect() {
    this.playTone(523.25, 'sine', 0.12, 0.12); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.18, 0.14), 100); // E5 大三度上扬
  }

  playVictory() {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.16), idx * 110);
    }); // C5 - E5 - G5 - C6 琶音
  }

  playWrong() {
    this.playTone(220, 'sawtooth', 0.22, 0.09); // A3 锯齿波低音提示
  }
}

module.exports = new SoundSynthesizer();
```

---

## 七、 排坑实战与高可用性能优化

### 7.1 微信开发者工具“模拟器长时间没有响应 / 死循环警告”
* **现象**：修改代码或启动时，模拟器白屏，弹出 `模拟器长时间没有响应，请确认你的业务逻辑中是否有复杂运算，或者死循环`。
* **根因 1（无界 while 循环）**：
  在选项生成器中直接写 `while (opts.size < 3)`。如果传入了 `NaN`、`undefined` 或超出区间的数字，循环永远无法满足退出条件，彻底卡死主线程。
  * **修复方案**：引入最大迭代上限（`attempts < 15`）与保底补位循环。
  ```javascript
  function makeOptions(correct) {
    const c = typeof correct === 'number' && !isNaN(correct) ? correct : 0;
    const opts = new Set([c]);
    let attempts = 0;
    while (opts.size < 3 && attempts < 15) {
      attempts++;
      const delta = Math.floor(Math.random() * 5) - 2;
      if (delta !== 0 && c + delta >= 0) opts.add(c + delta);
    }
    let fill = 0;
    while (opts.size < 3) {
      if (!opts.has(fill)) opts.add(fill);
      fill++;
    }
    return Array.from(opts).slice(0, 3).sort((x, y) => x - y);
  }
  ```
* **根因 2（setData 传递函数对象引发深拷贝阻塞）**：
  小程序逻辑层向渲染层传递数据时会做 JSON 序列化。如果将挂载了 `generateProblem` 等函数的复杂插件对象整体 `setData({ rule })`，会触发大面积遍历或引发警告。
  * **修复方案**：`this.setData` 只传入剔除函数后的纯展示字典（`ruleViewData`），计算方法通过页面单例 `this.getRule()` 调用。

### 7.2 凌晨打卡跨时区断签 Bug（UTC vs Local）
* **现象**：`new Date().toISOString().split('T')[0]` 采用 UTC 时间，在东八区凌晨 00:00 ~ 07:59 会判定为前一天，导致早起晨读打卡算作“断签”。
* **修复方案**：编写基于本地时间戳计算的日期生成器：
  ```javascript
  function getLocalDateStr(offsetDays = 0) {
    const d = new Date(Date.now() + offsetDays * 86400000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  ```

### 7.3 WXML `wx:for` 遍历非数组报错
* **现象**：部分基础库在执行 `wx:for="{{currentProblem.meta.visualPrinciple.bundlesCount}}"`（若传入为数字）时，会抛出非预期行为或在空数据下报空指针。
* **修复方案**：规则元数据中同时输出 `bundlesList: new Array(aTens).fill(0)`，WXML 中统一使用 `wx:for="{{currentProblem.meta.visualPrinciple.bundlesList || [0,0,0]}}"`。

---

## 八、 核心目录结构与完整接口规范

```
wechat_miniprogram_helloworld/
├── pages/
│   ├── math_universe/          # 算术速算宇宙大厅
│   │   ├── math_universe.js
│   │   ├── math_universe.json
│   │   ├── math_universe.wxml
│   │   └── math_universe.wxss
│   └── math_arena/             # 通用速算对决竞技场
│       ├── math_arena.js       # 核心状态机与交互控制器
│       ├── math_arena.json
│       ├── math_arena.wxml      # 呼吸灯、双战场布局、键盘、小老师、算理弹窗
│       ├── math_arena.wxss      # 护眼微质感设计系统
│       ├── audio.js            # WebAudio 纯物理合成器
│       ├── diagnosis.js        # 智能错因归因引擎
│       ├── teacherMode.js      # 小老师批改题库与找茬生成器
│       └── rules/              # 规则插件系统
│           ├── index.js        # 规则总入口与星系列表
│           ├── sub_regroup.js  # 100以内退位减法 (补数法)
│           ├── add_carry.js    # 100以内进位加法 (高位心算)
│           ├── mul_11.js       # 任意两位数乘11 (两头拉开)
│           └── mul_head_same.js# 头同尾合十 (几何矩形展开)
└── docs/
    └── arithmetic_universe_framework.md # 规范与演进文档
```

---

## 九、 跨端移植指南

若需将本项目移植至其他框架（如 Vue 3 / React / Uni-app / Web）：

### 9.1 纯逻辑零修改直接复用
* `rules/*.js`、`diagnosis.js`、`teacherMode.js` 为**纯 JavaScript (CommonJS/ESM)**，不依赖任何微信专有 API。只需将 `module.exports` 改为 `export default` 即可直接在 Vue/React 中 `import` 使用。

### 9.2 存储层替换
* 小程序中的 `wx.getStorageSync` / `wx.setStorageSync` 替换为 Web 标准的 `localStorage.getItem` / `localStorage.setItem`。

### 9.3 音频层替换
* `audio.js` 中的 `wx.createWebAudioContext()` 替换为标准 HTML5 Web Audio API：`new (window.AudioContext || window.webkitAudioContext)()`。其余振荡器与频点代码无需做任何修改。

---

> **结语**：本项目通过配置驱动的插件架构，将传统的单一计算题演变为涵盖**算理透视、防错辨析、逆向找茬与肌肉记忆**的完整学习闭环，兼顾极高的扩展性与零云端维护成本，为少儿数感启蒙与心算教学提供了标准化工业级工程参考。
