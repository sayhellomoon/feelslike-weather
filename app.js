"use strict";

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
  if (i < 14.0) return "寒冷";
  if (i < 17.0) return "冷";
  if (i <= 25.4) return "舒适";
  if (i <= 27.5) return "热";
  return "闷热";
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
  if (k < -400) return "寒冷";
  if (k < -300) return "冷";
  if (k <= -100) return "舒适";
  if (k <= -10) return "热";
  return "闷热";
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

/* ---------- 感受分级 ---------- */
const LEVELS = [
  { max: 0,   name: "严寒", color: "#1565c0", advice: "极易冻伤，外出需严密封装保暖，避免长时间暴露" },
  { max: 10,  name: "寒冷", color: "#1e88e5", advice: "注意保暖，建议穿厚外套并佩戴围巾、手套" },
  { max: 18,  name: "凉爽", color: "#26a69a", advice: "体感偏凉，建议穿着外套或长袖衣物" },
  { max: 24,  name: "舒适", color: "#43a047", advice: "体感舒适，适合户外活动" },
  { max: 28,  name: "温暖", color: "#f9a825", advice: "略感温热，穿轻薄衣物即可，注意补水" },
  { max: 32,  name: "炎热", color: "#fb8c00", advice: "出汗增多，避免暴晒，注意防暑补水" },
  { max: 38,  name: "酷热", color: "#e53935", advice: "易中暑，减少户外活动，谨防热射病" },
  { max: Infinity, name: "极度危险", color: "#b71c1c", advice: "极易发生重症中暑，避免一切非必要户外暴露" },
];

function levelOf(at) {
  return LEVELS.find((l) => at < l.max);
}

const signed = (v) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1);

/* ---------- 输入联动 ---------- */
pairs.forEach(([numId, rangeId]) => {
  const num = $(numId);
  const range = $(rangeId);

  num.addEventListener("input", () => {
    if (num.value !== "") range.value = num.value;
    update();
  });
  range.addEventListener("input", () => {
    num.value = range.value;
    update();
  });
});

/* ---------- 选项卡与滑动面板 ---------- */
const track = $("panels");
const tabBtns = Array.from(document.querySelectorAll(".tab"));
const indicator = $("tabIndicator");
const panelEls = Array.from(track.querySelectorAll(".panel"));
let panelHeights = [0, 0, 0, 0, 0, 0];
let activeIdx = 0;
let rafPending = false;
// 编程滚动（点击选项卡触发）的目标页：滚动途中不允许中间页回退高亮，防连点闪烁
let programmaticTarget = null;
// 点击动画期间用 CSS 过渡驱动容器高度（不随 scroll 事件逐帧写高度，避免每帧重排）
let heightAnimUntil = 0;
let heightAnimTimer = null;

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
  activeIdx = i;
  tabBtns.forEach((b, idx) => {
    b.classList.toggle("is-active", idx === i);
    b.setAttribute("aria-selected", idx === i ? "true" : "false");
  });
  indicator.style.transform = `translateX(${i * 100}%)`;
  if (i === 2) lwAutoLoad();
}

function goTo(i) {
  i = Math.max(0, Math.min(panelEls.length - 1, i));
  // 零帧延迟反馈：指示器与文字颜色同面板滚动同一刻启动（高刷下首帧即响应）
  applyActive(i);
  programmaticTarget = i;
  // 容器高度交给 CSS 过渡一次性驱动（300ms，与指示器同步），避免 JS 监听 scroll 逐帧改高度引发整轨重排
  if (panelHeights[i]) {
    clearTimeout(heightAnimTimer);
    track.style.transition = "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.height = panelHeights[i] + "px";
    heightAnimUntil = performance.now() + 320;
    heightAnimTimer = setTimeout(() => {
      track.style.transition = "";
      heightAnimUntil = 0;
    }, 330);
  }
  track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
}

/** 输入变化导致面板内容高度变化时同步高度 */
function syncHeights() {
  measureHeights();
  if (!dragState.on) {
    track.style.height = panelHeights[activeIdx] + "px";
  }
}

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
  // 用户手指/鼠标接管：立刻取消 CSS 高度过渡，交回随滚动逐帧插值，避免两套动画打架
  if (heightAnimTimer) { clearTimeout(heightAnimTimer); heightAnimTimer = null; }
  heightAnimUntil = 0;
  track.style.transition = "";
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

