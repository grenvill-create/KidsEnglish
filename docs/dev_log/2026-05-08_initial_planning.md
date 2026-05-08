# 开发日志 - 2026年5月8日：技术架构最终确认

## 1. 讨论内容总结
今天我们对项目的后端服务进行了最终选型。由于 LeanCloud 停止服务，我们转向了更现代、全球通用的 **Supabase** 方案。

## 2. 关键决策
*   **后端选型：Supabase**
    *   理由：国际化方案中对国内访问最友好的选项之一（API 可直连），功能强大且免费。
    *   安全：决定**开启 RLS (Row Level Security)**，以保证数据安全性，后续将通过 SQL 策略进行配置。
*   **架构完善**：确立了“家长录入”功能与 Supabase 表结构的对应关系。

## 3. 技术路线
*   前端：React (Vite)
*   后端：Supabase (PostgreSQL)
*   发音：Web Speech API (浏览器原生)

## 4. 待办事项 (TODO)
*   [ ] 拿到 Supabase API Credentials (URL & Key)。
*   [ ] 初始化 Vite 项目并在 `kidsenglish` 目录下安装 `@supabase/supabase-js`。
*   [ ] 创建初始的数据库表结构 (Vocabulary, Progress)。

---
*注：本日志已同步至 GitHub。*
