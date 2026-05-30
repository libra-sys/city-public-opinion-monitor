# 城市舆情智能监测分析系统

> City Public Opinion Monitor — 全流程舆情采集、情感分析、风险预警与趋势预测

[![Skill Version](https://img.shields.io/badge/version-v1.0.0-blue)]()
[![Quality Score](https://img.shields.io/badge/quality-12%2F12-brightgreen)]()
[![Platform](https://img.shields.io/badge/platform-WorkBuddy-purple)]()

## 功能概述

面向城市管理部门和政府机构的全流程舆情分析工具，覆盖六步闭环：

```
数据采集 → 情感分析 → 主题聚类 → 风险预警 → 趋势预测 → 报告生成
```

## 核心功能

| 功能 | 说明 |
|------|------|
| **多源数据采集** | 支持新闻媒体、社交媒体、网络论坛、政府公告等渠道，按关键词、地域、时间范围自动抓取 |
| **智能情感分析** | 正面/中性/负面/敏感四维标注，每条标签附带判定依据，支持人工抽检可审计 |
| **主题热点聚类** | 基于 TF-IDF、TextRank 和 LDA 模型自动提取讨论热点，生成议题分布和热度时间线 |
| **五级风险预警** | 五维度量化评分（传播热度25%、负面占比30%、加速度20%、意见领袖15%、跨平台10%） |
| **趋势预测** | 基于 SIR 传播模型和情感曲线分析舆情未来走势 |
| **报告自动生成** | 支持日报、周报、专报、月报等多类型结构化输出 |

## 技术亮点

- **全流程可审计** — 情感分析标签与原文可追溯对照
- **风险评估量化** — 5级风险等级体系基于多维度加权评分
- **引擎可插拔** — 支持词典匹配、机器学习、大语言模型三种模式切换
- **采集器可扩展** — 统一接口（search/parse/normalize），新增数据源只需实现接口
- **告警规则可配置** — 由 config.json 驱动，支持自定义阈值和告警渠道

## 应用场景

- 城市舆情日常监测
- 突发事件舆论追踪
- 政策发布民意反馈
- 重大活动舆情保障
- 舆情风险研判与决策支持

## 目录结构

```
city-public-opinion-monitor/
├── SKILL.md                    # 技能定义文件
├── assets/
│   └── config.json             # 配置文件（情感分析方法、告警规则等）
├── scripts/
│   ├── opinion-analyzer.py     # 核心分析脚本
│   └── validate.sh             # 验证脚本（10项检查）
├── references/
│   ├── 舆情监测方法论.md        # 方法论文档
│   ├── examples/
│   │   ├── sample-input.md     # 输入示例（20条测试数据）
│   │   └── expected-output.md  # 输出示例（完整分析报告）
│   └── templates/
│       └── report-template.md  # 报告模板
├── evaluation.md               # SkillsBench 评估报告（12/12 精品层）
├── product-doc.md              # 产品说明文档
├── security-report.md          # 安全审计报告
└── presentation.html           # 演示页面
```

## 快速开始

### 1. 安装到 WorkBuddy

将整个目录复制到 `~/.workbuddy/skills/` 即可使用。

### 2. 触发方式

```
舆情监测 城市空气质量
帮我分析一下最近的网络舆情
生成一份舆情报告
```

### 3. 验证安装

```bash
bash scripts/validate.sh sample-output.md
```

## 配置说明

编辑 `assets/config.json` 可调整：

- `sentiment.method` — 情感分析引擎（`lexicon` / `ml` / `llm`）
- `alerts.rules` — 告警规则和阈值
- `collection` — 数据采集参数（时间范围、数据量上限等）

## 评估结果

基于 SkillsBench 12 维度评分体系，综合得分 **12/12**，达到**精品层（Elite Tier）**标准。

详见 [evaluation.md](evaluation.md)

## 技术栈

- Python 3.x（仅使用标准库，无外部依赖）
- NLP：TF-IDF、TextRank、LDA 主题模型
- 统计建模：SIR 传播模型、情感曲线分析
- 数据格式：JSON / Markdown / CSV

## 许可证

MIT License
