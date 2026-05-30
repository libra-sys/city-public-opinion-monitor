#!/usr/bin/env python3
"""城市舆情监测分析引擎 v1.0 - 仅依赖 Python 标准库"""
import argparse, csv, json, math, os, re, sys
from collections import Counter, defaultdict
from datetime import datetime

# ---- 配置 ----
SENTIMENT_DICT = {
    "positive": ["支持","赞同","好","优秀","满意","点赞","认可","合理","进步","改善","期待","高兴","欣慰","赞扬","表扬","肯定","欢迎","惠民","便民","利好","落实到位","成效显著","幸福感","安全感","获得感","提升","优化","完善","给力","靠谱","透明","高效","务实","到位","暖心","放心","创新","突破"],
    "negative": ["反对","不满","差","糟糕","投诉","抗议","愤怒","失望","担忧","质疑","问题","漏洞","隐患","不作为","懒政","腐败","扰民","污染","拥堵","太差","坑人","骗人","黑幕","乱象","严重","恶劣","可耻","荒唐","推诿","敷衍","形式主义","官僚主义","弄虚作假","暗箱操作","倒退"],
    "sensitive": ["谣言","造谣","煽动","极端","暴力","抗争","维权","上访","群体事件","非法聚集","传谣","恶意","攻击","威胁","危害","非法","罢工","示威","游行","静坐","暴乱","恐怖"]
}

RISK_WEIGHTS = {"spread_heat": 0.25, "negative_ratio": 0.30, "spread_speed": 0.20, "opinion_leader": 0.15, "cross_platform": 0.10}

RISK_THRESHOLDS = [(0,20,1,"极低风险"),(20,40,2,"低风险"),(40,60,3,"中风险"),(60,80,4,"高风险"),(80,101,5,"极高风险")]

RISK_SUGGESTIONS = {
    1: "当前舆情态势平稳，维持常规监测频率即可。",
    2: "局部出现讨论热点，建议加强关注，及时掌握舆情动向。",
    3: "舆情关注度上升，建议启动研判机制，准备应对预案。",
    4: "舆情风险较高，建议启动应急响应预案，加强信息发布和舆论引导。",
    5: "重大舆情风险，建议立即启动最高级别响应，协调多部门联合处置。",
}

STOP_WORDS = set("的了吗在有都也很到说要去看好自己这他和它我们什么是因为所以但是可以如果已经还是或者虽然然后关于对于以及不仅不过等等之以与及被把从对比更最又再只还".split())

def load_data(fp):
    if not os.path.exists(fp):
        sys.exit(f"文件不存在: {fp}")
    ext = os.path.splitext(fp)[1].lower()
    if ext == ".json":
        with open(fp, encoding="utf-8") as f:
            return json.load(f)
    if ext == ".csv":
        with open(fp, encoding="utf-8") as f:
            return list(csv.DictReader(f))
    with open(fp, encoding="utf-8") as f:
        lines = [l.strip() for l in f if l.strip()]
    return [{"id": i, "content": l, "source": "text", "time": ""} for i, l in enumerate(lines)]

def tokenize(text):
    cleaned = re.sub(r"[^\u4e00-\u9fff\w]", " ", text)
    words = []
    temp = ""
    for ch in cleaned:
        if "\u4e00" <= ch <= "\u9fff":
            if temp:
                words.append(temp.lower())
                temp = ""
            words.append(ch)
        elif ch.isalpha() or ch.isdigit():
            temp += ch
        else:
            if temp:
                words.append(temp.lower())
                temp = ""
    if temp:
        words.append(temp.lower())
    return [w for w in words if len(w) >= 2 and w not in STOP_WORDS]

def analyze_sentiment(text):
    pc = sum(1 for w in SENTIMENT_DICT["positive"] if w in text)
    nc = sum(1 for w in SENTIMENT_DICT["negative"] if w in text)
    sc = sum(1 for w in SENTIMENT_DICT["sensitive"] if w in text)
    total = pc + nc
    evidence = {"pos": pc, "neg": nc, "sen": sc}
    if sc > 0:
        return ("sensitive", min(0.99, 0.7 + sc * 0.1), evidence)
    if nc > pc:
        return ("negative", min(0.95, 0.5 + (nc - pc) / max(total, 1) * 0.4), evidence)
    if pc > nc:
        return ("positive", min(0.95, 0.5 + (pc - nc) / max(total, 1) * 0.4), evidence)
    return ("neutral", 0.5, evidence)

def batch_sentiment(data):
    results, stats = [], {"positive": 0, "negative": 0, "neutral": 0, "sensitive": 0, "total": 0}
    for item in data:
        content = item.get("content", item.get("text", ""))
        if not content:
            continue
        label, conf, ev = analyze_sentiment(content)
        results.append({"id": item.get("id", ""), "preview": content[:100], "source": item.get("source", "unknown"),
                        "time": item.get("time", ""), "sentiment": label, "confidence": round(conf, 4), "evidence": ev})
        stats[label] += 1
        stats["total"] += 1
    return results, stats

