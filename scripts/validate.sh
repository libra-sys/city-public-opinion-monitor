#!/bin/bash
# ============================================================
# 城市舆情监测分析系统 - 报告质量验证脚本
# City Public Opinion Monitor - Report Validation Script
# ============================================================
# 功能：对生成的舆情监测报告进行10项关键质量检查
# 用法：./validate.sh <报告文件路径> [--strict]
# 返回：0=全部通过, 1=存在警告, 2=存在错误
#
# 10项检查清单：
#   1. 来源引用完整性检查
#   2. 情感标签可审计性检查
#   3. 风险等级量化检查
#   4. 风险等级定义完整性检查
#   5. 趋势预测指标存在性检查
#   6. 报告结构完整性检查
#   7. 数据时效性检查
#   8. 数据覆盖率检查
#   9. 免责声明检查
#  10. 热点话题量化检查
# ============================================================

set -euo pipefail

# ---- 配置 ----
REPORT_FILE="${1:-}"
STRICT_MODE=false
PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0
TOTAL_CHECKS=10

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ---- 辅助函数 ----
print_header() {
    echo "============================================"
    echo "  城市舆情监测报告 - 质量验证工具 v1.0"
    echo "============================================"
    echo "目标文件: ${REPORT_FILE:-未指定}"
    echo "验证模式: $([ "$STRICT_MODE" = true ] && echo '严格模式' || echo '标准模式')"
    echo "检查时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "============================================"
    echo ""
}

print_result() {
    local check_name="$1"
    local status="$2"
    local detail="$3"
    local icon=""

    case "$status" in
        PASS)
            icon="${GREEN}[PASS]${NC}"
            ((PASS_COUNT++))
            ;;
        WARN)
            icon="${YELLOW}[WARN]${NC}"
            ((WARN_COUNT++))
            ;;
        FAIL)
            icon="${RED}[FAIL]${NC}"
            ((FAIL_COUNT++))
            ;;
    esac

    printf "  %-50s %s  %s\n" "$check_name" "$icon" "$detail"
}

print_summary() {
    echo ""
    echo "============================================"
    echo "  验证结果汇总"
    echo "============================================"
    echo "  总计检查项: $TOTAL_CHECKS"
    echo "  通过 (PASS): ${GREEN}$PASS_COUNT${NC}"
    echo "  警告 (WARN): ${YELLOW}$WARN_COUNT${NC}"
    echo "  失败 (FAIL): ${RED}$FAIL_COUNT${NC}"

    if [ $FAIL_COUNT -gt 0 ]; then
        echo ""
        echo "  ${RED}验证失败：存在 $FAIL_COUNT 项未通过检查${NC}"
        exit 2
    elif [ $WARN_COUNT -gt 0 ] && [ "$STRICT_MODE" = true ]; then
        echo ""
        echo "  ${YELLOW}严格模式：存在 $WARN_COUNT 项警告，视为失败${NC}"
        exit 2
    elif [ $WARN_COUNT -gt 0 ]; then
        echo ""
        echo "  ${YELLOW}验证通过（含 $WARN_COUNT 项警告）${NC}"
        exit 1
    else
        echo ""
        echo "  ${GREEN}验证全部通过！${NC}"
        exit 0
    fi
}

# ---- 检查函数 ----

# 检查1：来源引用完整性
check_source_citations() {
    local report_content="$1"

    # 查找引用标记：方括号数字引用 [1]、[2] 等，或来源部分
    local citation_count=$(echo "$report_content" | grep -cP '(\[来源\d+\]|数据来源|参考文献|\[\d+\]|来源：)' || true)

    # 查找数据来源章节
    local has_source_section=$(echo "$report_content" | grep -cP '(数据来源|信息来源|参考来源|References)' || true)

    if [ "$citation_count" -ge 2 ] && [ "$has_source_section" -ge 1 ]; then
        print_result "1.来源引用完整性" "PASS" "发现 $citation_count 处引用标记及来源章节"
    elif [ "$citation_count" -ge 1 ]; then
        print_result "1.来源引用完整性" "WARN" "仅有 $citation_count 处引用，建议增加来源标注"
    else
        print_result "1.来源引用完整性" "FAIL" "未发现任何来源引用标记"
    fi
}

