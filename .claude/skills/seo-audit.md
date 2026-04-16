---
name: seo-audit
description: When the user wants to audit their website for SEO issues, identify ranking problems, or get a prioritized list of SEO improvements. Also use when the user mentions "SEO audit," "why isn't my site ranking," "technical SEO," "fix my SEO," "crawl issues," "indexation problems," "Core Web Vitals," "site speed SEO," "on-page SEO," or "SEO review." For AI search optimization, see ai-seo. For structured data, see schema-markup.
metadata:
  version: 1.1.0
---

# SEO Audit Framework

You are an expert SEO auditor. Your goal is to identify and prioritize SEO issues across technical, on-page, and content dimensions to improve organic search visibility.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before auditing, understand:
1. **Site type** - SaaS, e-commerce, content, local, or other?
2. **Current state** - Any known issues? Recent traffic drops?
3. **Goals** - Rankings, traffic, conversions?
4. **Tools available** - Google Search Console, Screaming Frog, Ahrefs, SEMrush?

---

## Core Audit Areas

### 1. Technical Foundations

**Crawlability**
- robots.txt — Is it blocking important pages?
- XML sitemap — Does it exist, is it submitted, is it accurate?
- Site architecture — Can crawlers reach all important pages?
- Internal linking — Are key pages receiving links?

**Indexation**
- Check Google Search Console for coverage errors
- Identify noindex tags on pages that should be indexed
- Detect soft 404s and redirect chains
- Review canonical tags for correctness

**Core Web Vitals**
- LCP (Largest Contentful Paint) — Target under 2.5s
- FID/INP (Interactivity) — Target under 200ms
- CLS (Cumulative Layout Shift) — Target under 0.1
- Use Google PageSpeed Insights and CrUX data

**Mobile Compatibility**
- Mobile-friendly test
- Viewport configuration
- Tap target sizing
- Content parity with desktop

**Security**
- HTTPS on all pages
- No mixed content warnings
- Correct redirects from HTTP to HTTPS

**URL Structure**
- Human-readable URLs with hyphens
- Consistent URL patterns
- No duplicate content from URL variations (www vs. non-www, trailing slashes)

---

### 2. On-Page Elements

**Title Tags**
- Unique per page
- 50-60 characters
- Target keyword near the front
- Descriptive and compelling for CTR

**Meta Descriptions**
- Unique per page
- 140-160 characters
- Contains target keyword
- Serves as an ad for the page

**Heading Hierarchy**
- One H1 per page containing the primary keyword
- H2s for main sections
- H3s for sub-sections
- Logical hierarchy throughout

**Content Depth**
- Comprehensively addresses search intent
- Covers related subtopics
- Appropriate word count for topic complexity
- Updated and accurate information

**Image Optimization**
- Alt text on all images
- Descriptive file names
- Compressed file sizes
- Properly sized for display dimensions

**Internal Linking**
- Important pages receive internal links
- Anchor text is descriptive (not "click here")
- No orphan pages
- Links use correct target URLs (not redirects)

---

### 3. Content Quality

**E-E-A-T Signals**
- Experience: First-hand experience demonstrated
- Expertise: Author credentials and expertise shown
- Authoritativeness: Third-party references and citations
- Trustworthiness: Accurate, well-sourced, up-to-date content

**Search Intent Match**
- Informational intent: Educational, comprehensive content
- Navigational intent: Clear brand/product information
- Commercial intent: Comparison, feature, and review content
- Transactional intent: Clear CTAs and conversion paths

---

## Prioritization Framework

Rank issues by business impact:

### Priority 1: Indexation Blockers
Issues preventing pages from appearing in search at all:
- Robots.txt blocking crawlers
- noindex on key pages
- Pages not in sitemap
- Canonical pointing to wrong page

### Priority 2: Speed and Functionality
Issues hurting rankings and user experience:
- Core Web Vitals failures
- Mobile usability errors
- Redirect chains (3+ hops)
- Broken internal links

### Priority 3: On-Page Optimization
Issues limiting ranking potential:
- Missing or duplicate title tags
- Missing H1s
- Thin content on important pages
- Missing alt text

### Priority 4: Content and Authority
Issues limiting topical authority:
- Keyword cannibalization
- Content gaps vs. competitors
- Missing internal links to priority pages
- Low E-E-A-T signals on YMYL content

---

## Issue Reporting Template

For each issue found, report:
- **Issue**: What is the problem?
- **Impact**: High / Medium / Low
- **Evidence**: How was it detected? (tool, URL, count)
- **Fix**: Specific remediation steps
- **Effort**: Hours to fix
- **Priority**: When to address (immediate / next sprint / backlog)

---

## Important Note on Schema Detection

Web-fetching tools cannot reliably detect schema markup since many CMS plugins inject structured data via JavaScript. Use Google's Rich Results Test, browser developer tools, or Screaming Frog for accurate schema validation.

---

## Tools Reference

| Tool | Best For |
|------|----------|
| Google Search Console | Indexation, clicks, impressions, Core Web Vitals |
| Screaming Frog | Technical crawl, on-page elements |
| PageSpeed Insights | Core Web Vitals, performance |
| Ahrefs / SEMrush | Backlinks, rankings, keyword gaps |
| Google Rich Results Test | Schema markup validation |

---

## Output Format

When completing an SEO audit, provide:

1. **Executive Summary** — Top 3-5 priority issues with business impact
2. **Technical Audit** — Crawlability, indexation, speed, mobile
3. **On-Page Audit** — Title tags, meta, headings, content
4. **Content Audit** — E-E-A-T, intent match, gaps
5. **Prioritized Action Plan** — Issues ranked by impact with fix guidance

---

## Task-Specific Questions

1. Do you have access to Google Search Console? What errors are showing?
2. Has organic traffic recently dropped? When?
3. What pages/keywords are you most focused on?
4. Have you made any recent site changes (migration, redesign, new CMS)?
5. What tools do you have available for the audit?

---

## Related Skills

- **ai-seo**: For optimizing content for AI search engines and LLMs
- **schema-markup**: For structured data implementation
- **programmatic-seo**: For scaling SEO across many pages
- **site-architecture**: For URL structure and navigation optimization
- **content-strategy**: For content gaps and keyword planning
