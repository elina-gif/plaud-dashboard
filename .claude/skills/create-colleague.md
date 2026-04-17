# create-colleague

将任何人（同事、导师、前辈、历史人物等）蒸馏为可复用的 AI Skill。

读取并严格遵照 `.claude/skills/colleague-skill/SKILL.md` 中定义的完整流程执行。

---

## 快速参考

**触发方式**：`/create-colleague` 或直接说"帮我创建一个同事 Skill"

**核心流程**：
1. 基础信息录入（3 个问题：花名 / 背景 / 性格）
2. 原材料导入（飞书 / 钉钉 / Slack / 文件 / 粘贴）
3. Work Skill + Persona 双轨分析
4. 生成预览
5. 写入 `colleagues/{slug}/` 目录

**输出文件**：
- `work.md` — 工作能力、技术规范、工作流程
- `persona.md` — 5 层人物 Persona（Layer 0–5）
- `meta.json` — 元数据和版本信息
- `SKILL.md` — 完整可调用 Skill

**管理命令**：
- `/list-colleagues` — 查看所有已创建的 Skill
- `/colleague-rollback {slug}` — 版本回滚
- `/delete-colleague {slug}` — 删除 Skill

---

开始时，直接说"我来帮你创建这位同事的 Skill。只需要回答 3 个问题，每个都可以跳过。"然后提出 Q1。
