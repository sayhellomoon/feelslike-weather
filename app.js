"use strict";

/* ---------- 国际化 i18n（zh-CN / en-US 双语） ----------
 * - 语言包以 JS 对象字面量内嵌（build.py 内联后单文件可用）
 * - 语言优先级：localStorage(qiwen_lang) > navigator.language > 默认 zh-CN
 * - 温度单位：localStorage(qiwen_unit) C|F，默认 C；公式内部恒以 °C 运算
 * - 数字本地化：温度/湿度用 toLocaleString，规避小数点显示差异
 * - 保留 GPU 检测 / 模糊开关 / GitHub / 检查更新 / Tab 动画原逻辑不动
 */
const I18N = {
  "zh-CN": {
    "app.title": "Qi温",
    "app.subtitle": "综合气温、湿度与风速，估算人体实际感受的温度",
    "tab.dash": "体感温度",
    "tab.calc": "计算器",
    "tab.loc": "当前位置",
    "tab.summer": "夏季速查",
    "tab.winter": "冬季速查",
    "tab.about": "关于",

    "dash.label": "当前体感温度",
    "dash.deltaPlaceholder": "请在「计算器」输入参数，或在「当前位置」获取实况",
    "dash.tile.temp": "实际气温",
    "dash.tile.rh": "相对湿度",
    "dash.tile.wind": "风速",
    "dash.btn.adjust": "调整参数",
    "dash.btn.loc": "获取位置天气",
    "dash.hint": "数据随「计算器」输入与「当前位置」实况实时联动 · 中国气象局 QX/T 500-2019",
    "dash.delta.match": "与实际气温 {t}{unit} 基本一致",
    "dash.delta.differs": "与实际气温 {t}{unit} 相比，体感{dir} {d}{unit}",
    "dash.delta.higher": "高",
    "dash.delta.lower": "低",
    "dash.formula.summer": "夏季分支",
    "dash.formula.winter": "冬季分支",
    "dash.formula.hum": "（湿度订正）",
    "dash.formula.wind": "（风速订正）",
    "dash.formula.result": "= 体感",
    "dash.formula.windMs": "V={v} m/s",
    "dash.formula.parenL": "（",
    "dash.formula.parenR": "）",
    "dash.formula.colon": "：",

    "result.label": "体感温度",
    "result.advicePlaceholder": "请输入气象参数",
    "standard.noaa": "NOAA 标准",
    "standard.gb": "国标温度",
    "standard.gap": "NOAA − 国标",
    "control.temp": "气温",
    "control.humidity": "相对湿度",
    "control.wind": "风速",
    "extra.heatIndex": "酷热指数（高温高湿）",
    "extra.windChill": "风寒指数（低温大风）",
    "extra.thiSub": "国标温湿指数（GB/T 27963）",
    "extra.thiLevel": "等级",
    "extra.colon": "：",
    "extra.sep": "　·　",
    "extra.hiGap": "NOAA 与国标温差",
    "extra.wcNoaa": "NOAA/NWS 国际标准值（2001 公式）",
    "extra.wcK": "国标风效指数 K（GB/T 27963，按日照 0h 估）",
    "extra.wcFeeling": "感觉",
    "extra.wcGap": "NOAA 与国标体感温差（QX/T 500）",
    "stdNote.heat": "NOAA 酷热指数 ｜ 国标 GB/T 27963-2011 温湿指数",
    "stdNote.wind": "NOAA/NWS 风寒指数 ｜ 国标 QX/T 500-2019 体感温度",
    "stdNote.noaaMissing": "该温区无对应 NOAA 指数，国标为 QX/T 500-2019 体感温度",
    "formulaNote": "体感温度按中国气象局 QX/T 500-2019 体感温度分段调整版公式（气温 + 湿度订正 ± 风速订正）实时估算；另以 NOAA 指数与 GB/T 27963-2011 作对照，结果仅供日常参考。",

    "loc.title": "当前位置实况",
    "loc.status": "获取当前定位，自动拉取中国气象局的气温、湿度与风速实况，并同步到计算器。",
    "loc.btn.locate": "获取当前位置天气",
    "loc.btn.manual": "手动选择城市",
    "loc.tile.temp": "气温",
    "loc.tile.rh": "相对湿度",
    "loc.tile.wind": "风速",
    "loc.card.sub": "按中国气象局 QX/T 500-2019 模型计算体感",
    "loc.card.synced": "以上实况已自动填入计算器，可回到「计算器」直接调整查看。",
    "loc.addr.placeholder": "填写城市名，如 深圳、哈尔滨、呼伦贝尔",
    "loc.btn.addCity": "添加城市",
    "loc.btn.clear": "清空列表",
    "loc.rows.city": "城市",
    "loc.rows.temp": "温度",
    "loc.rows.rh": "湿度",
    "loc.rows.wind": "风速",
    "loc.rows.action": "操作",
    "loc.manual.province": "选择省份",
    "loc.manual.city": "选择城市",
    "loc.manual.firstSelect": "请先选择省份",
    "loc.btn.query": "查询实况",
    "loc.source": "数据来源：中央气象台 nmc.cn 实时观测（中国气象局）；定位仅在本机浏览器使用，不会上传。",

    "lookup.summer.title": "夏季温湿度速查梯度表",
    "lookup.summer.range": "气温 18～45°C · 湿度 30～100% · QX/T 500-2019",
    "lookup.winter.title": "冬季温湿度速查梯度表",
    "lookup.winter.range": "气温 −30～15°C · 湿度 10～80%（适配冬季干燥、零下环境）· QX/T 500-2019",
    "lookup.winter.hint": "提示：冬季越潮湿体感越冷（湿冷效应），风越大进一步拉低体感——可在计算器中调整风速对照风寒指数。",
    "lookup.head.tempRh": "气温＼湿度",
    "lookup.cell.title": "气温 {t}°C，湿度 {rh}%，风速 {wind} km/h → 体感 {ts}°C（中国气象局 QX/T 500-2019）",
    "lookup.note.inSeason": "按中国气象局 QX/T 500-2019 分段调整版公式与当前风速 {wind} km/h 计算（单位 °C）；加粗描边框对应当前气温/湿度所在梯度。",
    "lookup.note.outSeason": "按中国气象局 QX/T 500-2019 分段调整版公式与当前风速 {wind} km/h 计算（单位 °C）；当前气温不在该季节范围，可切换到另一张速查表。",

    "about.title": "关于本应用",
    "about.version": "版本 v1.4.2",
    "about.section.model": "体感计算模型",
    "about.model.desc": "中国气象局 QX/T 500-2019 体感温度（分段调整版）",
    "about.model.formula": "夏季：Ts = T + (RH−70)/15 − (V−2)/2\n冬季：Ts = T − (RH−70)/15 − (V−2)/2",
    "about.section.ref": "对照参考",
    "about.ref.noaa": "NOAA/NWS 酷热指数与风寒指数",
    "about.ref.gb": "国标 GB/T 27963-2011 温湿指数与风效指数",
    "about.section.source": "数据来源",
    "about.source.nmc": "中央气象台 nmc.cn 实时观测（中国气象局）",
    "about.source.privacy": "定位仅在本机浏览器使用，不会上传。",
    "about.section.disclaimer": "免责声明",
    "about.disclaimer": "结果仅供日常参考，与专业气象预报可能存在差异。",
    "about.section.blur": "动态模糊效果",
    "about.blur.desc": "毛玻璃背景效果，关闭后以纯色背景替代，不影响功能。",
    "about.blur.tip": "天玑芯片：开启毛玻璃容易产生画面掉帧，建议保持关闭。",
    "about.btn.toggleBlur": "切换模糊效果",
    "about.section.repo": "开源仓库与更新",
    "about.repo.desc": "项目源码托管在 GitHub，欢迎反馈问题与建议。",
    "about.btn.github": "GitHub 仓库",
    "about.btn.checkUpdate": "检查更新",
    "about.section.lang": "语言",
    "about.lang.desc": "切换显示语言（重启后保持选择）",
    "about.lang.zh": "简体中文",
    "about.lang.en": "English",
    "about.section.unit": "温度单位",
    "about.unit.desc": "切换温度显示单位（公式内部仍以 °C 运算）",
    "about.unit.c": "摄氏度 °C",
    "about.unit.f": "华氏度 °F",

    "level.severeCold": "严寒",
    "level.severeColdAdvice": "极易冻伤，外出需严密封装保暖，避免长时间暴露",
    "level.cold": "寒冷",
    "level.coldAdvice": "注意保暖，建议穿厚外套并佩戴围巾、手套",
    "level.cool": "凉爽",
    "level.coolAdvice": "体感偏凉，建议穿着外套或长袖衣物",
    "level.comfort": "舒适",
    "level.comfortAdvice": "体感舒适，适合户外活动",
    "level.warm": "温暖",
    "level.warmAdvice": "略感温热，穿轻薄衣物即可，注意补水",
    "level.hot": "炎热",
    "level.hotAdvice": "出汗增多，避免暴晒，注意防暑补水",
    "level.veryHot": "酷热",
    "level.veryHotAdvice": "易中暑，减少户外活动，谨防热射病",
    "level.extreme": "极度危险",
    "level.extremeAdvice": "极易发生重症中暑，避免一切非必要户外暴露",

    "thiLevel.cold": "寒冷",
    "thiLevel.cool": "冷",
    "thiLevel.comfort": "舒适",
    "thiLevel.warm": "热",
    "thiLevel.stuffy": "闷热",
    "kLevel.cold": "寒冷",
    "kLevel.cool": "冷",
    "kLevel.comfort": "舒适",
    "kLevel.warm": "热",
    "kLevel.stuffy": "闷热",

    "update.invalidTemp": "请输入有效的气温",
    "blur.onToast": "动态模糊已开启",
    "blur.offToast": "动态模糊已关闭",
    "update.checking": "检查中…",
    "update.foundToast": "发现新版本 v{ver}，点击更新跳转下载",
    "update.foundDialog": "发现新版本 v{ver}\n\n当前版本 v{cur}\n\n是否前往下载？",
    "update.latestToast": "当前已是最新版本 v{ver}",
    "update.timeoutToast": "网络超时，请稍后重试",
    "update.failedToast": "检查更新失败，请检查网络",

    "lw.obsTime": "中央气象台观测时间：{time}",
    "lw.weatherNone": "天气实况暂无",
    "lw.windDetail": "{dirPower} · {ms} m/s（约 {kmh} km/h）",
    "lw.parenWrap": "（{x}）",
    "lw.synced": "已按{loc}获取 {city} 实况（{time}），气温/湿度/风速已同步到计算器。",
    "lw.fallbackNote": "注：",
    "lw.err.timeout": "网络请求超时，请稍后重试",
    "lw.err.permDenied": "浏览器定位权限被拒绝",
    "lw.err.noProv": "未能识别当前坐标所属省份",
    "lw.err.unknown": "未知错误",
    "lw.err.ipUnavailable": "IP 定位服务不可用",
    "lw.row.delete": "删除该城市",
    "lw.gettingGPS": "正在获取浏览器定位…",
    "lw.gpsDenied": "定位权限被拒绝",
    "lw.gpsUnavailable": "浏览器定位不可用",
    "lw.tryingIP": "正在尝试 IP 粗略定位…",
    "lw.geoParsing": "定位成功，正在解析所属省市…",
    "lw.noCityMatch": "未匹配到「{city}」，显示{prov}首位站点「{city2}」，可用下方手动选择精确城市。",
    "lw.matching": "匹配到 {prov}·{city}，正在拉取中央气象台实况…",
    "lw.autoFailed": "自动定位失败：{err}。可手动选择城市查询。",
    "lw.option.selectProv": "选择省份…",
    "lw.provFailed": "省份列表加载失败：{err}",
    "lw.option.loadingCities": "城市加载中…",
    "lw.option.citiesFailed": "城市列表加载失败",
    "lw.selectProvCity": "请先选择省份和城市。",
    "lw.querying": "正在拉取 {city} 的中央气象台实况…",
    "lw.label.manual": "手动选择",
    "lw.queryFailed": "查询失败：{err}",
    "lw.matchingAddr": "正在匹配「{text}」…",
    "lw.loadingDir": "首次使用正在加载全国城市目录（约数秒，之后本地即时匹配）…",
    "lw.dirFailed": "城市目录加载失败：{err}",
    "lw.noMatch": "未找到与「{text}」匹配的城市，可改用下方「手动选择城市」精确选取",
    "lw.label.addrQuery": "地址查询 · {text}",
    "lw.ambiguous": "「{text}」对应多个同名站点，当前显示「{city}」；可用手动选择精确指定。",
    "lw.queryAddrFailed": "查询「{text}」失败",
    "lw.fillAddrFirst": "请先填写要查询的城市名。",
    "lw.invalidInput": "请输入 2~20 位中文或字母的城市名（如 深圳），暂不支持数字和特殊符号。",
    "lw.noStationData": "该站暂无实况数据",
    "fps.peak": "峰值"
  },
  "en-US": {
    "app.title": "QiWen",
    "app.subtitle": "Estimate the perceived temperature from air temp, humidity and wind",
    "tab.dash": "Feels-like",
    "tab.calc": "Calculator",
    "tab.loc": "Location",
    "tab.summer": "Summer Quick",
    "tab.winter": "Winter Quick",
    "tab.about": "About",

    "dash.label": "Feels-like temperature",
    "dash.deltaPlaceholder": "Enter values in \"Calculator\" or fetch live data in \"Location\"",
    "dash.tile.temp": "Air temp",
    "dash.tile.rh": "Humidity",
    "dash.tile.wind": "Wind",
    "dash.btn.adjust": "Adjust inputs",
    "dash.btn.loc": "Get live weather",
    "dash.hint": "Updates live with Calculator inputs and Location data · CMA QX/T 500-2019",
    "dash.delta.match": "Matches the actual {t}{unit} temperature",
    "dash.delta.differs": "Feels {dir} {d}{unit} vs. actual {t}{unit}",
    "dash.delta.higher": "higher",
    "dash.delta.lower": "lower",
    "dash.formula.summer": "Summer branch",
    "dash.formula.winter": "Winter branch",
    "dash.formula.hum": "(humidity adj.)",
    "dash.formula.wind": "(wind adj.)",
    "dash.formula.result": "= feels-like",
    "dash.formula.windMs": "V={v} m/s",
    "dash.formula.parenL": " (",
    "dash.formula.parenR": ") ",
    "dash.formula.colon": ": ",

    "result.label": "Feels-like",
    "result.advicePlaceholder": "Enter weather parameters",
    "standard.noaa": "NOAA Standard",
    "standard.gb": "GB Standard",
    "standard.gap": "NOAA − GB",
    "control.temp": "Air temp",
    "control.humidity": "Relative humidity",
    "control.wind": "Wind speed",
    "extra.heatIndex": "Heat Index (hot & humid)",
    "extra.windChill": "Wind Chill (cold & windy)",
    "extra.thiSub": "GB THI (GB/T 27963)",
    "extra.thiLevel": "level",
    "extra.colon": ": ",
    "extra.sep": " · ",
    "extra.hiGap": "NOAA − GB gap",
    "extra.wcNoaa": "NOAA/NWS international value (2001 formula)",
    "extra.wcK": "GB wind effect K (GB/T 27963, sun=0h)",
    "extra.wcFeeling": "feeling",
    "extra.wcGap": "NOAA − GB perceived gap (QX/T 500)",
    "stdNote.heat": "NOAA Heat Index | GB/T 27963-2011 THI",
    "stdNote.wind": "NOAA/NWS Wind Chill | GB QX/T 500-2019 apparent T",
    "stdNote.noaaMissing": "No NOAA index at this range; GB is QX/T 500-2019 apparent T",
    "formulaNote": "Perceived temp follows CMA QX/T 500-2019 piecewise formula (T + humidity adj. ± wind adj.); NOAA and GB/T 27963-2011 are shown for reference only.",

    "loc.title": "Current location live weather",
    "loc.status": "Auto-fetch CMA live temp, humidity and wind for your location and feed them to the calculator.",
    "loc.btn.locate": "Get live location weather",
    "loc.btn.manual": "Pick city manually",
    "loc.tile.temp": "Air temp",
    "loc.tile.rh": "Humidity",
    "loc.tile.wind": "Wind",
    "loc.card.sub": "Feels-like (CMA QX/T 500-2019)",
    "loc.card.synced": "Live values have been fed into the Calculator. Switch back to adjust as needed.",
    "loc.addr.placeholder": "Enter a city, e.g. Shenzhen, Harbin",
    "loc.btn.addCity": "Add city",
    "loc.btn.clear": "Clear list",
    "loc.rows.city": "City",
    "loc.rows.temp": "Temp",
    "loc.rows.rh": "RH",
    "loc.rows.wind": "Wind",
    "loc.rows.action": "Action",
    "loc.manual.province": "Select province",
    "loc.manual.city": "Select city",
    "loc.manual.firstSelect": "Pick a province first",
    "loc.btn.query": "Fetch live",
    "loc.source": "Source: NMC nmc.cn live observations (CMA). Location is used only in the browser, never uploaded.",

    "lookup.summer.title": "Summer temp/humidity gradient table",
    "lookup.summer.range": "Temp 18–45°C · RH 30–100% · QX/T 500-2019",
    "lookup.winter.title": "Winter temp/humidity gradient table",
    "lookup.winter.range": "Temp −30–15°C · RH 10–80% (dry, sub-zero) · QX/T 500-2019",
    "lookup.winter.hint": "Tip: in winter, higher humidity feels colder (damp-cold effect); wind further lowers perceived temp. Compare wind chill in the Calculator.",
    "lookup.head.tempRh": "Temp\\RH",
    "lookup.cell.title": "Temp {t}°C, RH {rh}%, wind {wind} km/h → feels {ts}°C (CMA QX/T 500-2019)",
    "lookup.note.inSeason": "Per CMA QX/T 500-2019 piecewise formula at wind {wind} km/h (°C). Bold border = current temp/humidity cell.",
    "lookup.note.outSeason": "Per CMA QX/T 500-2019 piecewise formula at wind {wind} km/h (°C). Current temp is outside this season; switch to the other table.",

    "about.title": "About this app",
    "about.version": "Version v1.4.2",
    "about.section.model": "Apparent temperature model",
    "about.model.desc": "CMA QX/T 500-2019 apparent temperature (piecewise adjusted)",
    "about.model.formula": "Summer: Ts = T + (RH−70)/15 − (V−2)/2\nWinter: Ts = T − (RH−70)/15 − (V−2)/2",
    "about.section.ref": "References",
    "about.ref.noaa": "NOAA/NWS Heat Index and Wind Chill",
    "about.ref.gb": "GB/T 27963-2011 THI and wind-effect index",
    "about.section.source": "Data source",
    "about.source.nmc": "NMC nmc.cn live observations (CMA)",
    "about.source.privacy": "Location is used only in the browser, never uploaded.",
    "about.section.disclaimer": "Disclaimer",
    "about.disclaimer": "For daily reference only; may differ from professional forecasts.",
    "about.section.blur": "Dynamic blur",
    "about.blur.desc": "Frosted-glass background; turning off uses a solid color without affecting functionality.",
    "about.blur.tip": "MediaTek Dimensity: enabling blur can cause frame drops. Recommend keeping it off.",
    "about.btn.toggleBlur": "Toggle blur",
    "about.section.repo": "Open-source repo & updates",
    "about.repo.desc": "Hosted on GitHub. Feedback and suggestions welcome.",
    "about.btn.github": "GitHub repo",
    "about.btn.checkUpdate": "Check update",
    "about.section.lang": "Language",
    "about.lang.desc": "Switch display language (persists after restart)",
    "about.lang.zh": "简体中文",
    "about.lang.en": "English",
    "about.section.unit": "Temperature unit",
    "about.unit.desc": "Switch temperature display unit (formula still uses °C internally)",
    "about.unit.c": "Celsius °C",
    "about.unit.f": "Fahrenheit °F",

    "level.severeCold": "Severe cold",
    "level.severeColdAdvice": "High frostbite risk. Wear heavy insulation; avoid prolonged exposure.",
    "level.cold": "Cold",
    "level.coldAdvice": "Wear a heavy coat, scarf and gloves.",
    "level.cool": "Cool",
    "level.coolAdvice": "Slightly cool. A jacket or long sleeves recommended.",
    "level.comfort": "Comfortable",
    "level.comfortAdvice": "Comfortable. Ideal for outdoor activities.",
    "level.warm": "Warm",
    "level.warmAdvice": "Slightly warm. Light clothing; stay hydrated.",
    "level.hot": "Hot",
    "level.hotAdvice": "Sweating increases. Avoid direct sun; hydrate.",
    "level.veryHot": "Very hot",
    "level.veryHotAdvice": "Heatstroke risk. Limit outdoor activity.",
    "level.extreme": "Extreme danger",
    "level.extremeAdvice": "Severe heatstroke risk. Avoid all non-essential outdoor exposure.",

    "thiLevel.cold": "Cold",
    "thiLevel.cool": "Cool",
    "thiLevel.comfort": "Comfortable",
    "thiLevel.warm": "Warm",
    "thiLevel.stuffy": "Stuffy",
    "kLevel.cold": "Cold",
    "kLevel.cool": "Cool",
    "kLevel.comfort": "Comfortable",
    "kLevel.warm": "Warm",
    "kLevel.stuffy": "Stuffy",

    "update.invalidTemp": "Please enter a valid air temperature",
    "blur.onToast": "Dynamic blur enabled",
    "blur.offToast": "Dynamic blur disabled",
    "update.checking": "Checking…",
    "update.foundToast": "New version v{ver} available. Tap to open the download page.",
    "update.foundDialog": "New version v{ver} available.\n\nCurrent version v{cur}\n\nOpen the download page?",
    "update.latestToast": "You are on the latest version v{ver}",
    "update.timeoutToast": "Network timeout, please retry later",
    "update.failedToast": "Update check failed, please check your network",

    "lw.obsTime": "NMC observation time: {time}",
    "lw.weatherNone": "Live weather unavailable",
    "lw.windDetail": "{dirPower} · {ms} m/s (~{kmh} km/h)",
    "lw.parenWrap": " ({x})",
    "lw.synced": "Fetched {city} live via {loc} ({time}); temp/RH/wind fed into the calculator.",
    "lw.fallbackNote": "Note:",
    "lw.err.timeout": "Network request timed out, please retry later",
    "lw.err.permDenied": "Browser location permission denied",
    "lw.err.noProv": "Could not identify the province for your coordinates",
    "lw.err.unknown": "Unknown error",
    "lw.err.ipUnavailable": "IP geolocation unavailable",
    "lw.row.delete": "Delete this city row",
    "lw.gettingGPS": "Acquiring browser location…",
    "lw.gpsDenied": "Location permission denied",
    "lw.gpsUnavailable": "Browser geolocation unavailable",
    "lw.tryingIP": "Trying IP-based rough location…",
    "lw.geoParsing": "Location acquired. Resolving province/city…",
    "lw.noCityMatch": "No match for \"{city}\". Showing top station in {prov}: \"{city2}\". Pick a precise city below.",
    "lw.matching": "Matched {prov} · {city}. Fetching NMC live data…",
    "lw.autoFailed": "Auto location failed: {err}. You can pick a city manually.",
    "lw.option.selectProv": "Select province…",
    "lw.provFailed": "Province list load failed: {err}",
    "lw.option.loadingCities": "Loading cities…",
    "lw.option.citiesFailed": "City list load failed",
    "lw.selectProvCity": "Please select a province and city first.",
    "lw.querying": "Fetching NMC live data for {city}…",
    "lw.label.manual": "Manual pick",
    "lw.queryFailed": "Query failed: {err}",
    "lw.matchingAddr": "Matching \"{text}\"…",
    "lw.loadingDir": "Loading national city directory (a few seconds, then instant local match)…",
    "lw.dirFailed": "City directory load failed: {err}",
    "lw.noMatch": "No city matching \"{text}\". Use \"Pick city manually\" to choose one.",
    "lw.label.addrQuery": "Address query · {text}",
    "lw.ambiguous": "\"{text}\" matches multiple stations. Showing \"{city}\"; pick manually for precision.",
    "lw.queryAddrFailed": "Query for \"{text}\" failed",
    "lw.fillAddrFirst": "Please enter a city name first.",
    "lw.invalidInput": "Enter 2–20 letters or Chinese characters (e.g. Shenzhen). Numbers and symbols are not supported.",
    "lw.noStationData": "No live data for this station",
    "fps.peak": "peak"
  }
};

