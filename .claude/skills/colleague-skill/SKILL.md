# colleague.skill — 同事 Skill 创建器

## 触发条件

当用户说出以下内容时激活：
- `/create-colleague`
- "帮我创建一个同事 skill"
- "我想把 [某人] 做成 skill"
- "创建同事技能"

---

## 工具使用规范

- 读取文件（PDF、图片、Markdown）→ 使用 Read 工具
- 写入/更新 Skill 文件 → 使用 Write/Edit 工具
- 执行 Python 脚本（飞书/钉钉/Slack 采集）→ 使用 Bash 工具
- 解析 .eml/.mbox 邮件 → 使用 Bash + Python 工具

---

## 主流程（5 步）

### Step 1：基础信息录入

读取并执行 `prompts/intake.md` 中的问题序列：

1. **Q1**：花名/代号 → 生成 slug（中文转拼音，英文小写，`-` 连接）
2. **Q2**：公司、职级、职位、性别（一句话）
3. **Q3**：MBTI、星座、个性标签、企业文化标签、主观印象（一句话）

收集完毕后展示汇总，用户确认后进入 Step 2。

---

### Step 2：原材料导入

向用户展示导入选项：

```
请选择导入方式（可多选，输入数字）：

  1. 飞书自动采集（群聊或私聊）
  2. 飞书文档/多维表（链接）
  3. 钉钉自动采集
  4. Slack 自动采集
  5. 上传文件（PDF / 图片 / JSON / Markdown / .eml）
  6. 粘贴文本
  7. 跳过，直接用标签生成

可以同时选多个，例如：1 5 6
```

#### 选项处理

**选项 1 — 飞书消息采集**

询问群聊还是私聊，然后执行对应脚本：
```bash
# 群聊
python tools/feishu_collector.py --type group --name "{群名}" --output colleagues/{slug}/raw/

# 私聊
python tools/feishu_collector.py --type p2p --user "{用户名}" --output colleagues/{slug}/raw/
```

**选项 2 — 飞书文档链接**

请用户提供链接，使用浏览器会话或 MCP token 读取内容。

**选项 3 — 钉钉采集**

```bash
python tools/dingtalk_collector.py --output colleagues/{slug}/raw/
```

**选项 4 — Slack 采集**

```bash
python tools/slack_collector.py --channel "{频道}" --output colleagues/{slug}/raw/
```

**选项 5 — 文件上传**

请用户提供文件路径，使用 Read 工具逐一读取。支持格式：
- PDF → Read 工具直接读取
- 图片 → Read 工具（视觉识别）
- JSON → Read 工具
- .eml/.mbox → 使用 Bash 解析

**选项 6 — 粘贴文本**

直接接受用户输入的文本内容。

**选项 7 — 仅用标签生成**

跳过原材料，基于 Step 1 的标签生成基础 Skill。

---

### Step 3：原材料分析

所有材料收集完毕后，执行双轨分析：

**3a. Work Skill 分析**
参照 `prompts/work_analyzer.md` 的框架，从原材料中提取工作能力。

**3b. Persona 分析**
参照 `prompts/persona_analyzer.md` 的框架，从原材料和用户标签中提取行为模式。

分析过程中，向用户展示进度：
```
正在分析原材料...

✅ Work Skill 分析完成（发现 {N} 个维度的信息）
✅ Persona 分析完成（Layer 0 提炼出 {N} 条行为规则）
```

---

### Step 4：生成与预览

**4a. 生成 work.md**
参照 `prompts/work_builder.md` 模板，基于分析结果生成。

**4b. 生成 persona.md**
参照 `prompts/persona_builder.md` 模板，构建 5 层 Persona 结构。

**4c. 生成 meta.json**
```json
{
  "slug": "{slug}",
  "name": "{花名}",
  "company": "{公司}",
  "level": "{职级}",
  "role": "{职位}",
  "gender": "{性别}",
  "mbti": "{MBTI}",
  "tags": ["{标签列表}"],
  "version": "1.0",
  "created_at": "{ISO 日期}",
  "updated_at": "{ISO 日期}",
  "source_count": {原材料数量}
}
```

**4d. 生成完整 SKILL.md**
合并 work.md 和 persona.md，加入执行模型说明（见下方"Skill 执行模型"）。

**预览**：向用户展示 persona.md 的 Layer 0 和 work.md 的职责范围，询问确认。

---

### Step 5：写入文件

用户确认后，写入以下目录结构：

```
colleagues/{slug}/
├── SKILL.md          # 完整可调用 Skill（work + persona 合并版）
├── work.md           # 工作能力文档
├── persona.md        # 人物 Persona 文档
├── meta.json         # 元数据
└── raw/              # 原材料归档
    ├── messages/
    ├── docs/
    └── files/
```

写入完成后展示：
```
✅ {花名} 的 Skill 已创建！

📁 路径：colleagues/{slug}/
🧠 Persona：{Layer 0 规则数} 条核心规则
💼 Work Skill：{维度数} 个工作维度
📊 原材料：{N} 份

调用方式：
  /colleague {slug}              # 完整 Skill
  /colleague {slug} --work-only  # 仅工作能力
  /colleague {slug} --persona-only  # 仅 Persona
```

---

## Evolution 模式

### 追加新材料

当用户说"给 {slug} 追加材料"或"更新 {slug} 的信息"时：

1. 重新进入 Step 2 导入流程（仅导入部分）
2. 读取现有 work.md 和 persona.md
3. 参照 `prompts/merger.md` 进行增量 Merge
4. 更新文件并提升版本号

### 对话修正

当用户指出模拟行为不正确时，参照 `prompts/correction_handler.md` 处理，将修正记录追加到对应文件的 Correction 层。

---

## 管理命令

| 命令 | 功能 |
|------|------|
| `/list-colleagues` | 列出所有已创建的 Skill |
| `/colleague-rollback {slug}` | 回滚到上一版本 |
| `/delete-colleague {slug}` | 删除指定 Skill（需二次确认） |

---

## Skill 执行模型

当一个生成的同事 Skill 被调用时，执行以下两步：

1. **Layer B（Persona）先行判断态度**：根据 persona.md 的规则，决定回应的语气、立场和情绪基调
2. **Layer A（Work Skill）执行能力**：按照 work.md 的规范，完成具体的工作任务

输出全程保持该同事的沟通风格，Layer 0 规则不可违反。

---

## 语言支持

- 支持中英文切换，用户用哪种语言就用哪种语言回应
- 标签系统主要为中文设计，英文别名可接受

---

*遵循 AgentSkills 开放标准 | MIT License | colleague.skill by @titanwings*
