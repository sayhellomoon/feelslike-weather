# Qi温
综合气温、湿度与风速，估算人体实际感受温度的安卓应用。界面为纯静态 HTML/CSS/JS 页面，由 `build.py` 内联打包进 WebView APK，无网络服务依赖（天气实况除外）。

[![Release](https://img.shields.io/github/release/sayhellomoon/feelslike-weather.svg)](https://github.com/sayhellomoon/feelslike-weather/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 功能
- 体感温度计算：中国气象局 QX/T 500-2019 体感温度（分段调整版），并对照 NOAA 酷热指数/风寒指数与国标 GB/T 27963-2011
- 温/湿/风滑块与输入框双向联动，实时计算
- 夏季 / 冬季速查表（表格始终以 °C 呈现）
- 当前位置实况：浏览器定位 + 中央气象台观测数据，定位失败时自动回退 IP 粗略定位
- 透明液态玻璃选项卡动效；不支持模糊加速的 GPU（如联发科平台）自动降级关闭模糊，也可在「关于」中手动开关
- 应用内检查更新、GitHub 仓库跳转

## 下载
前往 [Releases](https://github.com/sayhellomoon/feelslike-weather/releases) 下载最新 APK 安装。

## 更新日志
### v1.4.2
- 新增简体中文 / English 双语界面，首次启动跟随系统语言，可在「关于」中手动切换并持久保存
- 新增 °C / °F 温度单位切换，选择持久保存；计算公式内部仍以 °C 运算，速查表保持 °C 呈现
- **修复温湿度滑块拖动画面闪动问题**
- 真机回归：Redmi K60、Redmi K90 MAX 双机反复拖动温/湿/风滑块及 Tab 切换性能复测，无功能与性能回退

## License
本项目采用 MIT 开源协议，详见根目录 [LICENSE](LICENSE) 文件。