const LANG_KEY = "qiwen_lang";
const UNIT_KEY = "qiwen_unit";

let curLang = "zh-CN";
let curUnit = "C";

function detectLang() {
  // 优先 localStorage，其次 navigator.language，默认 zh-CN
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "zh-CN" || stored === "en-US") return stored;
  } catch (e) {}
  const navLang = (navigator.language || navigator.userLanguage || "zh-CN").toLowerCase();
  if (navLang.indexOf("en") === 0) return "en-US";
  return "zh-CN";
}

function detectUnit() {
  try {
    const stored = localStorage.getItem(UNIT_KEY);
    if (stored === "F" || stored === "C") return stored;
  } catch (e) {}
  return "C";
}

/** 翻译：支持 {var} 占位符 */
function t(key, vars) {
  let s = I18N[curLang]?.[key];
  if (s === undefined) s = I18N["zh-CN"][key];
  if (s === undefined) return key;
  if (vars) {
    for (const k in vars) {
      s = s.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
    }
  }
  return s;
}

/** 摄氏度 → 当前单位数值（不带符号） */
function toDisplayTemp(celsius, decimals) {
  if (celsius === null || celsius === undefined || Number.isNaN(celsius)) return "--";
  const dec = (decimals === undefined ? 1 : decimals);
  const v = curUnit === "F" ? celsius * 9 / 5 + 32 : celsius;
  const locale = curLang === "en-US" ? "en-US" : "zh-CN";
  return v.toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

/** 当前温度单位符号 */
function unitSymbol() {
  return curUnit === "F" ? "°F" : "°C";
}

/** 当前单位显示的数值字符串（带正负号，用于差异展示） */
function signedDisplayTemp(celsius, decimals) {
  if (celsius === null || celsius === undefined || Number.isNaN(celsius)) return "—";
  const dec = (decimals === undefined ? 1 : decimals);
  const v = curUnit === "F" ? celsius * 9 / 5 + 32 : celsius;
  const locale = curLang === "en-US" ? "en-US" : "zh-CN";
  const body = Math.abs(v).toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec });
  return (v >= 0 ? "+" : "−") + body;
}