def sentiment_trend(results):
    if not results:
        return {"error": "nodata"}
    ds = defaultdict(lambda: {"positive": 0, "negative": 0, "neutral": 0, "sensitive": 0, "total": 0})
    for r in results:
        t = r.get("time", "")[:10] or "unknown"
        ds[t]["total"] += 1
        ds[t][r["sentiment"]] += 1
    td = []
    for day in sorted(ds.keys()):
        d = ds[day]
        total = max(d["total"], 1)
        td.append({"date": day, "pos": round(d["positive"] / total * 100, 1), "neg": round(d["negative"] / total * 100, 1),
                   "neu": round(d["neutral"] / total * 100, 1), "sen": round(d["sensitive"] / total * 100, 1), "count": d["total"]})
    direction = "数据不足"
    if len(td) >= 2:
        diff = td[-1]["neg"] - td[0]["neg"]
        direction = "负面情绪上升" if diff > 5 else ("负面情绪下降" if diff < -5 else "情绪态势平稳")
    return {"daily_trend": td, "direction": direction, "points": len(td)}

def extract_keywords(data, top_n=20):
    all_w, dc, df = [], 0, Counter()
    for item in data:
        content = item.get("content", item.get("text", ""))
        if not content:
            continue
        ws = tokenize(content)
        all_w.extend(ws)
        dc += 1
        for w in set(ws):
            df[w] += 1
    tf = Counter(all_w)
    scores = {}
    for w, f in tf.items():
        if len(w) < 2:
            continue
        idf = math.log((dc + 1) / (df.get(w, 1) + 1)) + 1
        scores[w] = f * idf
    return [{"k": w, "s": round(sc, 2), "f": tf[w]} for w, sc in sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]]

def textrank(data, top_n=10):
    wl = [[w for w in tokenize(item.get("content", item.get("text", ""))) if len(w) >= 2] for item in data]
    wl = [w for w in wl if w]
    if len(wl) < 2:
        return []
    g = defaultdict(lambda: defaultdict(float))
    for words in wl:
        for i, w1 in enumerate(words):
            for j in range(i + 1, min(i + 5, len(words))):
                w2 = words[j]
                if w1 != w2:
                    g[w1][w2] += 1.0
                    g[w2][w1] += 1.0
    scores = {w: 1.0 for w in g}
    for _ in range(20):
        ns = {}
        for w in g:
            ns[w] = 0.15 + 0.85 * sum(scores[n] / max(sum(g[n].values()), 1) * g[w][n] for n in g[w])
        scores = ns
    return [{"k": w, "tr": round(s, 4)} for w, s in sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]]

def calc_risk(stats, trend, data):
    nr = (stats["negative"] + stats["sensitive"]) / max(stats["total"], 1)
    hs = min(stats["total"] / 5000 * 100, 100)
    if isinstance(trend, dict) and "daily_trend" in trend and len(trend["daily_trend"]) >= 2:
        r = trend["daily_trend"][-2:]
        gr = (r[-1]["count"] - r[0]["count"]) / max(r[0]["count"], 1) if r[0]["count"] > 0 else 0
    else:
        gr = 0
    ss = max(min((gr + 0.5) * 100, 100), 0)
    srcs = set(item.get("source", "unknown") for item in data)
    ps = min(len(srcs) / 5 * 100, 100)
    lc = sum(1 for item in data if any(k in item.get("content", item.get("text", "")) for k in ["大V","意见领袖","专家","教授","官方","权威"]))
    ls = min(lc / max(stats["total"], 1) * 500, 100)
    score = round(hs * 0.25 + nr * 100 * 0.30 + ss * 0.20 + ls * 0.15 + ps * 0.10, 1)
    lv, ln = 1, "极低风险"
    for lo, hi, l, n in RISK_THRESHOLDS:
        if lo <= score < hi:
            lv, ln = l, n
            break
    return {"score": score, "level": lv, "name": ln, "dims": {"heat": round(hs, 1), "neg": round(nr * 100, 1), "speed": round(ss, 1), "leader": round(ls, 1), "platform": round(ps, 1)}}

