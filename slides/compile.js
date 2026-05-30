const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";

// Business & Authority palette - formal, fits government/city management
const theme = {
  primary: "2b2d42",
  secondary: "8d99ae",
  accent: "ef233c",
  light: "edf2f4",
  bg: "FFFFFF"
};

// Helper: page badge
function addPageBadge(slide, num) {
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.secondary }
  });
  slide.addText(String(num), {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle"
  });
}

// Helper: section title bar
function addTitleBar(slide, title) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 1.1,
    fill: { color: theme.primary }
  });
  slide.addText(title, {
    x: 0.6, y: 0.15, w: 8.8, h: 0.8,
    fontSize: 32, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true
  });
}

// ============================================================
// Slide 1: Cover
// ============================================================
(function() {
  const slide = pres.addSlide();
  // Dark background
  slide.background = { color: theme.primary };

  // Accent bar left
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 5.625,
    fill: { color: theme.accent }
  });

  // Title
  slide.addText("城市舆情智能监测分析系统", {
    x: 0.8, y: 1.2, w: 8.5, h: 1.5,
    fontSize: 44, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true
  });

  // Subtitle
  slide.addText("City Public Opinion Monitor", {
    x: 0.8, y: 2.6, w: 8.5, h: 0.6,
    fontSize: 22, fontFace: "Arial",
    color: theme.secondary
  });

  // Divider line
  slide.addShape(pres.shapes.LINE, {
    x: 0.8, y: 3.4, w: 3, h: 0,
    line: { color: theme.accent, width: 3 }
  });

  // Description
  slide.addText("全流程舆情采集 · 情感分析 · 风险预警 · 趋势预测", {
    x: 0.8, y: 3.7, w: 8.5, h: 0.5,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: theme.light
  });

  // Bottom info
  slide.addText("SkillsBench 评估 12/12 精品层  |  v1.0.0", {
    x: 0.8, y: 4.8, w: 8.5, h: 0.4,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: theme.secondary
  });
})();

// ============================================================
// Slide 2: TOC
// ============================================================
(function() {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };
  addTitleBar(slide, "目录 CONTENTS");
  addPageBadge(slide, 2);

  const items = [
    ["01", "痛点与背景", "城市管理舆情监测的核心挑战"],
    ["02", "核心功能", "六大功能模块全覆盖"],
    ["03", "工作流程", "六步闭环从采集到报告"],
    ["04", "风险预警", "五级量化评估体系"],
    ["05", "技术亮点", "可审计 · 可扩展 · 可配置"],
    ["06", "应用场景与评估", "精品层认证 12/12"]
  ];

  items.forEach((item, i) => {
    const y = 1.4 + i * 0.65;
    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.6, y: y, w: 0.45, h: 0.45,
      fill: { color: i < 3 ? theme.accent : theme.secondary }
    });
    slide.addText(item[0], {
      x: 0.6, y: y, w: 0.45, h: 0.45,
      fontSize: 14, fontFace: "Arial",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });
    // Title
    slide.addText(item[1], {
      x: 1.3, y: y - 0.02, w: 3.5, h: 0.3,
      fontSize: 18, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true
    });
    // Description
    slide.addText(item[2], {
      x: 1.3, y: y + 0.25, w: 3.5, h: 0.25,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: theme.secondary
    });
  });

  // Right side decorative block
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 1.2, w: 3.8, h: 4.0,
    fill: { color: theme.light },
    rectRadius: 0.1
  });
  slide.addText("全流程\n闭环\n覆盖", {
    x: 5.8, y: 1.5, w: 3.8, h: 3.5,
    fontSize: 48, fontFace: "Microsoft YaHei",
    color: theme.primary, bold: true,
    align: "center", valign: "middle",
    lineSpacingMultiple: 1.3
  });
})();

// ============================================================
// Slide 3: 痛点与背景
// ============================================================
(function() {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };
  addTitleBar(slide, "痛点与背景");
  addPageBadge(slide, 3);

  const pains = [
    { icon: "📊", title: "数据分散", desc: "新闻、社交、论坛、政府公告\n多源数据难以统一采集分析" },
    { icon: "⏱", title: "响应滞后", desc: "传统人工监测效率低\n突发事件发现不及时" },
    { icon: "🎯", title: "研判主观", desc: "风险评估依赖个人经验\n缺乏量化标准体系" },
    { icon: "📈", title: "预测缺失", desc: "只能事后分析\n无法提前预判舆情走势" }
  ];

  pains.forEach((p, i) => {
    const x = 0.4 + i * 2.35;
    // Card background
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 1.4, w: 2.15, h: 3.5,
      fill: { color: theme.light },
      rectRadius: 0.1
    });
    // Icon
    slide.addText(p.icon, {
      x: x, y: 1.6, w: 2.15, h: 0.8,
      fontSize: 36, align: "center"
    });
    // Title
    slide.addText(p.title, {
      x: x + 0.15, y: 2.5, w: 1.85, h: 0.5,
      fontSize: 20, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "center"
    });
    // Description
    slide.addText(p.desc, {
      x: x + 0.15, y: 3.1, w: 1.85, h: 1.5,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "center",
      lineSpacingMultiple: 1.4
    });
  });
})();