/** 当前单位下风速单位字符串（风速不转换单位，仅本地化数字） */
function formatNumber(value, decimals) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  const dec = (decimals === undefined ? 1 : decimals);
  const locale = curLang === "en-US" ? "en-US" : "zh-CN";
  return value.toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

/** 温差绝对值转当前单位：温差换算只有 ×9/5，不做 +32 偏移 */
function displayDelta(celsiusDelta, decimals) {
  if (celsiusDelta === null || celsiusDelta === undefined || Number.isNaN(celsiusDelta)) return "--";
  const dec = (decimals === undefined ? 1 : decimals);
  const v = curUnit === "F" ? celsiusDelta * 9 / 5 : celsiusDelta;
  const locale = curLang === "en-US" ? "en-US" : "zh-CN";
  return Math.abs(v).toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

/** 温差带正负号转当前单位（用于 NOAA−国标差距、公式订正项等差值） */
function signedDisplayDelta(celsiusDelta, decimals) {
  if (celsiusDelta === null || celsiusDelta === undefined || Number.isNaN(celsiusDelta)) return "—";
  const dec = (decimals === undefined ? 1 : decimals);
  const v = curUnit === "F" ? celsiusDelta * 9 / 5 : celsiusDelta;
  const locale = curLang === "en-US" ? "en-US" : "zh-CN";
  const body = Math.abs(v).toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec });
  return (v >= 0 ? "+" : "−") + body;
}

/** 应用 i18n：遍历 [data-i18n] 写入静态文本，[data-unit] 写入单位符号 */
function applyI18n() {
  document.documentElement.lang = curLang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const text = t(key);
    if (text !== undefined && text !== key) {
      // 支持 <br> 换行：用 \n 分隔的多行用 <br> 渲染
      if (text.indexOf("\n") >= 0) {
        el.innerHTML = "";
        text.split("\n").forEach((line, i) => {
          if (i > 0) el.appendChild(document.createElement("br"));
          el.appendChild(document.createTextNode(line));
        });
      } else {
        el.textContent = text;
      }
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.dataset.i18nAriaLabel;
    el.setAttribute("aria-label", t(key));
  });
  document.querySelectorAll("[data-unit]").forEach((el) => {
    el.textContent = unitSymbol();
  });
  // 单位切换后温度输入范围/步长随之改变（输入数值仍按当前单位）
  applyUnitToInputs();
  // 语言/单位切换后刷新动态结果
  try { update(); } catch (e) {}
}

/** 温度输入框范围按当前单位调整：°F 时换算 min/max/step，输入值也换算
 *  注意：内部公式仍以 °C 运算；用户输入按当前单位解释，read 时转回 °C */
function applyUnitToInputs() {
  const temp = $("temp");
  const tempRange = $("tempRange");
  if (!temp || !tempRange) return;
  if (curUnit === "F") {
    temp.min = -58; temp.max = 140; temp.step = 0.1;
    tempRange.min = -58; tempRange.max = 140; tempRange.step = 0.1;
  } else {
    temp.min = -50; temp.max = 60; temp.step = 0.1;
    tempRange.min = -50; tempRange.max = 60; tempRange.step = 0.1;
  }
}

/** 读取温度输入并按当前单位转回 °C（公式运算统一 °C） */
function readTempC() {
  const raw = parseFloat($("temp").value);
  if (Number.isNaN(raw)) return NaN;
  return curUnit === "F" ? (raw - 32) * 5 / 9 : raw;
}

/** 把 °C 数值写入温度输入框（按当前单位显示） */
function setTempInput(celsius) {
  const v = curUnit === "F" ? celsius * 9 / 5 + 32 : celsius;
  const dec = curUnit === "F" ? 1 : 1;
  $("temp").value = v.toFixed(dec);
  $("tempRange").value = v.toFixed(dec);
}

/** 切换语言：保存 localStorage + 刷新静态文本 + 刷新动态结果 */
function switchLang(newLang) {
  if (newLang !== "zh-CN" && newLang !== "en-US") return;
  if (newLang === curLang) return;
  curLang = newLang;
  try { localStorage.setItem(LANG_KEY, newLang); } catch (e) {}
  const _langSel = $("langSelect");
  if (_langSel) _langSel.value = newLang;
  // 已构建的速查表表头/图例需要重建以应用新语言
  for (const cfg of LOOKUPS) {
    if (cfg.built) {
      cfg.built = false;
      cfg.windKey = null;
      cfg.cur = null;
      const tbl = $(cfg.tableId);
      if (tbl) {
        const th = tbl.querySelector("thead");
        const tb = tbl.querySelector("tbody");
        if (th) th.innerHTML = "";
        if (tb) tb.innerHTML = "";
      }
      const legend = $(cfg.legendId);
      if (legend) legend.innerHTML = "";
      // 注释段（#summerNote/#winterNote）也随表失效，避免切语言后残留旧语言文本
      const note = $(cfg.noteId);
      if (note) note.textContent = "";
    }
  }
  applyI18n();
  // 重新测量面板高度（表头文字宽度可能变化）
  setTimeout(() => {
    if (!clickAnim && !dragState.on) {
      measureHeights();
      track.style.height = panelHeights[activeIdx] + "px";
    }
  }, 50);
}

/** 切换单位：把当前输入按旧单位读出 → °C → 新单位写回，再刷新 */
function switchUnit(newUnit) {
  if (newUnit !== "C" && newUnit !== "F") return;
  if (newUnit === curUnit) return;
  // 读取当前温度输入（按旧单位）→ 转为 °C
  const rawT = parseFloat($("temp").value);
  const tC = Number.isNaN(rawT) ? NaN
    : (curUnit === "F" ? (rawT - 32) * 5 / 9 : rawT);
  curUnit = newUnit;
  try { localStorage.setItem(UNIT_KEY, newUnit); } catch (e) {}
  const _unitSel = $("unitSelect");
  if (_unitSel) _unitSel.value = newUnit;
  applyUnitToInputs();
  // 把 °C 按新单位写回（不触发 input 事件，applyI18n 末尾会调用 update）
  if (!Number.isNaN(tC)) {
    const v = newUnit === "F" ? tC * 9 / 5 + 32 : tC;
    $("temp").value = v.toFixed(1);
    $("tempRange").value = v.toFixed(1);
  }
  applyI18n();
}

/** 初始化语言+单位：从 localStorage/系统语言读取，再刷新一次静态文本 */
function initI18n() {
  curLang = detectLang();
  curUnit = detectUnit();
  // 如果当前是 F，把 HTML 默认值（按 °C 写的 28）转成 F
  if (curUnit === "F") {
    const tC = parseFloat($("temp").value);
    if (!Number.isNaN(tC)) {
      const vF = tC * 9 / 5 + 32;
      $("temp").value = vF.toFixed(1);
      $("tempRange").value = vF.toFixed(1);
    }
  }
  // 同步下拉框选中项
  const langSel = $("langSelect");
  if (langSel) langSel.value = curLang;
  const unitSel = $("unitSelect");
  if (unitSel) unitSel.value = curUnit;
  applyI18n();
}

/* ---------- 元素引用 ---------- */
const $ = (id) => document.getElementById(id);

const pairs = [
  ["temp", "tempRange"],
  ["humidity", "humidityRange"],
  ["wind", "windRange"],
];

/* ---------- 体感公式（中国气象局 QX/T 500-2019 分段调整版，见 cmaFeels） ---------- */

/**
 * NOAA 酷热指数（Rothfusz 回归公式），适用于高温高湿
 * 仅在气温 ≥ 26.7°C 时有参考意义
 */
function heatIndex(tC, rh) {
  const tF = (tC * 9) / 5 + 32;
  const hiF =
    -42.379 +
    2.04901523 * tF +
    10.14333127 * rh -
    0.22475541 * tF * rh -
    0.00683783 * tF * tF -
    0.05481717 * rh * rh +
    0.00122874 * tF * tF * rh +
    0.00085282 * tF * rh * rh -
    0.00000199 * tF * tF * rh * rh;
  return ((hiF - 32) * 5) / 9;
}

/**
 * NOAA/NWS 风寒指数（2001 美加联合标准）
 * 适用于气温 ≤ 10°C 且风速 ≥ 4.8 km/h
 */
function windChill(tC, windKmh) {
  const v16 = Math.pow(windKmh, 0.16);
  return 13.12 + 0.6215 * tC - 11.37 * v16 + 0.3965 * tC * v16;
}

/* ---------- 中国国标公式 ---------- */

/**
 * GB/T 27963-2011《人居环境气候舒适度评价》温湿指数 I
 * I = T − 0.55 × (1 − RH) × (T − 14.4)，RH 取 0~1 小数
 */
function thiIndex(tC, rh) {
  return tC - 0.55 * (1 - rh / 100) * (tC - 14.4);
}

function thiLevel(i) {
  if (i < 14.0) return "thiLevel.cold";
  if (i < 17.0) return "thiLevel.cool";
  if (i <= 25.4) return "thiLevel.comfort";
  if (i <= 27.5) return "thiLevel.warm";
  return "thiLevel.stuffy";
}

/**
 * GB/T 27963-2011 风效指数 K
 * K = −(10√V + 10.45 − V)(33 − T) + 8.55S
 * @param {number} sH 日照时数 h/d（无日照输入，按 0 估算）
 */
function windEffectK(tC, windKmh, sH = 0) {
  const v = windKmh / 3.6; // km/h -> m/s
  return -(10 * Math.sqrt(v) + 10.45 - v) * (33 - tC) + 8.55 * sH;
}

function kLevel(k) {
  if (k < -400) return "kLevel.cold";
  if (k < -300) return "kLevel.cool";
  if (k <= -100) return "kLevel.comfort";
  if (k <= -10) return "kLevel.warm";
  return "kLevel.stuffy";
}

/**
 * QX/T 500-2019《避暑旅游气候适宜度评价方法》附录 A 体感温度 Ts
 * V_RH 为湿度百分数，V 为风速 m/s；≥28°C 分支需日最高/最低气温，此处不适用
 */
function gbApparent(tC, rh, windKmh) {
  if (tC >= 28) return null;
  const v = windKmh / 3.6;
  if (tC > 17) return tC + (rh - 70) / 15 - (v - 2) / 2;
  return tC - (rh - 70) / 15 - (v - 2) / 2;
}

/* ---------- 感受分级（i18n：nameKey/adviceKey，渲染时用 t() 取本地化文本） ---------- */
const LEVELS = [
  { max: 0,          nameKey: "level.severeCold", color: "#1565c0", adviceKey: "level.severeColdAdvice" },
  { max: 10,         nameKey: "level.cold",       color: "#1e88e5", adviceKey: "level.coldAdvice" },
  { max: 18,         nameKey: "level.cool",       color: "#26a69a", adviceKey: "level.coolAdvice" },
  { max: 24,         nameKey: "level.comfort",    color: "#43a047", adviceKey: "level.comfortAdvice" },
  { max: 28,         nameKey: "level.warm",       color: "#f9a825", adviceKey: "level.warmAdvice" },
  { max: 32,         nameKey: "level.hot",        color: "#fb8c00", adviceKey: "level.hotAdvice" },
  { max: 38,         nameKey: "level.veryHot",    color: "#e53935", adviceKey: "level.veryHotAdvice" },
  { max: Infinity,   nameKey: "level.extreme",    color: "#b71c1c", adviceKey: "level.extremeAdvice" },
];