def gen_report_json(stats, trend, kws, trkws, risk, count, topic=""):
    st = max(stats["total"], 1)
    return {
        "meta": {"time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "topic": topic or "未指定", "count": count, "disclaimer": "本报告由 AI 辅助生成，仅供参考"},
        "sentiment": {"positive": {"n": stats["positive"], "pct": round(stats["positive"] / st * 100, 1)},
                      "negative": {"n": stats["negative"], "pct": round(stats["negative"] / st * 100, 1)},
                      "neutral": {"n": stats["neutral"], "pct": round(stats["neutral"] / st * 100, 1)},
                      "sensitive": {"n": stats["sensitive"], "pct": round(stats["sensitive"] / st * 100, 1)}},
        "trend": trend, "keywords_tfidf": kws, "keywords_textrank": trkws,
        "risk": risk, "warning": {"level": risk["level"], "alert": risk["level"] >= 3, "suggestion": RISK_SUGGESTIONS.get(risk["level"], "")}
    }

def gen_report_md(rj):
    m, s, t, risk, warn = rj["meta"], rj["sentiment"], rj["trend"], rj["risk"], rj["warning"]
    lines = [f"# 城市舆情监测报告\n",
             f"## 监测概览\n| 项目 | 内容 |\n|------|------|\n| 监测主题 | {m['topic']} |\n| 数据总量 | {m['count']} 条 |\n| 生成时间 | {m['time']} |\n",
             f"## 情感分析\n| 情感 | 数量 | 占比 |\n|------|------|------|\n| 正面 | {s['positive']['n']} | {s['positive']['pct']}% |\n| 负面 | {s['negative']['n']} | {s['negative']['pct']}% |\n| 中性 | {s['neutral']['n']} | {s['neutral']['pct']}% |\n| 敏感 | {s['sensitive']['n']} | {s['sensitive']['pct']}% |\n",
             f"### 情感趋势\n趋势方向: **{t.get('direction', '未知')}**\n| 日期 | 正面 | 负面 | 中性 | 数据量 |\n|------|------|------|------|--------|\n"]
    for d in t.get("daily_trend", []):
        lines.append(f"| {d['date']} | {d['pos']}% | {d['neg']}% | {d['neu']}% | {d['count']} |\n")
    lines.append(f"\n## 热点关键词\n| 排名 | 关键词 | TF-IDF 得分 | 频次 |\n|------|--------|-------------|------|\n")
    for i, kw in enumerate(rj.get("keywords_tfidf", [])[:10], 1):
        lines.append(f"| {i} | {kw['k']} | {kw['s']} | {kw['f']} |\n")
    lines.append(f"\n## 风险等级评估\n- 综合评分: **{risk['score']}** / 100\n- 风险等级: **{risk['level']}** 级 ({risk['name']})\n- 预警: {'需要预警' if warn['alert'] else '正常'}\n")
    lines.append(f"### 维度评分\n| 维度 | 评分 |\n|------|------|\n| 传播热度 | {risk['dims']['heat']} |\n| 负面占比 | {risk['dims']['neg']} |\n| 传播速度 | {risk['dims']['speed']} |\n| 意见领袖 | {risk['dims']['leader']} |\n| 跨平台 | {risk['dims']['platform']} |\n")
    lines.append(f"\n## 预警建议\n{warn['suggestion']}\n\n---\n*本报告由 AI 辅助生成，仅供参考。*\n")
    return "".join(lines)

def main():
    ap = argparse.ArgumentParser(description="城市舆情监测分析引擎")
    ap.add_argument("input", help="输入数据文件 (JSON/CSV/TXT)")
    ap.add_argument("-o", "--output", default="report", help="输出文件前缀")
    ap.add_argument("-f", "--format", choices=["json", "markdown", "both"], default="json")
    ap.add_argument("-t", "--topic", default="", help="监测主题")
    ap.add_argument("-k", "--top-k", type=int, default=20)
    args = ap.parse_args()
    print(f"[信息] 加载: {args.input}")
    data = load_data(args.input)
    print(f"[信息] 加载 {len(data)} 条数据")
    sr, stats = batch_sentiment(data)
    print("[分析] 情感分析完成")
    trend = sentiment_trend(sr)
    kws = extract_keywords(data, args.top_k)
    trkws = textrank(data, min(args.top_k, 10))
    risk = calc_risk(stats, trend, data)
    rj = gen_report_json(stats, trend, kws, trkws, risk, len(data), args.topic)
    if args.format in ("json", "both"):
        jp = args.output + ".json"
        with open(jp, "w", encoding="utf-8") as f:
            json.dump(rj, f, ensure_ascii=False, indent=2)
        print(f"[输出] {jp}")
    if args.format in ("markdown", "both"):
        mp = args.output + ".md"
        with open(mp, "w", encoding="utf-8") as f:
            f.write(gen_report_md(rj))
        print(f"[输出] {mp}")
    sp = args.output + "_sentiments.csv"
    with open(sp, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["ID","内容摘要","来源","情感","置信度"])
        for r in sr[:200]:
            w.writerow([r["id"], r["preview"], r["source"], r["sentiment"], r["confidence"]])
    print(f"[输出] {sp}")
    print(f"\n{'='*50}\n分析完成!\n  正面{stats['positive']} 负面{stats['negative']} 中性{stats['neutral']} 敏感{stats['sensitive']}\n  风险: {risk['level']}级({risk['name']}) 评分:{risk['score']}/100\n{'='*50}")

if __name__ == "__main__":
    main()