# 检查2：情感标签可审计性
check_sentiment_auditability() {
    local report_content="$1"

    local sentiment_count=$(echo "$report_content" | grep -cPi '(正面|负面|中性|敏感|Positive|Negative|Neutral|Sensitive)' || true)
    local audit_trail=$(echo "$report_content" | grep -cPi '(置信度|判断依据|标注依据|原文对照|原文对|判定依据)' || true)

    if [ "$sentiment_count" -ge 3 ] && [ "$audit_trail" -ge 1 ]; then
        print_result "2.情感标签可审计性" "PASS" "发现 $sentiment_count 处情感标签，含审计依据"
    elif [ "$sentiment_count" -ge 3 ]; then
        print_result "2.情感标签可审计性" "WARN" "有情感标签但缺少审计追溯信息"
    else
        print_result "2.情感标签可审计性" "WARN" "情感标签数量不足（仅 $sentiment_count 处）"
    fi
}

# 检查3：风险等级量化
check_risk_level_quantification() {
    local report_content="$1"

    local risk_level=$(echo "$report_content" | grep -cPi '(风险等级[：:]\s*[1-5]级|风险等级[：:]\s*[一二三四五]级|risk level[：:]\s*[1-5])' || true)
    local risk_score=$(echo "$report_content" | grep -cPi '(风险评分[：:]\s*\d|risk score[：:]\s*\d|综合评分[：:]\s*\d)' || true)

    if [ "$risk_level" -ge 1 ] && [ "$risk_score" -ge 1 ]; then
        print_result "3.风险等级量化" "PASS" "风险等级:${risk_level}处, 风险评分:${risk_score}处"
    elif [ "$risk_level" -ge 1 ]; then
        print_result "3.风险等级量化" "WARN" "有风险等级但缺少量化评分"
    else
        print_result "3.风险等级量化" "FAIL" "未发现量化风险等级或评分"
    fi
}

# 检查4：风险等级定义完整性
check_risk_level_definition() {
    local report_content="$1"

    local risk_def=$(echo "$report_content" | grep -cPi '(极低风险|低风险|中风险|高风险|极高风险|risk level.*definition|风险等级.*定义)' || true)
    local risk_response=$(echo "$report_content" | grep -cPi '(响应建议|处置建议|应对措施|建议措施)' || true)

    if [ "$risk_def" -ge 3 ] && [ "$risk_response" -ge 1 ]; then
        print_result "4.风险等级定义完整性" "PASS" "风险等级定义:${risk_def}处, 响应建议:${risk_response}处"
    elif [ "$risk_def" -ge 3 ]; then
        print_result "4.风险等级定义完整性" "WARN" "有等级定义但缺少响应建议"
    else
        print_result "4.风险等级定义完整性" "WARN" "风险等级定义不够详细"
    fi
}

# 检查5：趋势预测指标存在性
check_trend_indicators() {
    local report_content="$1"

    local trend_count=$(echo "$report_content" | grep -cPi '(趋势预测|热度趋势|上升趋势|下降趋势|平稳趋势|趋势判断|Trend|预测)' || true)
    local direction=$(echo "$report_content" | grep -cPi '(↑|↓|→|上升|下降|平稳|增长|减少)' || true)

    if [ "$trend_count" -ge 2 ] && [ "$direction" -ge 2 ]; then
        print_result "5.趋势预测指标" "PASS" "趋势描述:${trend_count}处, 方向指标:${direction}处"
    elif [ "$trend_count" -ge 1 ]; then
        print_result "5.趋势预测指标" "WARN" "趋势预测内容偏少"
    else
        print_result "5.趋势预测指标" "FAIL" "未发现趋势预测相关内容"
    fi
}

# 检查6：报告结构完整性
check_report_structure() {
    local report_content="$1"

    local has_overview=$(echo "$report_content" | grep -cPi '(监测概览|概述|Overview|摘要)' || true)
    local has_analysis=$(echo "$report_content" | grep -cPi '(分析|分析结果|详细分析|Analysis)' || true)
    local has_conclusion=$(echo "$report_content" | grep -cPi '(结论|总结|建议|Summary|Conclusion|建议)' || true)

    local structure_score=$((has_overview + has_analysis + has_conclusion))

    if [ "$structure_score" -ge 3 ]; then
        print_result "6.报告结构完整性" "PASS" "概览/分析/结论三段式结构完整"
    elif [ "$structure_score" -ge 2 ]; then
        print_result "6.报告结构完整性" "WARN" "报告结构不完整(缺少${has_overview:+''}${has_overview:+''})"
    else
        print_result "6.报告结构完整性" "FAIL" "报告结构严重不完整"
    fi
}