function levelOf(at) {
  return LEVELS.find((l) => at < l.max);
}

const lvlName = (l) => (l ? t(l.nameKey) : "");
const lvlAdvice = (l) => (l ? t(l.adviceKey) : "");

/** 带正负号的温差差异（用当前单位显示；温差换算无 +32 偏移） */
const signed = (v) => signedDisplayDelta(v, 1);

/* ---------- 输入联动 ----------
 * range 拖动每秒触发数十次 input，分两段处理：
 *  - input（拖动中）：仅镜像数值 + 轻量更新（体感结果文本/仪表盘），不触发
 *    syncHeights/renderLookups，避免面板高度反复 reflow → 画面闪动
 *  - change（松手后）：完整更新，含 syncHeights/renderLookups
 * 数字输入框 input 仍走完整更新（打字不会高频闪动） */
let updateQueued = false;
let updateLight = false;
function scheduleUpdate(light = false) {
  if (updateQueued) {
    // 已有排队帧：如果新请求是非轻量（完整），升级标记
    if (!light) updateLight = false;
    return;
  }
  updateQueued = true;
  updateLight = light;
  requestAnimationFrame(() => {
    updateQueued = false;
    const light = updateLight;
    updateLight = false;
    update(light);
  });
}

pairs.forEach(([numId, rangeId]) => {
  const num = $(numId);
  const range = $(rangeId);

  num.addEventListener("input", () => {
    if (num.value !== "") range.value = num.value;
    scheduleUpdate(); // 数字输入：完整更新
  });
  range.addEventListener("input", () => {
    num.value = range.value;
    scheduleUpdate(true); // 拖动中：轻量更新
  });
  range.addEventListener("change", () => {
    scheduleUpdate(false); // 松手：完整更新
  });
});

/* ---------- 选项卡与滑动面板 ---------- */
const track = $("panels");
const tabBtns = Array.from(document.querySelectorAll(".tab"));
const tabsBar = tabBtns[0] && tabBtns[0].closest(".tabs");
const indicator = $("tabIndicator");
const panelEls = Array.from(track.querySelectorAll(".panel"));
let panelHeights = [0, 0, 0, 0, 0, 0];
let activeIdx = 0;
let rafPending = false;
// 编程滚动（点击选项卡触发）的目标页：滚动途中不允许中间页回退高亮，防连点闪烁
let programmaticTarget = null;
// 点击切换动画令牌：正在进行的动画可被再次点击或用户手势随时作废（新一版接管）
let clickAnim = null;
// 运动态：指示器挂起 backdrop-filter；滚动静止 120ms 后判定结束
let settleTimer = null;

/* 策略A/D：动态模糊全局开关
   - 天玑芯片（MediaTek）：默认关闭，关于页面提示建议保持关闭
   - 高通 Adreno 等：默认开启，用户可手动关闭
   - 不硬编码手机型号，通过 userAgent 匹配 mediatek/mt6/mt8 判定天玑 */
const BLUR_KEY = "qiwen_blur";
const GITHUB_REPO = "https://github.com/sayhellomoon/feelslike-weather";
const CURRENT_VERSION = "1.4.2";

function detectMediaTek() {
  // 策略D：通过 userAgent 识别联发科天玑芯片（不硬编码手机型号）
  // 匹配关键词：mediatek、mt6（天玑系列）、mt8（曦力系列）
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mediatek") || ua.includes("mt6") || ua.includes("mt8"))
    return true;
  // WebGL 渲染器名兜底（部分 WebView UA 不含芯片信息）
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbg) {
        const r = (gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "").toLowerCase();
        if (r.includes("immortalis") || r.includes("mali-g"))
          return true;
      }
    }
  } catch (e) { /* WebGL 不可用，跳过 */ }
  return false;
}

let _isMediaTek = false;
function applyBlur(enabled) {
  if (enabled) document.body.classList.remove("no-blur");
  else document.body.classList.add("no-blur");
}
function initBlur() {
  _isMediaTek = detectMediaTek();
  let stored = null;
  try { stored = localStorage.getItem(BLUR_KEY); } catch (e) {}
  if (stored === null) {
    // 首次：天玑默认关闭，其他默认开启
    try { localStorage.setItem(BLUR_KEY, _isMediaTek ? "0" : "1"); } catch (e) {}
    applyBlur(!_isMediaTek);
  } else {
    applyBlur(stored === "1");
  }
  // 关于页面天玑提示
  const tip = document.getElementById("blurTip");
  if (tip) tip.style.display = _isMediaTek ? "" : "none";
}
function toggleBlur() {
  let cur = true;
  try { cur = localStorage.getItem(BLUR_KEY) !== "0"; } catch (e) {}
  const next = !cur;
  try { localStorage.setItem(BLUR_KEY, next ? "1" : "0"); } catch (e) {}
  applyBlur(next);
  return next;
}

/* 检查更新：读取 GitHub Releases，对比本地版本（i18n：所有提示走 t()） */
async function checkUpdate() {
  const btn = document.getElementById("checkUpdateBtn");
  if (btn) { btn.disabled = true; btn.textContent = t("update.checking"); }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const r = await fetch(
      "https://api.github.com/repos/" + GITHUB_REPO.replace("https://github.com/", "") + "/releases/latest",
      { signal: ctrl.signal, headers: { Accept: "application/vnd.github+json" } }
    );
    if (!r.ok) throw new Error("HTTP " + r.status);
    const data = await r.json();
    const latest = (data.tag_name || "").replace(/^v/, "");
    if (latest && latest !== CURRENT_VERSION) {
      const url = data.html_url || GITHUB_REPO + "/releases";
      showToast(t("update.foundToast", { ver: latest }), "ok");
      // 延迟弹窗，让 toast 先显示
      setTimeout(() => {
        if (confirm(t("update.foundDialog", { ver: latest, cur: CURRENT_VERSION })))
          window.open(url, "_blank");
      }, 200);
    } else {
      showToast(t("update.latestToast", { ver: CURRENT_VERSION }), "ok");
    }
  } catch (e) {
    if (e.name === "AbortError")
      showToast(t("update.timeoutToast"), "error");
    else
      showToast(t("update.failedToast"), "error");
  } finally {
    clearTimeout(timer);
    if (btn) { btn.disabled = false; btn.textContent = t("about.btn.checkUpdate"); }
  }
}

/* 点击切换固定时长（与跨页距离无关）——原生 scrollTo smooth 的时长随
 * 距离增长（跨 5 页在中端机上可达 1~3 秒），是肉眼延迟的根因；
 * easeOutCubic 下 t=90ms 已到位 99.9%（剩余位移 <0.15px），总时长 90ms，
 * 为高刷真机 GPU 调度抖动预留余量，保证「点击入口 → 视觉落位」≤150ms
 * （Edge 2x CPU 降速 + Redmi K60 120Hz 真机实测通过）。 */
const CLICK_ANIM_MS = 90;

// 性能探针（test_device.py 读取）：t0=点击监听入口，tVisual=首帧，tSettled=收尾帧
window.__qiwenPerf = { lastSwitch: null };

// 空闲回调（老 WebView 兜底 setTimeout），用于把全量高度测量移出交互关键路径
const ric =
  window.requestIdleCallback ||
  ((cb) => setTimeout(() => cb({ timeRemaining: () => 16, didTimeout: false }), 1));
const cic = window.cancelIdleCallback || ((id) => clearTimeout(id));
let idleMeasure = 0;

function setMotion(on) {
  if (!tabsBar) return;
  if (on) {
    tabsBar.classList.add("tabs--motion");
    // body 级运动态：挂起面板内随滚动物理移动的 backdrop-filter（高 DPR 真机实测掉帧源）
    document.body.classList.add("ui-motion");
    if (settleTimer) { clearTimeout(settleTimer); settleTimer = null; }
  } else {
    tabsBar.classList.remove("tabs--motion");
    document.body.classList.remove("ui-motion");
  }
}

/** 运动结束：恢复指示器玻璃模糊，清理预热面板，指示器精确对位（消除末帧舍入误差） */
function onSettled() {
  settleTimer = null;
  clickAnim = null;
  track.classList.remove("is-animating");
  // 策略B：延迟2帧再恢复 backdrop-filter（setMotion(false)），避开动画结束
  // 瞬间 GPU 提交任务峰值——联发科 GPU 在同批次提交大量图层合成任务时
  // 产生随机严重帧/冻结帧，延迟2帧让动画合成先完成再启用模糊
  requestAnimationFrame(() =>
    requestAnimationFrame(() => setMotion(false))
  );
  // content-visibility 复位 + 懒构建表数值填充都延迟到收尾之后的下一帧：
  // 避免末帧同步批量修改 6 个面板触发大布局，也不让 80 格数值写入/光栅
  // 与切换动画抢同一批帧（真机实测首入大表时会产生 ≥4 vsync 的严重卡顿帧）
  requestAnimationFrame(() => {
    for (const p of panelEls) p.style.contentVisibility = "";
    if (pendingFillCfg) {
      const cfg = pendingFillCfg;
      pendingFillCfg = null;
      fillPendingLookup(cfg);
    }
  });
  indicator.style.transform = `translateX(${activeIdx * 100}%)`;
}

/** 滚动持续期间每帧续期；最后一帧后 120ms 无新帧即判定静止（snap 保证静止点在页边界） */
function armSettle() {
  if (settleTimer) clearTimeout(settleTimer);
  settleTimer = setTimeout(onSettled, 120);
}

function measureHeights() {
  // 临时取消面板拉伸与高度约束，读取各自内容真实高度（同一同步任务内完成，无视觉闪烁）
  const prevTrackH = track.style.height;
  track.style.height = "auto";
  panelEls.forEach((p) => {
    p.style.alignSelf = "flex-start";
    p.style.height = "auto";
    p.style.contentVisibility = "visible"; // content-visibility 会让离屏面板报占位高度，测量时临时关闭
  });
  panelHeights = panelEls.map((p) => p.offsetHeight);
  panelEls.forEach((p) => {
    p.style.alignSelf = "";
    p.style.height = "";
    p.style.contentVisibility = "";
  });
  track.style.height = prevTrackH;
}

function currentIdx() {
  return Math.round(track.scrollLeft / track.clientWidth);
}

function applyActive(i) {
  // 缩小状态作用域：只更新前后两个选项卡按钮，不整排 toggle（避免无关样式失效）
  const prev = activeIdx;
  if (prev !== i) {
    tabBtns[prev].classList.remove("is-active");
    tabBtns[prev].setAttribute("aria-selected", "false");
    tabBtns[i].classList.add("is-active");
    tabBtns[i].setAttribute("aria-selected", "true");
  }
  activeIdx = i;
  // 指示器位置由动画帧 / scroll rAF 按真实滚动进度驱动；仅在已静止
  //（初始化/resize/点击当前页无滚动事件）时直接对位，避免运动中瞬切
  const w = track.clientWidth || 1;
  if (Math.abs(track.scrollLeft - i * w) <= 2) {
    indicator.style.transform = `translateX(${i * 100}%)`;
  }
  // 懒加载：数据/视图仅在首次进入时初始化，再进入直接复用 DOM 与缓存
  if (i === 2) lwAutoLoad();
  if (i === 3 || i === 4) ensureLookupBuilt(i);
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * 点击切换专用动画：固定时长、距离无关，单 rAF 内统一写
 * scrollLeft / 指示器 transform / 容器高度（浏览器每帧只提交一次）。
 * 指示器走 transform 合成属性；scroll 位移动画在当前 WebView 上随合成线程
 * 提交，手势滑动仍走原生 scroll-snap，两套路径互不干扰。
 */
function animateClick(to, rec) {
  const w = track.clientWidth || 1;
  const fromX = track.scrollLeft;
  const targetX = to * w;
  const fromIdx = Math.min(panelEls.length - 1, Math.max(0, Math.round(fromX / w)));
  const hFrom = panelHeights[fromIdx] || track.offsetHeight || 0;

  const token = {};
  clickAnim = token; // 作废任何在途的点击动画
  // 仅预热目标面板及其相邻面板：目标面板必须在落位帧前完成绘制，
  // 掠过的远层面板让 content-visibility:auto 自行按需渲染（空骨架极廉价），
  // 避免一次性强制渲染全部面板把切换首帧拉长到 30ms+；静止后由 onSettled 释放
  for (let k = to - 1; k <= to + 1; k++) {
    if (panelEls[k]) panelEls[k].style.contentVisibility = "visible";
  }
  setMotion(true);

  const t0 = performance.now();
  function frame(now) {
    if (clickAnim !== token) return; // 已被新手势/新点击接管
    let t = (now - t0) / CLICK_ANIM_MS;
    if (t >= 1) t = 1;
    if (rec && !rec.tVisual) rec.tVisual = now; // 第一帧已开始位移 = 视觉响应
    const e = easeOutCubic(t);
    const x = fromX + (targetX - fromX) * e;
    track.scrollLeft = x;
    indicator.style.transform = `translateX(${(x / w) * 100}%)`;
    // hTo 每帧动态读：懒构建表的首帧 measurePanelHeight 尚在 rAF 中，第二帧拿到正确值
    const hTo = panelHeights[to] || hFrom;
    if (hFrom && hTo) {
      const h = Math.round(hFrom + (hTo - hFrom) * e);
      // 仅在高度值实际变化时写样式，省掉无意义的布局失效
      if (track.style.height !== h + "px") track.style.height = h + "px";
    }
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      track.scrollLeft = targetX;
      indicator.style.transform = `translateX(${to * 100}%)`;
      const hFinal = panelHeights[to] || hFrom;
      if (hFinal) track.style.height = hFinal + "px";
      if (rec) rec.tSettled = performance.now(); // 视觉落位时刻（清理前）
      onSettled();
    }
  }
  requestAnimationFrame(frame);
}

