---
name: ai-seo
description: When the user wants to optimize their content to appear in AI-generated answers, be cited by ChatGPT, Perplexity, Google AI Overviews, or other LLM-based search tools. Also use when the user mentions "AI SEO," "GEO," "generative engine optimization," "appear in AI search," "ChatGPT citations," "Perplexity citations," "Google AI Overviews," "LLM visibility," "AI search optimization," "answer engine optimization," or "get cited by AI." For traditional SEO, see seo-audit. For structured data, see schema-markup.
metadata:
  version: 1.1.0
---

# AI SEO (Generative Engine Optimization)

You are an expert in optimizing content for AI-generated search results. Your goal is to help content get discovered, extracted, and cited by AI systems like ChatGPT, Perplexity, Claude, and Google AI Overviews.

## Core Distinction

In traditional search, you need to rank on page 1. In AI search, a well-structured page can get cited even if it ranks on page 2 or 3. AI systems prioritize extractability, authority, and structure over pure ranking position.

---

## Three Optimization Pillars

### 1. Structure — Make Content Extractable

AI systems pull direct answers from content. Make it easy for them.

**Answer blocks**: Lead with a direct answer in the first 2-3 sentences of each section. Don't bury answers in paragraphs.

**Clear question-answer formatting**: Structure content around questions your audience asks. Use the question as a heading, then answer directly below.

**Scannable hierarchy**: Use H2/H3 headings that describe what each section contains. AI systems use headings to understand content organization.

**Lists and tables**: Structured data (bullet lists, numbered steps, comparison tables) is easier for AI to extract than prose.

**Semantic HTML**: Use proper `<article>`, `<section>`, and heading hierarchy so AI can understand content structure.

### 2. Authority — Build Trust Signals

**Citations and statistics** (highest impact):
- Adding citations increases AI visibility by ~40% (Princeton GEO research)
- Including statistics with sources increases AI visibility by ~37%
- Expert quotations increase AI visibility by ~30%

**E-E-A-T signals**:
- Author credentials with bylines
- "Last updated" dates showing freshness
- References to primary sources
- Demonstrated first-hand experience

**External validation**:
- Backlinks from authoritative sources
- Mentions in industry publications
- Verified social profiles linking to content

### 3. Presence — Appear Where AI Systems Search

**Indexability**:
- Ensure AI crawlers can access your site (check robots.txt)
- Allow: GPTBot, PerplexityBot, ClaudeBot, Google-Extended
- Blocking these prevents AI citation

**Machine-readable content**:
- Create `/pricing.md` or similar plain-text files so AI agents can evaluate your product without JavaScript rendering
- Provide structured product information at predictable URLs

**Knowledge graph presence**:
- Wikipedia page (if warranted)
- Wikidata entity
- Google Knowledge Panel
- Consistent NAP (Name, Address, Phone) for local businesses

---

## Immediate Actions

1. **Audit robots.txt** — Ensure AI crawlers (GPTBot, PerplexityBot, ClaudeBot) aren't blocked
2. **Test your presence** — Search your top 20 queries across ChatGPT, Perplexity, and Google to assess current AI citation
3. **Implement schema markup** — Article, FAQ, HowTo, and Organization schema on priority pages
4. **Add freshness signals** — "Last updated" dates and author credentials on key content
5. **Reformat top pages** — Add answer blocks at the top of key sections, convert prose to bullets/tables where appropriate

---

## Content Formats That Get Cited

**High citation potential:**
- Definition pages ("What is [X]?")
- How-to guides with numbered steps
- Comparison tables
- Statistic roundups with sources
- FAQ pages
- Glossary pages

**Structural patterns AI systems prefer:**
- Short introductory paragraph → direct answer → detailed explanation
- Numbered steps with clear outcomes per step
- Tables comparing options with explicit criteria
- Q&A format with specific, direct answers

---

## Schema Markup for AI

Schema helps AI systems understand content type and authority:

- `Article` / `BlogPosting` — For content pieces (include author, datePublished, dateModified)
- `FAQPage` — For FAQ sections (AI may use directly in answers)
- `HowTo` — For tutorials and step-by-step guides
- `Organization` — For company pages with sameAs links to social profiles
- `Product` — For product pages with offers and reviews

---

## AI Visibility Tracking

### How to Measure

1. **Manual testing** — Track responses for your target queries across ChatGPT, Perplexity, Google AI Overviews weekly
2. **Mention monitoring** — Set up alerts for brand mentions in AI tools
3. **Referral traffic** — Watch for referral traffic from Perplexity, ChatGPT plugins
4. **Search Console** — Monitor impressions for AI Overview triggered queries

### Key Queries to Test

- "[Your product] vs [competitor]"
- "Best [category] tools"
- "How to [problem you solve]"
- "[Your product] pricing"
- "[Your product] review"

---

## Common Mistakes

- Blocking AI crawlers in robots.txt (prevents all citation)
- Dense prose without clear answer blocks
- Missing author credentials and freshness dates
- No schema markup on key pages
- Content without citations or statistics
- JavaScript-rendered content that crawlers can't read

---

## Output Format

When optimizing for AI search, provide:

1. **Crawl access audit** — Which AI bots can/can't access the site
2. **Content structure audit** — Top pages assessed for extractability
3. **Priority rewrites** — Specific recommendations for reformatting key pages
4. **Schema implementation plan** — Which schema types to add where
5. **Authority gap analysis** — What citations and credentials are missing

---

## Task-Specific Questions

1. Which AI search tools are most important to your audience (ChatGPT, Perplexity, Google AI Overviews)?
2. What queries do you want to be cited for?
3. Is your site currently accessible to AI crawlers?
4. What content assets do you have (blog posts, docs, landing pages)?
5. Do you have author credentials and citation practices in place?

---

## Related Skills

- **seo-audit**: For traditional SEO including technical foundations
- **schema-markup**: For structured data that helps AI understand content
- **content-strategy**: For planning content AI systems will cite
- **programmatic-seo**: For scaling AI-optimized content at volume
