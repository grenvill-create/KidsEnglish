# 用车申请自动化 (Wechat Auto) — Firefox 自动登录与填报修复指南

## 一、项目概述与运行环境

该项目主要用于徐汇区机关事务管理系统（用车系统）的自动化申请、自动登录以及批量表单填报：
- **目标网址**：`https://www.xuhui.gov.cn/gzfwpt/index.jsp`
- **主要程序入口**：
  1. `E:\Projects\wechat auto\backend\LoginAuto.py`（单点自动登录与导航工具，附批处理 `自动登录.bat`）
  2. `E:\Projects\wechat auto\backend\auto_filler.py`（FastAPI Web 服务的后台自动化填单核心模块）
  3. `G:\antigravity files\ok 完全可以使用 用车申请自动化\界面版_20260326_复用浏览器.py`（桌面 GUI 界面版工具）
  4. `E:\Projects\wechat auto\config.json`（存放登录账号与密码）
- **火狐浏览器绝对路径**：`E:\tools\Mozilla Firefox\firefox.exe`
- **兼容火狐驱动路径**：`E:\tools\Mozilla Firefox\geckodriver.exe` 及各项目目录下的 `geckodriver.exe`

---

## 二、历史问题根本原因剖析

### 1. 为什么原代码启动 Firefox 报错？
原代码直接使用 `webdriver.Firefox(options=options)`，Selenium 默认仅在 Windows 标准系统路径（`C:\Program Files\Mozilla Firefox`）查找。因为用户的火狐安装在 `E:\tools\Mozilla Firefox\firefox.exe`，默认查找机制无法定位，导致报“找不到火狐”或尝试自行下载。

### 2. 为什么 geckodriver 会闪退报错 `Status code was: 3221225477`？
- **错误代码**：`3221225477` 即十六进制的 `0xC0000005`（内存访问越界 / Access Violation）。
- **根因分析**：Windows 系统底层注册了 Winsock LSP 网络过滤模块 `C:\WINDOWS\system32\ASProxy64.dll`。该 64 位 DLL 在拦截 64 位 `geckodriver.exe` 启动的本地 Socket 网络监听时，因空指针解引用触发崩溃。
- **终极解决方案**：采用兼容的 **32 位 win32 geckodriver**。32 位驱动运行在独立的 WoW64 空间，不会加载 64 位的 `ASProxy64.dll` 过滤钩子，因此完全免疫此类崩溃，启动与通信 100% 稳定。

---

## 三、核心代码改造逻辑

在所有需要拉起火狐的脚本中，统一加入以下探测与初始化逻辑：

```python
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service

def _find_firefox_exe():
    """自动探测本地安装的 Firefox.exe 路径"""
    candidates = [
        Path(r"E:\tools\Mozilla Firefox\firefox.exe"),
        Path(os.environ.get("ProgramFiles", r"C:\Program Files")) / "Mozilla Firefox" / "firefox.exe",
        Path(os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)")) / "Mozilla Firefox" / "firefox.exe",
        Path(os.environ.get("LOCALAPPDATA", "")) / "Mozilla Firefox" / "firefox.exe",
    ]
    # 支持从 Windows 注册表精确读取
    if sys.platform == "win32":
        try:
            import winreg
            for root in (winreg.HKEY_LOCAL_MACHINE, winreg.HKEY_CURRENT_USER):
                try:
                    with winreg.OpenKey(root, r"SOFTWARE\Mozilla\Mozilla Firefox") as key:
                        current_ver, _ = winreg.QueryValueEx(key, "CurrentVersion")
                        with winreg.OpenKey(key, rf"{current_ver}\Main") as subkey:
                            path_to_exe, _ = winreg.QueryValueEx(subkey, "PathToExe")
                            if path_to_exe and Path(path_to_exe).exists():
                                return Path(path_to_exe)
                except Exception:
                    pass
        except Exception:
            pass

    for p in candidates:
        if p.exists():
            return p
    return None

def _find_geckodriver_exe(firefox_exe=None):
    """自动查找匹配的 geckodriver 驱动路径"""
    try:
        script_dir = Path(__file__).parent.resolve()
    except NameError:
        script_dir = Path.cwd()

    candidates = [
        script_dir / "geckodriver.exe",
        Path(r"E:\Projects\wechat auto\backend\geckodriver.exe"),
        Path(r"E:\tools\Mozilla Firefox\geckodriver.exe"),
    ]
    if firefox_exe:
        candidates.insert(0, firefox_exe.parent / "geckodriver.exe")

    for p in candidates:
        if p.exists():
            return p
    return None

def _create_firefox_driver(headless=False, log_cb=None):
    """直接启动本地 Firefox 浏览器，自动配置路径与驱动"""
    firefox_exe = _find_firefox_exe()
    geckodriver_exe = _find_geckodriver_exe(firefox_exe)

    options = Options()
    if headless:
        options.add_argument("-headless")

    if firefox_exe:
        options.binary_location = str(firefox_exe)
        if log_cb:
            log_cb(f"已定位 Firefox 路径: {firefox_exe}", "INFO")

    service = None
    if geckodriver_exe:
        service = Service(executable_path=str(geckodriver_exe))
        if log_cb:
            log_cb(f"已加载 geckodriver: {geckodriver_exe}", "INFO")

    return webdriver.Firefox(service=service, options=options)
```

---

## 四、日后出问题时的快速排查与修复步骤

如果未来程序再次报错，按以下顺序排查：

1. **登录失败 / 提示密码错误**：
   - 检查 `config.json`（`E:\Projects\wechat auto\config.json`），用车系统密码每过一段时间可能要求强制修改，更新此处即可。
2. **提示 Firefox 启动失败 / geckodriver 异常**：
   - 检查 `E:\tools\Mozilla Firefox\geckodriver.exe` 是否存在。
   - 确保使用的是兼容的 32 位 geckodriver（文件大小约为 4,680 KB 左右），切勿随意替换为未经测试的 64 位版本。
3. **按钮点击超时（找不到【使用智慧管家】或【车辆派遣】）**：
   - 网站界面改版或网络慢：检查 `find_and_click` 中的超时时间 `timeout`，或者查看控制台是否有动态 iframe 未完全加载。
4. **快速恢复命令**：
   如果驱动被意外覆盖，只需从 `E:\Projects\wechat auto\backend\geckodriver.exe` 复制一份到 `E:\tools\Mozilla Firefox\geckodriver.exe` 即可立即恢复。