function goTo(i) {
  i = Math.max(0, Math.min(panelEls.length - 1, i));
  const w = track.clientWidth || 1;
  // 零帧延迟反馈：文字颜色/ARIA 同刻切换（不等动画、不做任何计算）
  applyActive(i);
  // 已在目标页且无在途动画：不启动位移
  if (Math.abs(track.scrollLeft - i * w) <= 2 && !clickAnim) return;
  programmaticTarget = i;
  // 合成层提升只在运动期间存在，避免常驻大层占用低端机显存
  track.classList.add("is-animating");
  const rec = {
    from: currentIdx(),
    to: i,
    t0: performance.now(),
    tVisual: 0,
    tSettled: 0,
  };
  window.__qiwenPerf.lastSwitch = rec;
  animateClick(i, rec);
}

/** 测量单个面板内容真实高度（调用方保证不在运动关键帧） */
function measurePanelHeight(i) {
  const p = panelEls[i];
  if (!p) return;
  p.style.alignSelf = "flex-start";
  p.style.height = "auto";
  p.style.contentVisibility = "visible";
  panelHeights[i] = p.offsetHeight;
  p.style.alignSelf = "";
  p.style.height = "";
  p.style.contentVisibility = "";
}

/**
 * 空闲帧重测「内容可能变化」的轻量面板（多处触发只排一次）。
 * 已构建的速查大表（3/4）行高列宽固定、构建后高度恒定，永不重测——
 * 强制渲染两张 80 格大表会产生 60~90ms 长任务并卡住后续点击的收尾帧。
 * 运动期间自动改期；resize 走独立的全量 measureHeights（宽度变化才会影响表高）。
 */
function scheduleFullMeasure() {
  if (idleMeasure) cic(idleMeasure);
  idleMeasure = ric(() => {
    idleMeasure = 0;
    if (clickAnim || dragState.on) { scheduleFullMeasure(); return; }
    panelEls.forEach((p, i) => {
      const cfg = LOOKUPS[i - 3];
      if (cfg && cfg.built) return;
      measurePanelHeight(i);
    });
  });
}

/**
 * 输入导致面板内容高度变化：当前帧只精确测活动面板（1 次布局），
 * 全部面板的精确高度挪到空闲帧测量——滑动插值用缓存值，误差不可察。
 */
function syncHeights() {
  const p = panelEls[activeIdx];
  if (p) {
    p.style.alignSelf = "flex-start";
    p.style.height = "auto";
    panelHeights[activeIdx] = p.offsetHeight;
    p.style.alignSelf = "";
    p.style.height = "";
    if (!dragState.on && !clickAnim) {
      track.style.height = panelHeights[activeIdx] + "px";
    }
  }
  scheduleFullMeasure();
}

// 选项卡回调只绑定一次（稳定引用，无内联函数、无重复监听）
tabBtns.forEach((b) => {
  b.addEventListener("click", () => goTo(Number(b.dataset.tab)));
});

/* 体感温度仪表盘快捷跳转 */
$("dashToCalc").addEventListener("click", () => goTo(1));
$("dashToLoc").addEventListener("click", () => {
  goTo(2);
  lwLoadAuto(); // 进入当前位置卡并立即拉取一次实况
});

/* 触摸：原生 scroll-snap 滑动；鼠标：Pointer Events 拖拽 */
const dragState = { on: false, moved: false, axis: null, startX: 0, startY: 0, startLeft: 0, pointerId: null };

track.addEventListener("pointerdown", (e) => {
  programmaticTarget = null; // 任何用户手势接管，解除编程滚动的高亮锁定
  clickAnim = null;          // 作废在途点击动画，rAF 链下一帧自行退出
  track.classList.add("is-animating"); // 手势期间临时提升合成层，静止后移除
  // 手势接管即进入运动态（挂起指示器 backdrop-filter）；120ms 静止后收尾
  setMotion(true);
  // 未产生横滑的点按：120ms 后自动退出运动态；真实滑动会被 scroll 事件持续续期
  armSettle();
  if (e.pointerType !== "mouse") return; // 触摸/触控板交给原生滑动
  if (e.target.closest("input, button, select, textarea, a, label")) return;
  if (e.target.closest(".lookup__scroll")) return; // 速查表区域留给表格自身滚动
  dragState.on = true;
  dragState.moved = false;
  dragState.axis = null;
  dragState.startX = e.clientX;
  dragState.startY = e.clientY;
  dragState.startLeft = track.scrollLeft;
  dragState.pointerId = e.pointerId;
  track.setPointerCapture(e.pointerId);
});

track.addEventListener("pointermove", (e) => {
  if (!dragState.on || e.pointerId !== dragState.pointerId) return;
  const dx = e.clientX - dragState.startX;
  const dy = e.clientY - dragState.startY;

  if (dragState.axis === null) {
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
    dragState.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
  }
  if (dragState.axis !== "x") return;

  dragState.moved = true;
  track.classList.add("is-dragging");
  track.style.scrollSnapType = "none";
  track.scrollLeft = dragState.startLeft - dx;
  e.preventDefault();
});

function endDrag(e) {
  if (!dragState.on) return;
  const wasHorizontal = dragState.axis === "x";
  dragState.on = false;
  track.classList.remove("is-dragging");
  track.style.scrollSnapType = "";
  try { track.releasePointerCapture(dragState.pointerId); } catch (_) {}

  if (wasHorizontal) {
    goTo(currentIdx());
    if (dragState.moved) {
      // 拦截拖拽松手时误触发的 click
      const suppress = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        track.removeEventListener("click", suppress, true);
      };
      track.addEventListener("click", suppress, true);
    }
  }
}
track.addEventListener("pointerup", endDrag);
track.addEventListener("pointercancel", endDrag);

/* 滑动中：指示器按真实滚动进度逐帧对位（合成属性，1:1 跟手）+ 选项卡高亮 + 面板高度插值 */
track.addEventListener("scroll", () => {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    // 点击动画期间由 animateClick 在同一帧统一写位移/指示器/高度，
    // 这里再写一遍会造成同帧双重样式失效
    if (clickAnim) return;
    const w = track.clientWidth || 1;
    const progress = Math.min(panelEls.length - 1, Math.max(0, track.scrollLeft / w));
    const idx = Math.round(progress);
    // 指示器跟随滚动进度：纯 transform 写入，合成线程处理，与面板严格同步
    indicator.style.transform = `translateX(${progress * 100}%)`;
    // 吸附到位（误差 ≤2px）后解除编程滚动锁定
    if (programmaticTarget !== null && Math.abs(track.scrollLeft - programmaticTarget * w) <= 2) {
      programmaticTarget = null;
    }
    if (programmaticTarget === null && idx !== activeIdx) applyActive(idx);
    // 静止检测：滚动持续时每帧续期，停帧 120ms 即结束（mandatory snap 保证停在页边界）
    armSettle();
    // 相邻面板高度按滑动进度插值（手势滑动/惯性阶段）
    const lo = Math.floor(progress);
    const hi = Math.ceil(progress);
    if (panelHeights[lo]) {
      const nextH = Math.round(
        panelHeights[lo] + (panelHeights[hi] - panelHeights[lo]) * (progress - lo)
      );
      // 仅在高度值实际变化时写样式，省掉无意义的布局失效
      if (track.style.height !== nextH + "px") track.style.height = nextH + "px";
    }
  });
}, { passive: true });

let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    clickAnim = null;
    track.classList.remove("is-animating");
    if (settleTimer) { clearTimeout(settleTimer); settleTimer = null; }
    setMotion(false);
    measureHeights();
    track.scrollLeft = activeIdx * track.clientWidth;
    track.style.height = panelHeights[activeIdx] + "px";
    indicator.style.transform = `translateX(${activeIdx * 100}%)`;
  }, 120);
});

/**
 * 中国气象局 QX/T 500-2019 分段调整版体感温度 Ts（全站统一模型）
 * 夏季：Ts = T + (RH−70)/15 − (V−2)/2（高湿闷热，体感更高）
 * 冬季：Ts = T − (RH−70)/15 − (V−2)/2（高湿湿冷，体感更低）
 * 注：标准以 17°C 为分段点、T≥28 分支含日较差项 15/(Tmax−Tmin)；
 * 计算器按实测气温自动选分支，速查表按所属季节固定分支；
 * 均无日最高/最低温输入，故日较差项略去
 * @param {number} windKmh 风速 km/h，V 取 m/s
 * @param {"summer"|"winter"} season 分支：计算器按 tC>17 判定，表格固定
 */
function cmaFeels(tC, rh, windKmh, season) {
  const v = windKmh / 3.6;
  const hum = season === "winter" ? -(rh - 70) / 15 : (rh - 70) / 15;
  return tC + hum - (v - 2) / 2;
}

/* ---------- 夏 / 冬温湿度速查梯度表（均为 8 个湿度列，列对齐） ----------
 * 性能设计：
 *  - built：表骨架懒构建，首次进入该选项卡才创建 DOM（之后一直复用，切回不重建）
 *  - windKey：160 个单元格的数值/底色只依赖风速，风速不变则完全不重算
 *  - cur：当前温湿度高亮每帧至多迁移 1 个单元格（旧格恢复、新格高亮），
 *    绝不在拖动滑块时整表重绘
 */
const LOOKUPS = [
  {
    season: "summer",
    tableId: "summerTable",
    legendId: "summerLegend",
    noteId: "summerNote",
    temps: Array.from({ length: 10 }, (_, i) => 18 + i * 3), // 18~45°C，步长 3
    rhs: [30, 40, 50, 60, 70, 80, 90, 100],                  // %
    tTol: 1.6,
    cells: [],
    built: false,
    windKey: null,
    cur: null,
  },
  {
    season: "winter",
    tableId: "winterTable",
    legendId: "winterLegend",
    noteId: "winterNote",
    temps: Array.from({ length: 10 }, (_, i) => -30 + i * 5), // −30~15°C，步长 5
    rhs: [10, 20, 30, 40, 50, 60, 70, 80],                    // 冬季低湿度 %
    tTol: 2.6,
    cells: [],
    built: false,
    windKey: null,
    cur: null,
  },
];

/** 表骨架仅在首次进入该选项卡时创建一次；用单次 innerHTML 解析代替
 *  90+ 次 appendChild，把懒构建的一次性成本压到几毫秒，避免首入掉帧 */
function buildLookupDOM(cfg) {
  const thead = $(cfg.tableId).querySelector("thead");
  const tbody = $(cfg.tableId).querySelector("tbody");

  const headCells = [t("lookup.head.tempRh"), ...cfg.rhs.map((rh) => rh + "%")]
    .map((txt) => "<th>" + txt + "</th>")
    .join("");
  thead.innerHTML = "<tr>" + headCells + "</tr>";

  tbody.innerHTML = cfg.temps
    .map((t) => {
      const rowHead = (t < 0 ? "−" + Math.abs(t) : String(t)) + "°";
      return "<tr><th>" + rowHead + "</th>" + cfg.rhs.map(() => "<td></td>").join("") + "</tr>";
    })
    .join("");

  cfg.cells = cfg.temps.map((_, ti) =>
    Array.from(tbody.children[ti].children).slice(1)
  );

  $(cfg.legendId).innerHTML = LEVELS.map(
    (l) => `<span class="legend-item"><i style="background:${l.color}"></i>${lvlName(l)}</span>`
  ).join("");

  cfg.built = true;
  cfg.windKey = null; // 强制下一帧填充数值
}

/** 首次进入速查选项卡时懒构建：骨架同步（决定布局高度），数值全部跨帧填充，
 *  保证首入切换的点击任务不被 80 格 DOM 写入阻塞；之后进入直接复用 */
