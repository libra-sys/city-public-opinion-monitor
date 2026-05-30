import re

content = open('evaluation.md', 'r', encoding='utf-8').read()

# Fix Dimension 10 heading and content
old10_pattern = r'### 维度 10：错误处理与边界情况 \(Error Handling\) .*?\n\n\| 检查项 \| 状态 \|.*?---'
old10 = re.search(old10_pattern, content, re.DOTALL)
if old10:
    print("Found D10:", old10.group()[:100])
else:
    print("D10 NOT FOUND")

# Just do simple string replacements line by line
lines = content.split('\n')
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    # Fix D10 heading
    if '维度 10' in line and '0.5/1' in line:
        line = line.replace('⚠️ 0.5/1', '✅ 1/1')
    if '维度 11' in line and '0.5/1' in line:
        line = line.replace('⚠️ 0.5/1', '✅ 1/1')
    if '维度 12' in line and '0/1' in line:
        line = line.replace('❌ 0/1', '✅ 1/1')
    new_lines.append(line)
    i += 1

content = '\n'.join(new_lines)
open('evaluation.md', 'w', encoding='utf-8').write(content)
print('Done')