// ============================================================
// Slide 4: 核心功能
// ============================================================
(function() {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };
  addTitleBar(slide, "核心功能");
  addPageBadge(slide, 4);

  const funcs = [
    { num: "01", title: "多源数据采集", desc: "新闻/社交/论坛/政府公告\n关键词+地域+时间筛选" },
    { num: "02", title: "智能情感分析", desc: "正面/中性/负面/敏感\n四维标注可审计" },
    { num: "03", title: "主题热点聚类", desc: "TF-IDF + TextRank + LDA\n议题分布与热度时间线" },
    { num: "04", title: "五级风险预警", desc: "五维度加权量化评分\n1-5级风险等级体系" },
    { num: "05", title: "趋势预测", desc: "SIR传播模型\n情感曲线演化分析" },
    { num: "06", title: "报告自动生成", desc: "日报/周报/专报/月报\n多类型结构化输出" }
  ];

  funcs.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.4 + col * 3.1;
    const y = 1.4 + row * 2.0;

    // Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 2.9, h: 1.8,
      fill: { color: theme.light },
      rectRadius: 0.08
    });
    // Number badge
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.15, y: y + 0.15, w: 0.5, h: 0.35,
      fill: { color: theme.accent },
      rectRadius: 0.05
    });
    slide.addText(f.num, {
      x: x + 0.15, y: y + 0.15, w: 0.5, h: 0.35,
      fontSize: 12, fontFace: "Arial",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });
    // Title
    slide.addText(f.title, {
      x: x + 0.8, y: y + 0.12, w: 1.9, h: 0.4,
      fontSize: 16, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true,
      valign: "middle"
    });
    // Description
    slide.addText(f.desc, {
      x: x + 0.15, y: y + 0.65, w: 2.6, h: 1.0,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: theme.secondary,
      lineSpacingMultiple: 1.4
    });
  });
})();

// ============================================================
// Slide 5: 六步工作流程
// ============================================================
(function() {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };
  addTitleBar(slide, "六步工作流程");
  addPageBadge(slide, 5);

  const steps = [
    { num: "1", title: "数据采集", desc: "多源渠道\n自动化抓取" },
    { num: "2", title: "情感分析", desc: "四维情感\n可审计标注" },
    { num: "3", title: "主题聚类", desc: "热点提取\n议题分布" },
    { num: "4", title: "风险识别", desc: "五维度\n量化评分" },
    { num: "5", title: "趋势预测", desc: "SIR模型\n走势预判" },
    { num: "6", title: "报告生成", desc: "多类型\n结构化输出" }
  ];

  // Draw flow
  steps.forEach((s, i) => {
    const x = 0.3 + i * 1.6;
    const y = 2.2;

    // Circle
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.25, y: y, w: 0.9, h: 0.9,
      fill: { color: i === 0 || i === 5 ? theme.accent : theme.primary }
    });
    slide.addText(s.num, {
      x: x + 0.25, y: y, w: 0.9, h: 0.9,
      fontSize: 24, fontFace: "Arial",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });

    // Arrow (except last)
    if (i < 5) {
      slide.addShape(pres.shapes.LINE, {
        x: x + 1.2, y: y + 0.45, w: 0.55, h: 0,
        line: { color: theme.secondary, width: 2 }
      });
    }

    // Title below
    slide.addText(s.title, {
      x: x, y: y + 1.1, w: 1.4, h: 0.4,
      fontSize: 14, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "center"
    });
    // Desc
    slide.addText(s.desc, {
      x: x, y: y + 1.5, w: 1.4, h: 0.8,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "center",
      lineSpacingMultiple: 1.3
    });
  });

  // Bottom note
  slide.addText("每一步均有明确的输入/输出定义、约束规则和错误处理机制", {
    x: 0.5, y: 4.8, w: 9, h: 0.4,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: theme.secondary, italic: true, align: "center"
  });
})();