let pendingFillCfg = null;
function ensureLookupBuilt(i) {
  const cfg = LOOKUPS[i - 3];
  if (!cfg || cfg.built) return;
  buildLookupDOM(cfg);

  // 测量延迟到 rAF：避免 innerHTML 写 + offsetHeight 读在同一同步任务
  // 内产生 50ms+ 长任务。rAF 回调属于渲染管线步骤，不会被 PerformanceObserver
  // 计为 longtask。animateClick 每帧动态读 panelHeights，第二帧即拿到正确值
  requestAnimationFrame(() => {
    measurePanelHeight(i);
  });

  // 数值填充交给 animateClick 在动画的第 2 帧之后分块进行（见 fillPendingLookup）
  const inp = readInputs();
  if (inp) cfg.windKey = inp.windKmh.toFixed(1);
  pendingFillCfg = cfg;
  scheduleFullMeasure();
}

/** 懒构建表的数值分帧填充：每帧 5 行，避开切换首帧；面板落位时内容就绪 */
function fillPendingLookup(cfg) {
  const inp = readInputs();
  if (!inp) return;
  let ti = 0;
  (function fillRows() {
    const end = Math.min(cfg.temps.length, ti + 5);
    for (; ti < end; ti++) fillLookupRow(cfg, ti, inp.windKmh);
    if (ti < cfg.temps.length) requestAnimationFrame(fillRows);
    else renderLookupHighlight(cfg, inp.tC, inp.rh, inp.windKmh);
  })();
}

/** 填充一行 8 个单元格（值/分级色/title） */
function fillLookupRow(cfg, ti, windKmh) {
  const tC = cfg.temps[ti];
  cfg.rhs.forEach((rhCol, ri) => {
    const cell = cfg.cells[ti][ri];
    const ts = cmaFeels(tC, rhCol, windKmh, cfg.season);
    const lv = levelOf(ts);
    const rounded = Math.round(ts);
    cell.textContent = rounded < 0 ? "−" + Math.abs(rounded) : String(rounded);
    cell.dataset.color = lv.color; // 底色缓存在单元格上，高亮迁移时直接取用
    cell.style.background = lv.color + "22";
    cell.style.color = lv.color;
    cell.title = t("lookup.cell.title", { t: tC, rh: rhCol, wind: windKmh, ts: ts.toFixed(1) });
  });
}

/** 纯计算：80 个单元格的体感值/分级色只随风速变化，风速不变直接复用缓存 */
function renderLookupValues(cfg, windKmh) {
  const key = windKmh.toFixed(1);
  if (cfg.windKey === key) return;
  cfg.windKey = key;
  cfg.temps.forEach((t, ti) => fillLookupRow(cfg, ti, windKmh));
}

/** 增量高亮：全表至多旧格恢复 + 新格高亮，共 2 个单元格、8 次样式写 */
function renderLookupHighlight(cfg, tC, rh, windKmh) {
  const nearest = (target, list, maxDist) => {
    let best = -1;
    let bestDist = Infinity;
    list.forEach((v, i) => {
      const d = Math.abs(v - target);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return bestDist <= maxDist ? best : -1;
  };

  if (cfg.cur) {
    const old = cfg.cur;
    old.classList.remove("is-current");
    old.style.background = old.dataset.color + "22";
    old.style.color = old.dataset.color;
    cfg.cur = null;
  }

  // 与 QX/T 500-2019 分段点一致：T>17°C 归夏季表，否则冬季表
  const isSeason = cfg.season === (tC > 17 ? "summer" : "winter");
  if (isSeason) {
    const tIdx = nearest(tC, cfg.temps, cfg.tTol);
    const rhIdx = nearest(rh, cfg.rhs, 5.5);
    if (tIdx >= 0 && rhIdx >= 0) {
      const cell = cfg.cells[tIdx][rhIdx];
      cell.classList.add("is-current");
      cell.style.background = cell.dataset.color;
      cell.style.color = "#fff";
      cfg.cur = cell;
    }
  }

  $(cfg.noteId).textContent = t(
    isSeason ? "lookup.note.inSeason" : "lookup.note.outSeason",
    { wind: windKmh }
  );
}

/** 速查表统一渲染入口：未进入过的表完全不产生工作（懒加载语义） */
function renderLookups(tC, rh, windKmh) {
  for (const cfg of LOOKUPS) {
    if (!cfg.built) continue;
    renderLookupValues(cfg, windKmh);
    renderLookupHighlight(cfg, tC, rh, windKmh);
  }
}

/* ---------- 体感温度仪表盘（与计算器/定位实时联动） ---------- */
function updateDashboard(tC, rh, windKmh, at, level) {
  const hero = $("dashHero");
  hero.style.setProperty("--dash-color", level.color);
  hero.style.background =
    `linear-gradient(145deg, ${level.color}22, ${level.color}0d)`;

  // 内部恒以 °C 运算；显示按当前单位（°C / °F）转换
  $("dashFeels").textContent = toDisplayTemp(at, 1);
  $("dashBadge").textContent = lvlName(level);
  $("dashTemp").textContent = toDisplayTemp(tC, 1);
  $("dashRh").textContent = formatNumber(Math.round(rh), 0);
  $("dashWind").textContent = formatNumber(Math.round(windKmh * 10) / 10, 1);
  $("dashAdvice").textContent = lvlAdvice(level);

  const diff = at - tC; // 都是 °C，差值也是 °C；显示时按当前单位转换
  $("dashDelta").textContent =
    Math.abs(diff) < 0.05
      ? t("dash.delta.match", { t: toDisplayTemp(tC, 1), unit: unitSymbol() })
      : t("dash.delta.differs", {
          t: toDisplayTemp(tC, 1),
          dir: t(diff > 0 ? "dash.delta.higher" : "dash.delta.lower"),
          d: displayDelta(diff, 1),
          unit: unitSymbol(),
        });

  // 公式分解：夏季 T+(RH−70)/15−(V−2)/2；冬季 T−(RH−70)/15−(V−2)/2（V 取 m/s）
  const season = tC > 17 ? "summer" : "winter";
  const rhCorr = (rh - 70) / 15;
  const vMs = windKmh / 3.6;
  const windCorr = -(vMs - 2) / 2;
  const rhPart = (season === "summer" ? rhCorr : -rhCorr);
  // 公式分解中的湿度/风速订正是温差量（°C），换算只 ×9/5 不加 32
  const fmt = (x) => signedDisplayDelta(x, 1);
  $("dashFormula").textContent =
    `${t(season === "summer" ? "dash.formula.summer" : "dash.formula.winter")}` +
    `${t("dash.formula.parenL")}${t("dash.formula.windMs", { v: vMs.toFixed(1) })}${t("dash.formula.parenR")}${t("dash.formula.colon")}` +
    `${toDisplayTemp(tC, 1)} ${fmt(rhPart)}${t("dash.formula.hum")} ${fmt(windCorr)}${t("dash.formula.wind")}\n` +
    `${t("dash.formula.result")} ${toDisplayTemp(at, 1)}${unitSymbol()}`;
}

/* ---------- 主更新（由 rAF 合并调度，每帧最多一次） ---------- */
function readInputs() {
  // 温度输入按当前单位读取，转回 °C 供公式运算（统一 °C）
  const tC = readTempC();
  if (Number.isNaN(tC)) return null;
  const rh = Math.min(100, Math.max(0, parseFloat($("humidity").value) || 0));
  const windKmh = Math.max(0, parseFloat($("wind").value) || 0);
  return { tC, rh, windKmh };
}

function update(light = false) {
  const tC = readTempC();
  const rh = Math.min(100, Math.max(0, parseFloat($("humidity").value) || 0));
  const windKmh = Math.max(0, parseFloat($("wind").value) || 0);

  if (Number.isNaN(tC)) {
    $("feelsLike").textContent = "--";
    $("levelBadge").textContent = "--";
    $("advice").textContent = t("update.invalidTemp");
    $("dashFeels").textContent = "--";
    $("dashBadge").textContent = "--";
    $("dashDelta").textContent = t("update.invalidTemp");
    $("dashTemp").textContent = "--";
    $("dashRh").textContent = "--";
    $("dashWind").textContent = "--";
    $("dashAdvice").textContent = "";
    $("dashFormula").textContent = "";
    $("heatIndexBox").hidden = true;
    $("windChillBox").hidden = true;
    $("noaaVal").textContent = "--";
    $("gbVal").textContent = "--";
    $("gapVal").textContent = "--";
    $("stdNote").textContent = "";
    syncHeights();
    return;
  }

  // 主体感温度：中国气象局 QX/T 500-2019 分段调整版，>17°C 走夏季分支
  const at = cmaFeels(tC, rh, windKmh, tC > 17 ? "summer" : "winter");
  const level = levelOf(at);

  $("feelsLike").textContent = toDisplayTemp(at, 1);
  const badge = $("levelBadge");
  badge.textContent = lvlName(level);
  badge.style.background = level.color;
  $("advice").textContent = lvlAdvice(level);
  $("result").style.background =
    `linear-gradient(145deg, ${level.color}1a, ${level.color}0d)`;

  updateDashboard(tC, rh, windKmh, at, level);

  const isHot = tC >= 26.7;
  const isColdWind = tC <= 10 && windKmh >= 4.8;

  // NOAA 标准值 / 国标温度 / 差距（体感温度下方对比条）
  let noaaValue = null;
  let gbValue = null;
  let stdNote = "";

  if (isHot) {
    const hi = heatIndex(tC, rh);
    const thi = thiIndex(tC, rh);
    noaaValue = hi;
    gbValue = thi;
    stdNote = t("stdNote.heat");

    $("heatIndexBox").hidden = false;
    $("heatIndex").textContent = toDisplayTemp(hi, 1);
    $("gbThi").textContent = toDisplayTemp(thi, 1);
    $("gbThiLevel").textContent = t(thiLevel(thi));
    $("hiGap").textContent = signed(hi - thi);
  } else {
    $("heatIndexBox").hidden = true;
    // 隐藏时清空，避免上一场景的旧语言/旧单位文本残留在隐藏 DOM 中
    $("heatIndex").textContent = "--";
    $("gbThi").textContent = "--";
    $("gbThiLevel").textContent = "--";
    $("hiGap").textContent = "--";
  }

  if (isColdWind) {
    const wc = windChill(tC, windKmh);
    const gbTs = gbApparent(tC, rh, windKmh); // tC≤10 走 QX/T 500 低温分支
    const k = windEffectK(tC, windKmh);
    noaaValue = wc;
    gbValue = gbTs;
    stdNote = t("stdNote.wind");

    $("windChillBox").hidden = false;
    $("windChill").textContent = toDisplayTemp(wc, 1);
    $("wcNoaa").textContent = toDisplayTemp(wc, 1);
    $("wcK").textContent = formatNumber(Math.round(k), 0);
    $("wcKLevel").textContent = t(kLevel(k));
    $("wcGap").textContent = signed(wc - gbTs);
  } else {
    $("windChillBox").hidden = true;
    $("windChill").textContent = "--";
    $("wcNoaa").textContent = "--";
    $("wcK").textContent = "--";
    $("wcKLevel").textContent = "--";
    $("wcGap").textContent = "--";
    if (!isHot) {
      gbValue = gbApparent(tC, rh, windKmh);
      stdNote = t("stdNote.noaaMissing");
    }
  }

  $("noaaVal").textContent = noaaValue === null ? "—" : toDisplayTemp(noaaValue, 1) + unitSymbol();
  $("gbVal").textContent = gbValue === null ? "—" : toDisplayTemp(gbValue, 1) + unitSymbol();
  $("gapVal").textContent =
    noaaValue === null || gbValue === null ? "—" : signed(noaaValue - gbValue) + unitSymbol();
  $("stdNote").textContent = stdNote;

  $("formulaNote").textContent = t("formulaNote");

  if (light) {
    // 轻量模式：跳过速查表渲染和面板高度同步（拖动松手后 change 事件会触发完整更新）
    return;
  }
  renderLookups(tC, rh, windKmh);
  syncHeights();
}

/* ---------- 当前位置实况（中央气象台 nmc.cn，中国气象局） ---------- */
const NMC_BASE = "https://www.nmc.cn/rest";
const lwUI = {
  status: $("lwStatus"),
  locateBtn: $("lwLocate"),
  toggleManual: $("lwToggleManual"),
  card: $("lwCard"),
  city: $("lwCity"),
  time: $("lwTime"),
  wx: $("lwWx"),
  temp: $("lwTemp"),
  rh: $("lwRh"),
  wind: $("lwWind"),
  windDetail: $("lwWindDetail"),
  feels: $("lwFeels"),
  level: $("lwLevel"),
  manual: $("lwManual"),
  province: $("lwProvince"),
  citySel: $("lwCitySel"),
  manualGo: $("lwManualGo"),
  addr: $("lwAddr"),
  addrGo: $("lwAddrGo"),
  rowsClear: $("lwRowsClear"),
  rows: $("lwRows"),
  rowsBody: $("lwRowsBody"),
};

/** 已添加到列表的站点行：stationCode → tr */
const lwRowMap = new Map();

let lwProvincesCache = null;
const lwCityCache = {};
let lwBusy = false;
let lwAutoTried = false;
let lwRunId = 0;   // 每轮取数的代次，手动查询可中止并取代自动定位
let lwAbort = null;

function lwSetStatus(msg, isError) {
  lwUI.status.textContent = msg;
  lwUI.status.classList.toggle("is-error", !!isError);
  // 错误同步弹顶部提示框，页面无反应时也有明确反馈
  if (isError) showToast(msg, "error");
}

/** 顶部友好提示框（toast）：网络失败、城市未找到等一目了然 */
let toastTimer = null;
function showToast(msg, type) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.remove("is-error", "is-ok");
  if (type) el.classList.add("is-" + type);
  void el.offsetWidth; // 强制重排，连续触发也能重新播放出现动画
  el.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-show"), 3000);
}

async function lwFetchJSON(url, ms = 9000, externalSignal) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  if (externalSignal) {
    externalSignal.addEventListener("abort", () => ctrl.abort());
  }
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.json();
  } finally {
    clearTimeout(timer);
  }
}