/* 滑动中：选项卡高亮 + 面板高度按进度插值 */
track.addEventListener("scroll", () => {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    const w = track.clientWidth || 1;
    const progress = Math.min(panelEls.length - 1, Math.max(0, track.scrollLeft / w));
    const idx = Math.round(progress);
    // 吸附到位（误差 ≤2px）后解除编程滚动锁定
    if (programmaticTarget !== null && Math.abs(track.scrollLeft - programmaticTarget * w) <= 2) {
      programmaticTarget = null;
    }
    if (programmaticTarget === null && idx !== activeIdx) applyActive(idx);
    // 相邻面板高度按滑动进度插值（点击选项卡的 CSS 高度过渡期间跳过，避免双重驱动+每帧重排）
    if (performance.now() < heightAnimUntil) return;
    const lo = Math.floor(progress);
    const hi = Math.ceil(progress);
    if (panelHeights[lo]) {
      track.style.height = Math.round(
        panelHeights[lo] + (panelHeights[hi] - panelHeights[lo]) * (progress - lo)
      ) + "px";
    }
  });
});

let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    track.style.transition = "";
    if (heightAnimTimer) { clearTimeout(heightAnimTimer); heightAnimTimer = null; }
    heightAnimUntil = 0;
    measureHeights();
    track.scrollLeft = activeIdx * track.clientWidth;
    track.style.height = panelHeights[activeIdx] + "px";
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

/* ---------- 夏 / 冬温湿度速查梯度表（均为 8 个湿度列，列对齐） ---------- */
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
  },
];