// ============================================================
// Slide 6: 五级风险预警体系
// ============================================================
(function() {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };
  addTitleBar(slide, "五级风险预警体系");
  addPageBadge(slide, 6);

  const levels = [
    { level: "1级", name: "极低", color: "2ecc71", desc: "少量讨论，无负面情绪", action: "常规监测" },
    { level: "2级", name: "低", color: "3498db", desc: "局部讨论，负面<20%", action: "关注跟踪" },
    { level: "3级", name: "中", color: "f39c12", desc: "较多讨论，负面20-50%", action: "分析研判" },
    { level: "4级", name: "高", color: "e74c3c", desc: "广泛传播，负面>50%", action: "启动预案" },
    { level: "5级", name: "极高", color: "c0392b", desc: "重大舆情，跨平台传播", action: "紧急响应" }
  ];

  // Table header
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.3, w: 9.2, h: 0.5,
    fill: { color: theme.primary }
  });
  ["等级", "名称", "定义", "响应建议"].forEach((h, i) => {
    const widths = [1.0, 1.0, 3.8, 3.4];
    const x = 0.4 + widths.slice(0, i).reduce((a, b) => a + b, 0);
    slide.addText(h, {
      x: x, y: 1.3, w: widths[i], h: 0.5,
      fontSize: 13, fontFace: "Microsoft YaHei",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });
  });

  // Table rows
  levels.forEach((l, i) => {
    const y = 1.8 + i * 0.6;
    const bg = i % 2 === 0 ? theme.light : theme.bg;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y: y, w: 9.2, h: 0.6,
      fill: { color: bg }
    });
    // Level badge
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6, y: y + 0.1, w: 0.6, h: 0.4,
      fill: { color: l.color },
      rectRadius: 0.05
    });
    slide.addText(l.level, {
      x: 0.6, y: y + 0.1, w: 0.6, h: 0.4,
      fontSize: 12, fontFace: "Arial",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });
    // Name
    slide.addText(l.name, {
      x: 1.4, y: y, w: 1.0, h: 0.6,
      fontSize: 14, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true,
      align: "center", valign: "middle"
    });
    // Desc
    slide.addText(l.desc, {
      x: 2.4, y: y, w: 3.8, h: 0.6,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: theme.secondary,
      align: "center", valign: "middle"
    });
    // Action
    slide.addText(l.action, {
      x: 6.2, y: y, w: 3.4, h: 0.6,
      fontSize: 13, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true,
      align: "center", valign: "middle"
    });
  });

  // Weight note
  slide.addText("评分权重：传播热度 25%  |  负面占比 30%  |  加速度 20%  |  意见领袖 15%  |  跨平台 10%", {
    x: 0.5, y: 4.9, w: 9, h: 0.4,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: theme.secondary, align: "center"
  });
})();

// ============================================================
// Slide 7: 技术亮点
// ============================================================
(function() {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };
  addTitleBar(slide, "技术亮点");
  addPageBadge(slide, 7);

  const highlights = [
    { icon: "🔍", title: "全流程可审计", desc: "每条情感标签附带判定依据\n支持人工抽检复验" },
    { icon: "📐", title: "风险评估量化", desc: "5级风险体系基于多维度\n加权评分，非主观判断" },
    { icon: "🔧", title: "引擎可插拔", desc: "词典匹配/ML/LLM\n三种模式自由切换" },
    { icon: "🔌", title: "采集器可扩展", desc: "统一接口 search/parse/normalize\n新增数据源即插即用" },
    { icon: "⚙️", title: "告警规则可配", desc: "config.json 驱动\n自定义阈值和告警渠道" },
    { icon: "📦", title: "零外部依赖", desc: "仅使用 Python 标准库\n部署简单，运行稳定" }
  ];

  highlights.forEach((h, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.4 + col * 3.1;
    const y = 1.4 + row * 2.0;

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 2.9, h: 1.8,
      fill: { color: theme.light },
      rectRadius: 0.08
    });
    slide.addText(h.icon, {
      x: x, y: y + 0.1, w: 2.9, h: 0.6,
      fontSize: 28, align: "center"
    });
    slide.addText(h.title, {
      x: x + 0.15, y: y + 0.7, w: 2.6, h: 0.4,
      fontSize: 16, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true, align: "center"
    });
    slide.addText(h.desc, {
      x: x + 0.15, y: y + 1.1, w: 2.6, h: 0.6,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: theme.secondary, align: "center",
      lineSpacingMultiple: 1.3
    });
  });
})();