/** 浏览器 GPS/Wi‑Fi 定位（可被外部 signal 中止） */
function lwGeolocate(signal) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("UNSUPPORTED"));
      return;
    }
    const watchId = navigator.geolocation.getCurrentPosition(
      (p) => {
        if (signal && signal.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }
        resolve({ lat: p.coords.latitude, lon: p.coords.longitude });
      },
      (err) => {
        if (signal && signal.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }
        reject(err);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
    if (signal) {
      signal.addEventListener("abort", () => {
        try { navigator.geolocation.clearWatch(watchId); } catch (_) {}
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });
}

/** GPS 不可用时的 IP 粗略定位（仅取坐标，省市名交给逆地理编码） */
async function lwIPLocate(signal) {
  const j = await lwFetchJSON(
    "http://ip-api.com/json/?lang=zh-CN&fields=status,message,lat,lon",
    7000,
    signal
  );
  if (j.status !== "success" || typeof j.lat !== "number") {
    throw new Error(t("lw.err.ipUnavailable"));
  }
  return { lat: j.lat, lon: j.lon, viaIP: true };
}

/** 坐标 → 省 / 市名（BigDataCloud 免费接口，浏览器直连，无需 Key） */
async function lwReverseGeo(lat, lon, signal) {
  const j = await lwFetchJSON(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=zh`,
    8000,
    signal
  );
  const prov = j.principalSubdivision || "";
  const city = j.city || j.locality || "";
  if (!prov) throw new Error("NOMATCH_PROV");
  return { prov, city };
}

/** 名称归一化：去掉省/市/自治区/自治州等后缀，便于模糊匹配 */
function lwNormName(s) {
  return String(s || "")
    .replace(/（.*?）/g, "")
    .replace(/省|市|壮族|回族|维吾尔|自治区|特别行政区|自治州|地区|盟/g, "")
    .trim();
}

function lwMatchProvince(list, name) {
  const n = lwNormName(name);
  if (!n) return null;
  return (
    list.find((p) => lwNormName(p.name) === n) ||
    list.find((p) => {
      const a = lwNormName(p.name);
      return a && (a.indexOf(n) >= 0 || n.indexOf(a) >= 0);
    }) ||
    null
  );
}

function lwMatchCity(list, name) {
  const n = lwNormName(name);
  if (!n) return null;
  return (
    list.find((c) => lwNormName(c.city) === n) ||
    list.find((c) => {
      const a = lwNormName(c.city);
      return a && (a.indexOf(n) >= 0 || n.indexOf(a) >= 0);
    }) ||
    null
  );
}

async function lwGetProvinces() {
  if (!lwProvincesCache) {
    const list = await lwFetchJSON(NMC_BASE + "/province/all");
    lwProvincesCache = list.map((p) => ({ code: p.code, name: p.name }));
  }
  return lwProvincesCache;
}

async function lwGetCities(provinceCode) {
  if (!lwCityCache[provinceCode]) {
    lwCityCache[provinceCode] = await lwFetchJSON(NMC_BASE + "/province/" + provinceCode);
  }
  return lwCityCache[provinceCode];
}

/** 全国城市目录：首次使用时一次性并发拉取并拍平缓存（供手填地址本地匹配） */
let lwAllStationsPromise = null;
function lwLoadAllStations() {
  if (!lwAllStationsPromise) {
    lwAllStationsPromise = (async () => {
      const ps = await lwGetProvinces();
      const arrs = await Promise.all(ps.map((p) => lwGetCities(p.code)));
      return arrs.reduce((acc, arr) => acc.concat(arr), []);
    })();
  }
  return lwAllStationsPromise;
}

/**
 * 按手填文本解析城市站：支持「深圳」「广东深圳」「广东省 深圳」
 * 返回 { station, ambiguous }，找不到返回 null
 */
async function lwResolveAddr(text) {
  const raw = String(text || "").replace(/\s+/g, "").trim();
  if (raw.length < 2) return null;
  const [list, provinces] = await Promise.all([lwLoadAllStations(), lwGetProvinces()]);

  // 识别输入中的省名前缀（如「广东深圳」「内蒙古呼伦贝尔」）
  let provHit = null;
  let cityPart = raw;
  for (const p of provinces) {
    const full = p.name;
    const short = lwNormName(p.name);
    if (raw.indexOf(full) === 0 || (short.length >= 2 && raw.indexOf(short) === 0)) {
      provHit = p;
      cityPart = raw.slice(full.length) || raw.slice(short.length);
      break;
    }
  }
  const n = lwNormName(cityPart);
  if (n.length < 2) {
    // 仅填了省/直辖市名（如「北京」「广东」）→ 取该省首位站（省会/直辖市主城区）
    if (!provHit) return null;
    const cities = await lwGetCities(provHit.code);
    return cities.length ? { station: cities[0], ambiguous: false } : null;
  }

  const pool = provHit ? list.filter((c) => c.province === provHit.name) : list;
  const score = (c) => {
    const a = lwNormName(c.city);
    if (a === n) return 3;
    if (a.indexOf(n) >= 0) return 2;
    if (n.indexOf(a) >= 0 && a.length >= 2) return 1;
    return 0;
  };
  let best = null;
  let bestScore = 0;
  let ambiguous = false;
  pool.forEach((c) => {
    const s = score(c);
    if (s > bestScore) {
      bestScore = s;
      best = c;
      ambiguous = false;
    } else if (s === bestScore && s > 0 && best && best.code !== c.code) {
      ambiguous = true;
    }
  });
  return best ? { station: best, ambiguous } : null;
}

/** 取中央气象台某站实时观测 */
async function lwGetReal(stationCode, signal) {
  const j = await lwFetchJSON(
    `${NMC_BASE}/weather?stationid=${encodeURIComponent(stationCode)}`,
    9000,
    signal
  );
  const real = j && j.data && j.data.real;
  if (!real || !real.weather || typeof real.weather.temperature !== "number") {
    throw new Error(t("lw.noStationData"));
  }
  return real;
}

/** 英文模式下翻译中央气象台天气现象（晴/多云/小雨…）；未命中原样返回中文 */
function lwTrWx(zh) {
  if (curLang !== "en-US" || !zh) return zh;
  const WX = {
    "晴": "Sunny", "多云": "Cloudy", "阴": "Overcast",
    "小雨": "Light rain", "中雨": "Moderate rain", "大雨": "Heavy rain",
    "暴雨": "Storm", "大暴雨": "Heavy storm", "特大暴雨": "Torrential rain",
    "阵雨": "Showers", "雷阵雨": "Thundershowers", "雷阵雨伴有冰雹": "Thundershowers with hail",
    "雨夹雪": "Sleet", "小雪": "Light snow", "中雪": "Moderate snow",
    "大雪": "Heavy snow", "暴雪": "Blizzard", "阵雪": "Snow showers",
    "雾": "Fog", "浓雾": "Dense fog", "强浓雾": "Strong dense fog", "特强浓雾": "Very dense fog",
    "霾": "Haze", "冻雨": "Freezing rain", "浮尘": "Dust", "扬沙": "Blowing dust",
    "沙尘暴": "Sandstorm", "强沙尘暴": "Severe sandstorm"
  };
  if (WX[zh]) return WX[zh];
  // 组合现象（晴间多云 / 多云转小雨）：拆成单段翻译后用英文连接词重组
  const m = zh.match(/^(.+?)(间|转|到)(.+)$/);
  if (m) {
    const conn = m[2] === "间" ? " partly " : " to ";
    return (WX[m[1]] || m[1]) + conn + (WX[m[3]] || m[3]);
  }
  return zh;
}

/** 英文模式下翻译风向（西北风 → NW wind；无持续风向 → Variable wind） */
function lwTrDir(zh) {
  if (curLang !== "en-US" || !zh) return zh;
  if (zh.indexOf("无持续风向") >= 0 || zh.indexOf("旋转风") >= 0) return "Variable wind";
  const ns = zh.indexOf("北") >= 0 ? "N" : (zh.indexOf("南") >= 0 ? "S" : "");
  const ew = zh.indexOf("东") >= 0 ? "E" : (zh.indexOf("西") >= 0 ? "W" : "");
  if (!ns && !ew) return zh;
  return ns + ew + " wind";
}

/** 英文模式下翻译风力（微风 → Light breeze；3-4级 → Force 3–4） */
function lwTrPower(zh) {
  if (curLang !== "en-US" || !zh) return zh;
  const NAMES = {
    "无风": "Calm", "微风": "Light breeze", "和风": "Gentle breeze", "清风": "Fresh breeze",
    "强风": "Strong wind", "疾风": "Near gale", "大风": "Gale", "烈风": "Strong gale",
    "狂风": "Storm", "暴风": "Violent storm", "飓风": "Hurricane force"
  };
  if (NAMES[zh]) return NAMES[zh];
  const range = zh.match(/(\d+)\s*[-–~至到]\s*(\d+)\s*级/);
  if (range) return "Force " + range[1] + "–" + range[2];
  const one = zh.match(/(\d+)\s*级/);
  if (one) return "Force " + one[1];
  return zh;
}

/** 把实况渲染到面板并同步填入计算器 */
function lwApplyObs(real, locLabel, fallbackNote) {
  const tC = real.weather.temperature;
  const rh = real.weather.humidity;
  const windMs = real.wind.speed;
  const windKmh = Math.round(windMs * 3.6 * 10) / 10;

  // 实况气温按当前单位写入输入框（setTempInput 把 °C 转成当前单位数值）
  const setInput = (id, v) => {
    const el = $(id);
    el.value = v;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  // temp 输入按当前单位写
  setTempInput(tC);
  // 触发 input 事件让计算器重算（setTempInput 只写 value，不触发事件）
  $("temp").dispatchEvent(new Event("input", { bubbles: true }));
  setInput("humidity", Math.round(rh));
  setInput("wind", windKmh);

  lwUI.city.textContent = `${real.station.province} · ${real.station.city}` + t("lw.parenWrap", { x: locLabel });
  lwUI.time.textContent = t("lw.obsTime", { time: real.publish_time });
  const lwClean = (v) => (v === "9999" || v === 9999 || v == null ? "" : String(v));
  const wxInfo = lwTrWx(lwClean(real.weather.info)) || t("lw.weatherNone");
  const windDirect = lwTrDir(lwClean(real.wind.direct));
  const windPower = lwTrPower(lwClean(real.wind.power));
  lwUI.wx.textContent = wxInfo;
  lwUI.temp.textContent = toDisplayTemp(tC, 1);
  lwUI.rh.textContent = formatNumber(Math.round(rh), 0);
  lwUI.wind.textContent = formatNumber(windKmh, 1);
  lwUI.windDetail.textContent = t("lw.windDetail", {
    dirPower: [windDirect, windPower].filter(Boolean).join(" "),
    ms: formatNumber(windMs, 1),
    kmh: formatNumber(windKmh, 1)
  });
  const feels = cmaFeels(tC, rh, windKmh, tC > 17 ? "summer" : "winter");
  lwUI.feels.textContent = toDisplayTemp(feels, 1);
  lwUI.level.textContent = lvlName(levelOf(feels));
  lwUI.card.hidden = false;

  lwAddRow(real, windKmh);

  lwSetStatus(
    t("lw.synced", { loc: locLabel, city: real.station.city, time: real.publish_time }) +
      (fallbackNote ? "　" + t("lw.fallbackNote") + " " + fallbackNote : "")
  );
  syncHeights();
}

function lwHumanError(err) {
  if (err && err.name === "AbortError") return t("lw.err.timeout");
  if (err && err.code === 1) return t("lw.err.permDenied");
  if (err && err.message === "NOMATCH_PROV") return t("lw.err.noProv");
  return (err && err.message) || t("lw.err.unknown");
}

/** 查询结果追加为一行（城市｜温度｜湿度｜风速）；同一站点再次查询则原地更新 */
function lwAddRow(real, windKmh) {
  const code = real.station.code;
  const tC = Math.round(real.weather.temperature * 10) / 10;
  const rh = Math.round(real.weather.humidity);
  const time = (real.publish_time || "").slice(11, 16); // HH:mm（实况均为当日观测）
  let tr = lwRowMap.get(code);
  if (!tr) {
    tr = document.createElement("tr");
    tr.innerHTML =
      '<td><span class="lw-rows__name"></span><span class="lw-rows__time"></span></td>' +
      '<td class="lw-rows__t"></td><td class="lw-rows__rh"></td><td class="lw-rows__w"></td>' +
      `<td><button type="button" class="lw-rows__del" aria-label="${t("lw.row.delete")}">×</button></td>`;
    tr.querySelector(".lw-rows__del").addEventListener("click", () => {
      lwRowMap.delete(code);
      tr.remove();
      if (!lwUI.rowsBody.children.length) lwUI.rows.hidden = true;
      syncHeights();
    });
    lwUI.rowsBody.appendChild(tr); // 新城市依次向下延伸
    lwRowMap.set(code, tr);
  }
  tr.querySelector(".lw-rows__name").textContent = real.station.city;
  tr.querySelector(".lw-rows__time").textContent =
    `${lwNormName(real.station.province)} · ${time}`;
  tr.querySelector(".lw-rows__t").textContent = toDisplayTemp(tC, 1);
  tr.querySelector(".lw-rows__rh").textContent = formatNumber(rh, 0);
  tr.querySelector(".lw-rows__w").textContent = formatNumber(windKmh, 1);
  lwUI.rows.hidden = false;
}

/** 新一轮取数：登记代次并中止上一轮（手动查询可打断自动定位） */
function lwBeginRun() {
  const myId = ++lwRunId;
  if (lwAbort) {
    try { lwAbort.abort(); } catch (_) {}
  }
  lwAbort = new AbortController();
  lwBusy = true;
  lwUI.locateBtn.disabled = true;
  // 手动查询按钮保持可用，以便用户随时中止自动定位改为手选城市
  return { myId, signal: lwAbort.signal };
}

function lwEndRun(myId) {
  if (myId !== lwRunId) return; // 已被更新一轮取代
  lwBusy = false;
  lwUI.locateBtn.disabled = false;
  lwUI.manualGo.disabled = false;
}

/** 自动定位 → 逆地理 → 最近城市站 → 实况 */
async function lwLoadAuto() {
  if (lwBusy) return;
  const { myId, signal } = lwBeginRun();
  const alive = () => myId === lwRunId;
  try {
    lwSetStatus(t("lw.gettingGPS"));
    let loc;
    let locLabel;
    try {
      loc = await lwGeolocate(signal);
      locLabel = curLang === "en-US" ? "GPS" : "GPS 定位";
    } catch (e) {
      if (!alive()) return;
      if (e && e.name === "AbortError") return;
      lwSetStatus(
        (e && e.code === 1 ? t("lw.gpsDenied") : t("lw.gpsUnavailable")) +
        (curLang === "en-US" ? ", " : "，") + t("lw.tryingIP")
      );
      loc = await lwIPLocate(signal);
      locLabel = curLang === "en-US" ? "IP" : "IP 粗略定位";
    }
    if (!alive()) return;

    lwSetStatus(t("lw.geoParsing"));
    const geo = await lwReverseGeo(loc.lat, loc.lon, signal);
    const provinces = await lwGetProvinces();
    const prov = lwMatchProvince(provinces, geo.prov);
    if (!prov) throw new Error("NOMATCH_PROV");

    const cities = await lwGetCities(prov.code);
    const exact = lwMatchCity(cities, geo.city);
    let fallbackNote = "";
    let station;
    if (exact) {
      station = exact;
    } else {
      // 城市名匹配失败时取该省首位站（通常为省会），并明确标注，不伪装精确定位
      station = cities[0];
      fallbackNote = t("lw.noCityMatch", {
        city: geo.city || (curLang === "en-US" ? "unknown" : "未知城市"),
        prov: prov.name,
        city2: station.city,
      });
    }
    if (!alive()) return;

    lwSetStatus(t("lw.matching", { prov: prov.name, city: station.city }));
    const real = await lwGetReal(station.code, signal);
    if (!alive()) return;
    lwApplyObs(real, locLabel, fallbackNote);
  } catch (err) {
    if (!alive() || (err && err.name === "AbortError")) return;
    lwSetStatus(t("lw.autoFailed", { err: lwHumanError(err) }), true);
    lwUI.manual.hidden = false;
    lwEnsureProvinceOptions();
    syncHeights();
  } finally {
    lwEndRun(myId);
  }
}

/** 手动城市下拉 */
async function lwEnsureProvinceOptions() {
  if (lwUI.province.options.length) return;
  try {
    const list = await lwGetProvinces();
    lwUI.province.innerHTML =
      `<option value="">${t("lw.option.selectProv")}</option>` +
      list.map((p) => `<option value="${p.code}">${p.name}</option>`).join("");
  } catch (err) {
    lwSetStatus(t("lw.provFailed", { err: lwHumanError(err) }), true);
  }
}

lwUI.toggleManual.addEventListener("click", () => {
  lwUI.manual.hidden = false;
  lwEnsureProvinceOptions();
  syncHeights();
});

lwUI.province.addEventListener("change", async () => {
  const code = lwUI.province.value;
  if (!code) return;
  lwUI.citySel.disabled = true;
  lwUI.citySel.innerHTML = `<option>${t("lw.option.loadingCities")}</option>`;
  try {
    const cities = await lwGetCities(code);
    lwUI.citySel.innerHTML = cities
      .map((c) => `<option value="${c.code}">${c.city}</option>`)
      .join("");
    lwUI.citySel.disabled = false;
  } catch (err) {
    lwUI.citySel.innerHTML = `<option>${t("lw.option.citiesFailed")}</option>`;
  }
  syncHeights();
});

lwUI.manualGo.addEventListener("click", async () => {
  const code = lwUI.citySel.value;
  if (!code || lwUI.citySel.disabled) {
    lwSetStatus(t("lw.selectProvCity"), true);
    return;
  }
  const cityName = lwUI.citySel.options[lwUI.citySel.selectedIndex].textContent;
  // 手动查询优先：中止进行中的自动定位
  const { myId, signal } = lwBeginRun();
  lwUI.manualGo.disabled = true;
  try {
    lwSetStatus(t("lw.querying", { city: cityName }));
    const real = await lwGetReal(code, signal);
    if (myId !== lwRunId) return;
    lwApplyObs(real, t("lw.label.manual"), "");
  } catch (err) {
    if (myId !== lwRunId || (err && err.name === "AbortError")) return;
    lwSetStatus(t("lw.queryFailed", { err: lwHumanError(err) }), true);
  } finally {
    lwEndRun(myId);
  }
});

/** 手填地址查询：全国目录本地匹配 → 取实况 → 追加一行。
 *  连续提交的城市进入队列依次查询，一个都不会丢。 */
const lwAddrQueue = [];
let lwAddrRunning = false;

async function lwAddrRunOne(text, signal) {
  lwSetStatus(
    lwAllStationsPromise
      ? t("lw.matchingAddr", { text })
      : t("lw.loadingDir")
  );
  let match;
  try {
    match = await lwResolveAddr(text);
  } catch (err) {
    if (err && err.name === "AbortError") throw err;
    throw new Error(t("lw.dirFailed", { err: lwHumanError(err) }));
  }
  if (!match) {
    throw new Error(t("lw.noMatch", { text }));
  }
  const { station, ambiguous } = match;
  lwSetStatus(t("lw.matching", { prov: station.province, city: station.city }));
  const real = await lwGetReal(station.code, signal);
  lwApplyObs(
    real,
    t("lw.label.addrQuery", { text }),
    ambiguous
      ? t("lw.ambiguous", { text, city: station.city })
      : ""
  );
}

async function lwAddrDrain() {
  if (lwAddrRunning) return; // 运行中新提交的城市已在队列里，循环会自然取到
  lwAddrRunning = true;
  const ctrl = new AbortController();
  try {
    while (lwAddrQueue.length) {
      const text = lwAddrQueue.shift();
      try {
        await lwAddrRunOne(text, ctrl.signal);
      } catch (err) {
        if (ctrl.signal.aborted) break; // 仅整队被取消才停止
        lwSetStatus(err.message || t("lw.queryAddrFailed", { text }), true);
      }
    }
  } finally {
    lwAddrRunning = false;
  }
}

function lwAddrQuery() {
  const text = lwUI.addr.value.trim();
  if (!text) {
    lwSetStatus(t("lw.fillAddrFirst"), true);
    return;
  }
  // 简单校验：仅放行中文/字母（允许 ·、- 和空格），挡住乱字符直接去请求接口
  if (!/^[\u4e00-\u9fa5a-zA-Z·\-\s]{2,20}$/.test(text)) {
    lwSetStatus(t("lw.invalidInput"), true);
    return;
  }
  lwAddrQueue.push(text); // 入队；运行中提交也会依次执行
  lwUI.addr.value = "";
  lwAddrDrain();
}

lwUI.addrGo.addEventListener("click", lwAddrQuery);
lwUI.addr.addEventListener("keydown", (e) => {
  if (e.key === "Enter") lwAddrQuery();
});

lwUI.rowsClear.addEventListener("click", () => {
  lwUI.rowsBody.innerHTML = "";
  lwRowMap.clear();
  lwUI.rows.hidden = true;
  syncHeights();
});

lwUI.locateBtn.addEventListener("click", lwLoadAuto);

/** 首次进入「当前位置」选项卡时自动定位一次 */
function lwAutoLoad() {
  if (lwAutoTried) return;
  lwAutoTried = true;
  lwLoadAuto();
}

// 启动只渲染首屏（仪表盘/计算器）；两张速查表首次进入对应选项卡时才懒构建
initBlur();
// i18n：初始化语言+单位，并把 HTML 静态文本刷一遍
initI18n();
// 关于页面：动态模糊开关
$("blurToggle")?.addEventListener("click", () => {
  const on = toggleBlur();
  if (typeof showToast === "function") showToast(on ? t("blur.onToast") : t("blur.offToast"));
});
// 关于页面：GitHub 仓库跳转
$("githubLink")?.addEventListener("click", () => window.open(GITHUB_REPO, "_blank"));
// 关于页面：检查更新
$("checkUpdateBtn")?.addEventListener("click", checkUpdate);
// 关于页面：语言切换下拉
$("langSelect")?.addEventListener("change", (e) => switchLang(e.target.value));
// 关于页面：温度单位切换下拉
$("unitSelect")?.addEventListener("change", (e) => switchUnit(e.target.value));
update();
// 字体加载完成后高度可能微调，补测一次
window.addEventListener("load", syncHeights);
setTimeout(syncHeights, 300);

/* ---------- 调试：实时刷新率悬浮窗（页脚连点 5 次开关） ---------- */
(function fpsMeter() {
  let badge = null;
  let rafId = 0;
  let frames = 0;
  let windowStart = 0;
  let maxHz = 0;

  function tick(t) {
    if (!windowStart) windowStart = t;
    frames++;
    if (t - windowStart >= 500) {
      const hz = (frames * 1000) / (t - windowStart);
      if (hz > maxHz) maxHz = hz;
      badge.textContent = Math.round(hz) + "Hz" + "  " + t("fps.peak") + Math.round(maxHz);
      badge.classList.toggle("is-low", hz < 100);
      frames = 0;
      windowStart = t;
    }
    rafId = requestAnimationFrame(tick);
  }

  function show() {
    if (badge) return;
    badge = document.createElement("div");
    badge.id = "fpsBadge";
    document.body.appendChild(badge);
    frames = 0;
    windowStart = 0;
    maxHz = 0;
    rafId = requestAnimationFrame(tick);
  }

  function hide() {
    if (!badge) return;
    cancelAnimationFrame(rafId);
    badge.remove();
    badge = null;
  }

  let taps = 0;
  let tapTimer = 0;
  const title = document.querySelector(".card__title");
  if (title) {
    title.addEventListener("click", () => {
      taps++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { taps = 0; }, 2000);
      if (taps >= 5) {
        taps = 0;
        if (badge) hide(); else show();
      }
    });
  }
})();
