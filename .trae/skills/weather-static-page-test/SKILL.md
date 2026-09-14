---
name: weather-static-page-test
description: 体感温度计算器静态项目（d:\Projects\weather\weather）的修改→本地预览→浏览器实测工作流与避坑指南。当修改该项目的 index.html/style.css/app.js、启动本地预览、或用 MCP 浏览器工具（Exec / browser_*）实测验证页面功能时使用。
---

# 体感温度计算器：改静态文件 → 预览 → 浏览器实测

## 项目背景

- 纯静态无构建项目，仅三个文件：index.html / style.css / app.js（工作区根目录，勿新建其他文件）
- 功能模块：体感温度仪表盘与计算器（中国气象局 QX/T 500-2019 公式，`cmaFeels(tC, rh, windKmh, season)`，17°C 切夏/冬分支）、当前位置实况（中央气象台 nmc.cn）、夏/冬速查表（湿度列 × 气温行矩阵）
- 结构要点：选项卡为横向滑动面板 `#panels`（scroll-snap），指示器 `#tabIndicator` 宽度 = `calc((100% - 8px) / N)` 与 `.tab` 数量一致；新增面板时需同步：JS `panelHeights` 数组长度、`applyActive` 末尾的自动定位索引（`lwAutoLoad` 当前在 index 2 触发）、鼠标拖拽排除区 `.lookup__scroll`
- 速查表 `.lookup__scroll` 限高 360px 双向滚动，湿度表头吸顶（thead th sticky top）、气温首列吸左（tbody th sticky left）、左上角 z-index 3

## 修改流程

1. 优先 Edit 修改现有文件；不创建文档文件；未经用户要求不 git commit
2. 每轮修改后把 index.html 里 `style.css?v=N`、`app.js?v=N` 的 N 递增（防浏览器缓存）
3. 本地预览：`python -m http.server 8765` 后台运行（URL http://localhost:8765/）；已在跑则复用，勿重复起服
4. 用 integrated_code_mode 的 browser_* 工具实测；定位测试用 geolocation 桩（见下）

## browser_evaluate / Exec 避坑（实测踩坑总结，务必遵守）

- `script` 必须是单个表达式或分号串联的语句；箭头函数、IIFE、`return`、数组 `.map` 常返回 undefined 或抛 "cloned" 错误。多行逻辑包进 `try{...}catch(e){...}`
- 返回值从 `r.content[0].text` 读取；需要多个值时逐条 `await browser_evaluate`，不要在同一段脚本里塞太多步骤
- Promise/fetch 结果拿不到：测真实 CORS 连通性用同步 XHR 模板
  `try{var x=new XMLHttpRequest();x.open('GET','URL',false);x.send();'STATUS='+x.status+' BODY='+x.responseText.slice(0,200);}catch(e){'XHRERR='+e.message}`
- 等待异步链路：在 Exec JS 里 `await new Promise(r=>setTimeout(r, N))`，不要试图在 evaluate 内部等待
- 页面处于后台（`document.hidden === true`）时 rAF 与 smooth 滚动被暂停：`goTo` 的平滑滚动不生效、`browser_take_screenshot` 会超时。功能验证可注入垫片再走真实事件链路：
  `window.requestAnimationFrame=function(cb){setTimeout(function(){cb(performance.now());},16);};Element.prototype.scrollTo=function(o){if(o&&typeof o==='object'){this.scrollLeft=o.left;}else{this.scrollLeft=arguments[1];}}`
  视觉验证前先查 `document.hidden`，为 true 先激活标签页；截图偶发超时重试一次即可
- 布局/吸附断言用 `getBoundingClientRect` 差值（吸顶时 headTop=0、吸左时 cornerL=0、指示器 transform=translateX(i*100%)），不要依赖视觉猜测
- 读取行内文本用 `textContent.replace(/\s+/g,' ').trim()` 压缩空白
- `disabled` 按钮的 `.click()` 不派发事件（曾导致查询队列丢请求）：连续操作 UI 前确认目标按钮未 disabled
- geolocation 桩：成功 `navigator.geolocation.getCurrentPosition=function(ok,err){ok({coords:{latitude:22.543,longitude:114.057,accuracy:50}});}`；拒绝 `err({code:1})`；挂起用空函数体
- 定位/取数链路涉及真实网络（nmc.cn 单请求 1-3s；全国城市目录首次并发加载 3-8s），等待给足 7-10s

## 数据源要点

- nmc.cn：`/rest/province/all`（省列表）、`/rest/province/{省code}`（城市列表，首位通常是省会/主城区）、`/rest/weather?stationid={城市code}`（实况）；缺失字段哨兵值为字符串 `"9999"` 或数字 `9999`，展示前必须清洗
- 风速换算：nmc 给 m/s，页面统一 km/h（×3.6）
- `http://ip-api.com` 为 HTTP，仅 localhost 预览可用；HTTPS 部署需换 https 的 IP 定位兜底源
- 逆地理：`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=&longitude=&localityLanguage=zh`（免 Key）

## 完成标准

- `browser_console_messages` 无报错
- 关键链路逐条实测通过 + 截图确认视觉（Read 截图文件）
- 中文向用户汇报；代码引用用 file:/// 绝对路径 markdown 链接