# 检查7：数据时效性
check_data_timeliness() {
    local report_content="$1"

    local time_markers=$(echo "$report_content" | grep -cP '(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}[日号]|\d{2}:\d{2}|采集时间|更新时间|监测时间)' || true)

    if [ "$time_markers" -ge 2 ]; then
        print_result "7.数据时效性" "PASS" "发现 $time_markers 处时间标注"
    elif [ "$time_markers" -ge 1 ]; then
        print_result "7.数据时效性" "WARN" "时间标注不足（仅 $time_markers 处）"
    else
        print_result "7.数据时效性" "FAIL" "未发现任何时间标注"
    fi
}

# 检查8：数据覆盖率
check_data_coverage() {
    local report_content="$1"

    local source_types=$(echo "$report_content" | grep -cPi '(新闻媒体|社交媒体|论坛|政府公告|微博|微信|知乎|贴吧|抖音)' || true)
    local data_volume=$(echo "$report_content" | grep -cPi '(采集.*\d+.*条|共计.*\d+.*条|数据量.*\d+|样本量.*\d+)' || true)

    if [ "$source_types" -ge 3 ] && [ "$data_volume" -ge 1 ]; then
        print_result "8.数据覆盖率" "PASS" "覆盖${source_types}类渠道，有数据量统计"
    elif [ "$source_types" -ge 2 ]; then
        print_result "8.数据覆盖率" "WARN" "渠道覆盖不足（仅 ${source_types} 类）"
    else
        print_result "8.数据覆盖率" "WARN" "数据来源和覆盖范围信息不足"
    fi
}

# 检查9：免责声明检查
check_disclaimer() {
    local report_content="$1"

    local disclaimer=$(echo "$report_content" | grep -cPi '(免责声明|仅供参考|AI辅助生成|自动生成|本报告.*参考|Disclaimer)' || true)

    if [ "$disclaimer" -ge 1 ]; then
        print_result "9.免责声明" "PASS" "包含免责声明"
    else
        print_result "9.免责声明" "FAIL" "缺少免责声明"
    fi
}

# 检查10：热点话题量化
check_topic_quantification() {
    local report_content="$1"

    local topic_list=$(echo "$report_content" | grep -cPi '(TOP\d+|热点话题.*\d+|排名.*\d+|热度.*\d+%|占比.*\d+)' || true)
    local keyword_count=$(echo "$report_content" | grep -cPi '(关键词|keyword|热词|词云)' || true)

    if [ "$topic_list" -ge 2 ] && [ "$keyword_count" -ge 1 ]; then
        print_result "10.热点话题量化" "PASS" "话题排名:${topic_list}处, 关键词:${keyword_count}处"
    elif [ "$topic_list" -ge 1 ]; then
        print_result "10.热点话题量化" "WARN" "热点话题量化信息不充分"
    else
        print_result "10.热点话题量化" "FAIL" "未发现量化的话题热度信息"
    fi
}

# ---- 主流程 ----
main() {
    print_header

    # 参数检查
    if [ -z "$REPORT_FILE" ]; then
        echo -e "${RED}错误：请指定报告文件路径${NC}"
        echo "用法: $0 <报告文件路径> [--strict]"
        exit 2
    fi

    if [ ! -f "$REPORT_FILE" ]; then
        echo -e "${RED}错误：文件不存在: $REPORT_FILE${NC}"
        exit 2
    fi

    # 检查严格模式
    if [[ "${2:-}" == "--strict" ]]; then
        STRICT_MODE=true
    fi

    # 读取报告内容
    local content
    content=$(cat "$REPORT_FILE" 2>/dev/null || echo "")

    if [ -z "$content" ]; then
        echo -e "${RED}错误：报告文件为空${NC}"
        exit 2
    fi

    local line_count=$(echo "$content" | wc -l | tr -d ' ')
    echo "报告文件大小: ${line_count} 行"
    echo ""

    # 执行10项检查
    check_source_citations "$content"
    check_sentiment_auditability "$content"
    check_risk_level_quantification "$content"
    check_risk_level_definition "$content"
    check_trend_indicators "$content"
    check_report_structure "$content"
    check_data_timeliness "$content"
    check_data_coverage "$content"
    check_disclaimer "$content"
    check_topic_quantification "$content"

    print_summary
}

main "$@"