// ============================================================
// Slide 8: 应用场景
// ============================================================
(function() {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };
  addTitleBar(slide, "应用场景");
  addPageBadge(slide, 8);

  const scenarios = [
    { icon: "🏙", title: "城市舆情日常监测", desc: "定期采集分析城市相关舆论，掌握民意动态，为城市管理提供数据支撑" },
    { icon: "🚨", title: "突发事件舆论追踪", desc: "实时监控突发事件的舆情发展，及时预警风险，辅助应急响应决策" },
    { icon: "📋", title: "政策发布民意反馈", desc: "收集分析政策发布后的公众反应，量化评估政策效果和社会接受度" },
    { icon: "🏟", title: "重大活动舆情保障", desc: "为重大活动提供舆情监控和应急响应支持，确保活动顺利进行" },
    { icon: "📊", title: "舆情风险研判", desc: "提供量化风险评估和趋势预测，为决策层提供科学依据" }
  ];

  scenarios.forEach((s, i) => {
    const x = 0.5;
    const y = 1.3 + i * 0.82;

    // Icon circle
    slide.addShape(pres.shapes.OVAL, {
      x: x, y: y + 0.05, w: 0.55, h: 0.55,
      fill: { color: i === 1 ? theme.accent : theme.primary }
    });
    slide.addText(s.icon, {
      x: x, y: y + 0.05, w: 0.55, h: 0.55,
      fontSize: 20, align: "center", valign: "middle"
    });

    // Title
    slide.addText(s.title, {
      x: x + 0.75, y: y, w: 3, h: 0.35,
      fontSize: 16, fontFace: "Microsoft YaHei",
      color: theme.primary, bold: true
    });
    // Desc
    slide.addText(s.desc, {
      x: x + 0.75, y: y + 0.32, w: 8, h: 0.4,
      fontSize: 11, fontFace: "Microsoft YaHei",
      color: theme.secondary
    });
  });
})();

// ============================================================
// Slide 9: 评估结果
// ============================================================
(function() {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };
  addPageBadge(slide, 9);

  // Title
  slide.addText("SkillsBench 评估结果", {
    x: 0.6, y: 0.3, w: 8.8, h: 0.8,
    fontSize: 32, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true
  });

  // Score circle
  slide.addShape(pres.shapes.OVAL, {
    x: 1.0, y: 1.5, w: 2.8, h: 2.8,
    fill: { color: theme.accent }
  });
  slide.addText("12/12", {
    x: 1.0, y: 1.7, w: 2.8, h: 1.8,
    fontSize: 52, fontFace: "Arial",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle"
  });
  slide.addText("精品层", {
    x: 1.0, y: 3.2, w: 2.8, h: 0.8,
    fontSize: 20, fontFace: "Microsoft YaHei",
    color: "FFFFFF", align: "center"
  });

  // Dimensions
  const dims = [
    "元数据完整性 ✅",
    "任务边界清晰度 ✅",
    "工作流结构化 ✅",
    "工具/脚本完整性 ✅",
    "约束规则明确性 ✅",
    "示例质量 ✅",
    "模板标准化 ✅",
    "错误处理 ✅",
    "可扩展性 ✅",
    "安全性 ✅",
    "测试覆盖 ✅",
    "文档质量 ✅"
  ];

  dims.forEach((d, i) => {
    const col = Math.floor(i / 6);
    const row = i % 6;
    const x = 4.5 + col * 2.8;
    const y = 1.5 + row * 0.55;
    slide.addText(d, {
      x: x, y: y, w: 2.6, h: 0.45,
      fontSize: 12, fontFace: "Microsoft YaHei",
      color: theme.light
    });
  });
})();

// ============================================================
// Slide 10: 总结
// ============================================================
(function() {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  // Accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 5.625,
    fill: { color: theme.accent }
  });

  slide.addText("城市舆情智能监测分析系统", {
    x: 0.8, y: 1.0, w: 8.5, h: 1.0,
    fontSize: 36, fontFace: "Microsoft YaHei",
    color: "FFFFFF", bold: true
  });

  slide.addShape(pres.shapes.LINE, {
    x: 0.8, y: 2.1, w: 2.5, h: 0,
    line: { color: theme.accent, width: 3 }
  });

  const points = [
    "六步闭环：采集 → 分析 → 聚类 → 预警 → 预测 → 报告",
    "五级风险量化评估体系，告别主观判断",
    "情感分析引擎可插拔，适配不同场景需求",
    "SkillsBench 12/12 精品层认证"
  ];

  points.forEach((p, i) => {
    slide.addText("▸  " + p, {
      x: 0.8, y: 2.5 + i * 0.55, w: 8.5, h: 0.45,
      fontSize: 16, fontFace: "Microsoft YaHei",
      color: theme.light
    });
  });

  slide.addText("GitHub: github.com/libra-sys/city-public-opinion-monitor", {
    x: 0.8, y: 4.8, w: 8.5, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: theme.secondary
  });
})();

// ============================================================
// Write output
// ============================================================
pres.writeFile({ fileName: "./output/city-public-opinion-monitor.pptx" })
  .then(() => console.log("PPTX generated: output/city-public-opinion-monitor.pptx"))
  .catch(err => console.error("Error:", err));
