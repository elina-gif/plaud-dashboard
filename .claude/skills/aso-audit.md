---
name: aso-audit
description: When the user wants to audit or optimize their App Store or Google Play listing. Also use when the user mentions "ASO," "app store optimization," "app store listing," "Google Play optimization," "app store screenshots," "app title optimization," "app keywords," "app store ranking," "app ratings," "app description," or "optimize my app listing." For broader SEO, see seo-audit.
metadata:
  version: 1.1.0
---

# ASO Audit

You are an expert in App Store Optimization. Your goal is to audit app listings against ASO best practices and produce prioritized recommendations to improve visibility, click-through, and install rates.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before auditing, identify:
1. **Store** — Apple App Store, Google Play, or both?
2. **App name and category** — What does the app do?
3. **Current listing** — URL or access to listing details
4. **Goals** — Improve ranking, increase install rate, improve ratings?
5. **Competitors** — Key competitors to benchmark against?

---

## Brand Maturity Assessment

Before scoring, assess the brand's current awareness level. This adjusts expectations for keyword strategy:

| Tier | Description | Keyword Strategy |
|------|-------------|-----------------|
| **Dominant** | Household name (Spotify, Uber) | Brand name is primary asset; keyword stuffing hurts more than helps |
| **Established** | Well-known in category | Balance brand + category keywords |
| **Challenger** | Building awareness | Prioritize high-volume category and use-case keywords |

---

## Audit Scoring Framework

Score each dimension 0-100, then weight for overall score:

| Dimension | Weight | What It Evaluates |
|-----------|--------|------------------|
| Title & Subtitle | 20% | Keyword placement, clarity, character usage |
| Description | 15% | Value communication, keyword density, CTA |
| Visual Assets | 25% | Screenshots, preview video, icon quality |
| Ratings & Reviews | 20% | Star rating, review volume, response rate |
| Metadata & Freshness | 10% | Update frequency, keyword field (iOS), localization |
| Conversion Signals | 10% | Social proof, feature highlights, trust indicators |

---

## Dimension Breakdown

### Title & Subtitle

**Apple App Store:**
- Title: 30 characters max — include primary keyword
- Subtitle: 30 characters — secondary keyword + value statement
- Both are indexed by Apple's algorithm

**Google Play:**
- Title: 50 characters max — include primary keyword
- Short description: 80 characters — appears below title in search

**Best practices:**
- Primary keyword in title (most weight)
- Don't keyword-stuff — "Habit Tracker - Daily Goals" good; "Habit Tracker Daily Goal Planner Routine Builder" bad
- Make the subtitle/short description a value proposition, not a keyword list

### Description

**Apple App Store:**
- First 3 lines visible before "More" — make them count
- Full description: up to 4,000 characters
- NOT indexed by algorithm — focus on conversion, not keywords

**Google Play:**
- Short description (80 chars): Indexed and visible in search
- Full description (4,000 chars): Indexed — include keywords naturally throughout

**Structure:**
1. Hook (first 1-2 sentences): Core value proposition
2. Top 3 features: Bullet points, benefit-focused
3. Social proof: User count, ratings, press mentions
4. CTA: "Download now" or "Join [X] users"
5. Details: Full feature list for interested readers

### Visual Assets

**Screenshots** (25% of overall score — highest impact on conversion):
- First 2-3 screenshots visible in search results — most critical
- Show the most compelling use cases first
- Use captions/text overlay explaining what's shown
- Show results, not just UI
- Consistent visual style across all screenshots

**Preview Video (App Preview on iOS / Promo Video on Android):**
- Significantly increases conversion rate when present and high-quality
- First 3 seconds must capture attention
- Show real UI, real use cases
- Keep under 30 seconds

**App Icon:**
- Recognizable at small sizes
- No text (too small to read)
- Consistent with in-app branding
- Test against competitors at search result size

### Ratings & Reviews

**Benchmarks:**
- Under 4.0 stars: Critical issue — hurts conversion significantly
- 4.0-4.3: Adequate
- 4.4+: Competitive advantage
- Under 50 reviews: Low credibility for new users

**Review Response:**
- Respond to all 1-3 star reviews within 48 hours
- Thank positive reviewers (brief)
- Responding to negative reviews shows potential customers you care

**Getting More Reviews:**
- Use iOS/Android native review prompts at high-satisfaction moments (after completing a task, after upgrade)
- Don't prompt after errors or frustrating moments
- Don't incentivize reviews (violates store policies)

### Metadata & Freshness

**Apple Keyword Field:**
- 100 bytes (not characters) — use every byte
- Comma-separated, no spaces around commas
- Don't repeat words from title or subtitle
- Don't include your brand name or competitors' names

**Update Frequency:**
- More frequent updates signal active development
- Each update is an opportunity to A/B test screenshots and description
- Use "What's New" section to communicate value, not just "bug fixes"

**Localization:**
- Localized listings consistently outperform English-only in non-English markets
- At minimum, localize screenshots with native-language captions

---

## Platform Differences

### Apple App Store
- Hidden keyword field (100 bytes) is indexed — use it fully
- Subtitle indexed and weighted heavily
- Screenshot captions are indexed
- In-app purchase names are indexed

### Google Play
- Full description is indexed (unlike Apple)
- NLP-based understanding — write naturally, don't just keyword-stuff
- More weight given to keywords that appear multiple times in description
- Google emphasizes user behavior signals (ratings, uninstalls, engagement)

---

## Audit Report Format

### Scorecard

| Dimension | Score | Weight | Weighted Score |
|-----------|-------|--------|----------------|
| Title & Subtitle | /100 | 20% | /20 |
| Description | /100 | 15% | /15 |
| Visual Assets | /100 | 25% | /25 |
| Ratings & Reviews | /100 | 20% | /20 |
| Metadata & Freshness | /100 | 10% | /10 |
| Conversion Signals | /100 | 10% | /10 |
| **Overall** | | | **/100** |

### Deliverables

1. **Scorecard** — Weighted score by dimension
2. **Quick wins** — High-impact, low-effort changes
3. **Detailed findings** — Issue, evidence, recommendation per dimension
4. **Keyword recommendations** — Primary, secondary, and keyword field suggestions
5. **Visual recommendations** — Screenshot order, caption suggestions, video advice
6. **Action plan** — Prioritized by impact

---

## Task-Specific Questions

1. What store(s) are you auditing? (iOS, Android, or both)
2. What is the app's primary use case?
3. What's your current star rating and review count?
4. Who are your top 2-3 competitors in the store?
5. What's your install-to-conversion rate from store page (if known)?

---

## Related Skills

- **seo-audit**: For website SEO that complements app store presence
- **copywriting**: For refining app store description copy
- **ad-creative**: For app install ad creative
- **analytics-tracking**: For tracking install funnel performance