function buildLookupTable() {
  LOOKUPS.forEach((cfg) => {
    const thead = $(cfg.tableId).querySelector("thead");
    const tbody = $(cfg.tableId).querySelector("tbody");

    const headRow = document.createElement("tr");
    const corner = document.createElement("th");
    corner.textContent = "气温＼湿度";
    headRow.appendChild(corner);
    cfg.rhs.forEach((rh) => {
      const th = document.createElement("th");
      th.textContent = rh + "%";
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);

    cfg.cells = cfg.temps.map((t) => {
      const tr = document.createElement("tr");
      const rowHead = document.createElement("th");
      rowHead.textContent = (t < 0 ? "−" + Math.abs(t) : String(t)) + "°";
      tr.appendChild(rowHead);

      const row = cfg.rhs.map(() => {
        const td = document.createElement("td");
        tr.appendChild(td);
        return td;
      });
      tbody.appendChild(tr);
      return row;
    });

    const legend = $(cfg.legendId);
    LEVELS.forEach((l) => {
      const item = document.createElement("span");
      item.className = "legend-item";
      item.innerHTML = `<i style="background:${l.color}"></i>${l.name}`;
      legend.appendChild(item);
    });
  });
}

function updateLookupTable(tC, rh, windKmh) {
  const nearest = (target, list, maxDist) => {
    let best = -1;
    let bestDist = Infinity;
    list.forEach((v, i) => {
      const d = Math.abs(v - target);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return bestDist <= maxDist ? best : -1;
  };

  // 与 QX/T 500-2019 分段点一致：T>17°C 归夏季表，否则冬季表
  const activeSeason = tC > 17 ? "summer" : "winter";

  LOOKUPS.forEach((cfg) => {
    const isSeason = cfg.season === activeSeason;
    const tIdx = isSeason ? nearest(tC, cfg.temps, cfg.tTol) : -1;
    const rhIdx = isSeason ? nearest(rh, cfg.rhs, 5.5) : -1;

    cfg.temps.forEach((t, ti) => {
      cfg.rhs.forEach((rhCol, ri) => {
        const cell = cfg.cells[ti][ri];
        const ts = cmaFeels(t, rhCol, windKmh, cfg.season);
        const lv = levelOf(ts);
        const isCurrent = ti === tIdx && ri === rhIdx;
        const rounded = Math.round(ts);
        cell.textContent = rounded < 0 ? "−" + Math.abs(rounded) : String(rounded);
        cell.style.background = isCurrent ? lv.color : lv.color + "22";
        cell.style.color = isCurrent ? "#fff" : lv.color;
        cell.classList.toggle("is-current", isCurrent);
        cell.title = `气温 ${t}°C，湿度 ${rhCol}%，风速 ${windKmh} km/h → 体感 ${ts.toFixed(1)}°C（中国气象局 QX/T 500-2019）`;
      });
    });

    $(cfg.noteId).textContent =
      `按中国气象局 QX/T 500-2019 分段调整版公式与当前风速 ${windKmh} km/h 计算（单位 °C）；` +
      (isSeason
        ? "加粗描边框对应当前气温/湿度所在梯度。"
        : "当前气温不在该季节范围，可切换到另一张速查表。");
  });
}

/* ---------- 体感温度仪表盘（与计算器/定位实时联动） ---------- */
function updateDashboard(tC, rh, windKmh, at, level) {
  const hero = $("dashHero");
  hero.style.setProperty("--dash-color", level.color);
  hero.style.background =
    `linear-gradient(145deg, ${level.color}22, ${level.color}0d)`;

  $("dashFeels").textContent = at.toFixed(1);
  $("dashBadge").textContent = level.name;
  $("dashTemp").textContent = Math.round(tC * 10) / 10;
  $("dashRh").textContent = Math.round(rh);
  $("dashWind").textContent = Math.round(windKmh * 10) / 10;
  $("dashAdvice").textContent = level.advice;

  const diff = at - tC;
  $("dashDelta").textContent =
    Math.abs(diff) < 0.05
      ? `与实际气温 ${tC.toFixed(1)}°C 基本一致`
      : `与实际气温 ${tC.toFixed(1)}°C 相比，体感${diff > 0 ? "高" : "低"} ${Math.abs(diff).toFixed(1)}°C`;

  // 公式分解：夏季 T+(RH−70)/15−(V−2)/2；冬季 T−(RH−70)/15−(V−2)/2（V 取 m/s）
  const season = tC > 17 ? "summer" : "winter";
  const rhCorr = (rh - 70) / 15;
  const vMs = windKmh / 3.6;
  const windCorr = -(vMs - 2) / 2;
  const rhPart = (season === "summer" ? rhCorr : -rhCorr);
  const fmt = (x) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(1);
  $("dashFormula").textContent =
    `${season === "summer" ? "夏季" : "冬季"}分支（V=${vMs.toFixed(1)} m/s）：` +
    `${tC.toFixed(1)} ${fmt(rhPart)}（湿度订正） ${fmt(windCorr)}（风速订正）\n` +
    `= 体感 ${at.toFixed(1)}°C`;
}

/* ---------- 主更新 ---------- */
function update() {
  const tC = parseFloat($("temp").value);
  const rh = Math.min(100, Math.max(0, parseFloat($("humidity").value) || 0));
  const windKmh = Math.max(0, parseFloat($("wind").value) || 0);

  if (Number.isNaN(tC)) {
    $("feelsLike").textContent = "--";
    $("levelBadge").textContent = "--";
    $("advice").textContent = "请输入有效的气温";
    $("dashFeels").textContent = "--";
    $("dashBadge").textContent = "--";
    $("dashDelta").textContent = "请输入有效的气温";
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

  $("feelsLike").textContent = at.toFixed(1);
  const badge = $("levelBadge");
  badge.textContent = level.name;
  badge.style.background = level.color;
  $("advice").textContent = level.advice;
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
    stdNote = "NOAA 酷热指数 ｜ 国标 GB/T 27963-2011 温湿指数";

    $("heatIndexBox").hidden = false;
    $("heatIndex").textContent = hi.toFixed(1);
    $("gbThi").textContent = thi.toFixed(1);
    $("gbThiLevel").textContent = thiLevel(thi);
    $("hiGap").textContent = signed(hi - thi);
  } else {
    $("heatIndexBox").hidden = true;
  }

  if (isColdWind) {
    const wc = windChill(tC, windKmh);
    const gbTs = gbApparent(tC, rh, windKmh); // tC≤10 走 QX/T 500 低温分支
    const k = windEffectK(tC, windKmh);
    noaaValue = wc;
    gbValue = gbTs;
    stdNote = "NOAA/NWS 风寒指数 ｜ 国标 QX/T 500-2019 体感温度";

    $("windChillBox").hidden = false;
    $("windChill").textContent = wc.toFixed(1);
    $("wcNoaa").textContent = wc.toFixed(1);
    $("wcK").textContent = Math.round(k);
    $("wcKLevel").textContent = kLevel(k);
    $("wcGap").textContent = signed(wc - gbTs);
  } else {
    $("windChillBox").hidden = true;
    if (!isHot) {
      gbValue = gbApparent(tC, rh, windKmh);
      stdNote = "该温区无对应 NOAA 指数，国标为 QX/T 500-2019 体感温度";
    }
  }

  $("noaaVal").textContent = noaaValue === null ? "—" : noaaValue.toFixed(1) + "°";
  $("gbVal").textContent = gbValue === null ? "—" : gbValue.toFixed(1) + "°";
  $("gapVal").textContent =
    noaaValue === null || gbValue === null ? "—" : signed(noaaValue - gbValue) + "°";
  $("stdNote").textContent = stdNote;

  $("formulaNote").textContent =
    "体感温度按中国气象局 QX/T 500-2019 体感温度分段调整版公式（气温 + 湿度订正 ± 风速订正）实时估算；另以 NOAA 指数与 GB/T 27963-2011 作对照，结果仅供日常参考。";

  updateLookupTable(tC, rh, windKmh);
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
    throw new Error("IP 定位服务不可用");
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
    throw new Error("该站暂无实况数据");
  }
  return real;
}

/** 把实况渲染到面板并同步填入计算器 */
function lwApplyObs(real, locLabel, fallbackNote) {
  const t = real.weather.temperature;
  const rh = real.weather.humidity;
  const windMs = real.wind.speed;
  const windKmh = Math.round(windMs * 3.6 * 10) / 10;

  const setInput = (id, v) => {
    const el = $(id);
    el.value = v;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  setInput("temp", Math.round(t * 10) / 10);
  setInput("humidity", Math.round(rh));
  setInput("wind", windKmh);

  lwUI.city.textContent = `${real.station.province} · ${real.station.city}（${locLabel}）`;
  lwUI.time.textContent = `中央气象台观测时间：${real.publish_time}`;
  const lwClean = (v) => (v === "9999" || v === 9999 || v == null ? "" : String(v));
  const wxInfo = lwClean(real.weather.info) || "天气实况暂无";
  const windDirect = lwClean(real.wind.direct);
  const windPower = lwClean(real.wind.power);
  lwUI.wx.textContent = wxInfo;
  lwUI.temp.textContent = Math.round(t * 10) / 10;
  lwUI.rh.textContent = Math.round(rh);
  lwUI.wind.textContent = windKmh;
  lwUI.windDetail.textContent =
    [windDirect, windPower].filter(Boolean).join(" ") +
    ` · ${windMs} m/s（约 ${windKmh} km/h）`;
  const feels = cmaFeels(t, rh, windKmh, t > 17 ? "summer" : "winter");
  lwUI.feels.textContent = feels.toFixed(1);
  lwUI.level.textContent = levelOf(feels).name;
  lwUI.card.hidden = false;

  lwAddRow(real, windKmh);

  lwSetStatus(
    `已按${locLabel}获取 ${real.station.city} 实况（${real.publish_time}），气温/湿度/风速已同步到计算器。` +
      (fallbackNote ? "　注：" + fallbackNote : "")
  );
  syncHeights();
}

function lwHumanError(err) {
  if (err && err.name === "AbortError") return "网络请求超时，请稍后重试";
  if (err && err.code === 1) return "浏览器定位权限被拒绝";
  if (err && err.message === "NOMATCH_PROV") return "未能识别当前坐标所属省份";
  return (err && err.message) || "未知错误";
}

/** 查询结果追加为一行（城市｜温度｜湿度｜风速）；同一站点再次查询则原地更新 */
function lwAddRow(real, windKmh) {
  const code = real.station.code;
  const t = Math.round(real.weather.temperature * 10) / 10;
  const rh = Math.round(real.weather.humidity);
  const time = (real.publish_time || "").slice(11, 16); // HH:mm（实况均为当日观测）
  let tr = lwRowMap.get(code);
  if (!tr) {
    tr = document.createElement("tr");
    tr.innerHTML =
      '<td><span class="lw-rows__name"></span><span class="lw-rows__time"></span></td>' +
      '<td class="lw-rows__t"></td><td class="lw-rows__rh"></td><td class="lw-rows__w"></td>' +
      '<td><button type="button" class="lw-rows__del" aria-label="删除该城市">×</button></td>';
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
  tr.querySelector(".lw-rows__t").textContent = t;
  tr.querySelector(".lw-rows__rh").textContent = rh;
  tr.querySelector(".lw-rows__w").textContent = windKmh;
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
    lwSetStatus("正在获取浏览器定位…");
    let loc;
    let locLabel;
    try {
      loc = await lwGeolocate(signal);
      locLabel = "GPS 定位";
    } catch (e) {
      if (!alive()) return;
      if (e && e.name === "AbortError") return;
      lwSetStatus(
        (e && e.code === 1 ? "定位权限被拒绝" : "浏览器定位不可用") + "，正在尝试 IP 粗略定位…"
      );
      loc = await lwIPLocate(signal);
      locLabel = "IP 粗略定位";
    }
    if (!alive()) return;

    lwSetStatus("定位成功，正在解析所属省市…");
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
      fallbackNote = `未匹配到「${geo.city || "未知城市"}」，显示${prov.name}首位站点「${station.city}」，可用下方手动选择精确城市。`;
    }
    if (!alive()) return;

    lwSetStatus(`匹配到 ${prov.name}·${station.city}，正在拉取中央气象台实况…`);
    const real = await lwGetReal(station.code, signal);
    if (!alive()) return;
    lwApplyObs(real, locLabel, fallbackNote);
  } catch (err) {
    if (!alive() || (err && err.name === "AbortError")) return;
    lwSetStatus("自动定位失败：" + lwHumanError(err) + "。可手动选择城市查询。", true);
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
      '<option value="">选择省份…</option>' +
      list.map((p) => `<option value="${p.code}">${p.name}</option>`).join("");
  } catch (err) {
    lwSetStatus("省份列表加载失败：" + lwHumanError(err), true);
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
  lwUI.citySel.innerHTML = '<option>城市加载中…</option>';
  try {
    const cities = await lwGetCities(code);
    lwUI.citySel.innerHTML = cities
      .map((c) => `<option value="${c.code}">${c.city}</option>`)
      .join("");
    lwUI.citySel.disabled = false;
  } catch (err) {
    lwUI.citySel.innerHTML = '<option>城市列表加载失败</option>';
  }
  syncHeights();
});

lwUI.manualGo.addEventListener("click", async () => {
  const code = lwUI.citySel.value;
  if (!code || lwUI.citySel.disabled) {
    lwSetStatus("请先选择省份和城市。", true);
    return;
  }
  const cityName = lwUI.citySel.options[lwUI.citySel.selectedIndex].textContent;
  // 手动查询优先：中止进行中的自动定位
  const { myId, signal } = lwBeginRun();
  lwUI.manualGo.disabled = true;
  try {
    lwSetStatus(`正在拉取 ${cityName} 的中央气象台实况…`);
    const real = await lwGetReal(code, signal);
    if (myId !== lwRunId) return;
    lwApplyObs(real, "手动选择", "");
  } catch (err) {
    if (myId !== lwRunId || (err && err.name === "AbortError")) return;
    lwSetStatus("查询失败：" + lwHumanError(err), true);
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
      ? `正在匹配「${text}」…`
      : "首次使用正在加载全国城市目录（约数秒，之后本地即时匹配）…"
  );
  let match;
  try {
    match = await lwResolveAddr(text);
  } catch (err) {
    if (err && err.name === "AbortError") throw err;
    throw new Error("城市目录加载失败：" + lwHumanError(err));
  }
  if (!match) {
    throw new Error(`未找到与「${text}」匹配的城市，可改用下方「手动选择城市」精确选取`);
  }
  const { station, ambiguous } = match;
  lwSetStatus(`匹配到 ${station.province}·${station.city}，正在拉取中央气象台实况…`);
  const real = await lwGetReal(station.code, signal);
  lwApplyObs(
    real,
    "地址查询 · " + text,
    ambiguous
      ? `「${text}」对应多个同名站点，当前显示「${station.city}」；可用手动选择精确指定。`
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
        lwSetStatus(err.message || ("查询「" + text + "」失败"), true);
      }
    }
  } finally {
    lwAddrRunning = false;
  }
}

function lwAddrQuery() {
  const text = lwUI.addr.value.trim();
  if (!text) {
    lwSetStatus("请先填写要查询的城市名。", true);
    return;
  }
  // 简单校验：仅放行中文/字母（允许 ·、- 和空格），挡住乱字符直接去请求接口
  if (!/^[\u4e00-\u9fa5a-zA-Z·\-\s]{2,20}$/.test(text)) {
    lwSetStatus("请输入 2~20 位中文或字母的城市名（如 深圳），暂不支持数字和特殊符号。", true);
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

buildLookupTable();
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
      badge.textContent = Math.round(hz) + "Hz" + "  峰值" + Math.round(maxHz);
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
