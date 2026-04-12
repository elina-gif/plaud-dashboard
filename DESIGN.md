# DESIGN.md — Plaud Dashboard

A plain-text design system document for AI agents. Reference this file when building or modifying UI in this project to maintain visual consistency.

---

## 1. Visual Theme & Atmosphere

**Style:** Modern, professional, data-driven dashboard with a warm-neutral base and vibrant accent trio.

The Plaud Dashboard communicates trust and clarity. Its warm off-white canvas keeps cognitive load low while the three-color accent system (purple, green, cyan) injects energy into KPIs, charts, and call-to-action elements. Everything is precise but never cold — rounded corners, subtle shadows, and warm grays give the interface approachability.

**Personality keywords:** Analytical · Warm · Precise · Confident · Clean

---

## 2. Color Palette & Roles

### Brand Accent Trio
| Name | Hex | Role |
|---|---|---|
| Victory Purple | `#8F53ED` | Primary accent — CTAs, active states, primary charts, focus rings |
| Amplify Green | `#21EF6A` | Success, positive sentiment, engaged metrics, highlight glow |
| Clarity Blue | `#00D0FF` | Secondary data series, informational states, EU regional color |

### Brand Gradient
```
linear-gradient(135deg, #21EF6A, #00D0FF, #8F53ED)
```
Used on logo, hero CTAs (`GradButton`), and brand moments only. Never use it for body text or dense UI chrome.

### Neutral Base (Light Mode — Default)
| Name | Hex | Role |
|---|---|---|
| Background | `#FFFFFF` | Page background |
| Card Surface | `#F2EFEB` | Primary card background, warm off-white |
| Nested Surface | `#FFFFFF` | Inner cards within cards |
| Border | `#E0DBD5` | All 1px dividers and card outlines |
| Primary Text | `#413D3B` | Body copy, labels, most text |
| Muted Text | `#8A837E` | Secondary labels, placeholders, captions |
| Foreground | `#171717` | High-contrast headings |

### Dark Mode
| Name | Hex | Role |
|---|---|---|
| Background | `#0a0a0a` | Page background |
| Foreground | `#ededed` | Primary text |

### Semantic / Status Colors
| Semantic Role | Hex | Usage |
|---|---|---|
| Positive / Engaged | `#21EF6A` | Sentiment scores, growth indicators |
| Negative / Cold | `#f43f5e` | Risk flags, negative sentiment, declining metrics |
| Warning / Medium | `#f59e0b` | Neutral-warm states, caution indicators |
| Neutral / Default | `#8F53ED` | Default category, baseline data |

### Data Visualization — Regional Palette
| Region | Hex |
|---|---|
| US | `#8F53ED` |
| EU | `#00D0FF` |
| JP | `#21EF6A` |
| APAC | `#413D3B` |

### Opacity Conventions
- Background tints: append `18` to hex (≈10% opacity) — e.g. `#8F53ED18`
- Borders on disabled states: 33–55% opacity
- Glow shadows: accent color at 22% opacity — e.g. `rgba(33, 239, 106, 0.22)`

---

## 3. Typography Rules

### Fonts
| Role | Family |
|---|---|
| Primary (sans-serif) | Geist Sans → `-apple-system` → `Arial` → `sans-serif` |
| Monospace | Geist Mono |

### Type Scale
| Role | Size | Weight | Notes |
|---|---|---|---|
| Large metric / KPI | 24px | 800 | Numbers only — e.g. "94.2%" |
| Section heading | 18px | 700 | Card titles |
| Sub-heading | 15–16px | 600 | Tab labels, column headers |
| Body / default | 12px | 500 | General content |
| Section label | 13px | 700 | Uppercase, `letterSpacing: 0.05em` |
| Secondary label | 11px | 500 | Chart legends, helper text |
| Micro label | 9–10px | 500 | Dense data tables, timestamps |

### Label Conventions
- Section/category labels: **UPPERCASE** + `letter-spacing: 0.05em`
- Inline code/values: Geist Mono, 11–12px
- Clickable text: dashed underline on hover, no color change

---

## 4. Component Styles

### Card
The primary layout container.
```
background: #F2EFEB
border: 1px solid #E0DBD5
border-radius: 14px
padding: 20px
```
- Nested content areas use `background: #FFFFFF` with 12px border-radius
- No box-shadow by default; shadow only on highlighted/featured cards

### MetricTile
KPI display block — numbers with labels.
```
border-radius: 12px
padding: 16px 18px
font-size (value): 24px / font-weight: 800
font-size (label): 11px / font-weight: 500 / color: #8A837E / UPPERCASE
```
**Highlighted MetricTile** (accent glow variant):
```
box-shadow: 0 2px 12px rgba(ACCENT_COLOR, 0.22)
border: 1px solid ACCENT_COLOR + "40"
```

### GradButton (Primary CTA)
```
background: linear-gradient(135deg, #21EF6A, #00D0FF, #8F53ED)
color: #FFFFFF
border-radius: 8px
padding: 8px 18px
font-size: 13px / font-weight: 600
border: none
cursor: pointer
```
Hover: slight brightness increase via `filter: brightness(1.05)`.

### StatusBadge
Inline status indicator.
```
border-radius: 4px
padding: 2px 6px
font-size: 11px / font-weight: 600
background: SEMANTIC_COLOR + "18"
border: 1px solid SEMANTIC_COLOR + "40"
color: SEMANTIC_COLOR
```

### Input / Editable Field
```
border: 1px solid #E0DBD5
border-radius: 4px
padding: 4px 6px
font-size: 12px
background: #FFFFFF
width: 48px (for inline numeric inputs)
```
Focus state: `border-color: #8F53ED`, no outline.

### Progress Bar
```
height: 6px
border-radius: 3px
background (track): #E0DBD5
background (fill): accent color (contextual)
```

### Navigation / Tabs
```
display: flex
gap: 6px
padding: 4px (container)
border-bottom: 1px solid #E0DBD5
```
- Active tab: `color: #413D3B`, `font-weight: 600`, bottom border in `#8F53ED`
- Inactive tab: `color: #8A837E`, `font-weight: 500`
- Transition: `0.15s ease`

### Data Table
- Header row: `font-size: 11px`, `font-weight: 700`, UPPERCASE, `color: #8A837E`
- Body rows: `font-size: 12px`, `color: #413D3B`
- Alternate row shading: even rows at `#F2EFEB` with `opacity: 0.5`
- Row divider: `1px solid #E0DBD5` at `opacity: 0.5`

### Drag-and-Drop Zone
```
border: 1.5px dashed #E0DBD5
border-radius: 10px
background: #F2EFEB
```
Active/hover: `border-color: #8F53ED`, `background: #8F53ED18`

---

## 5. Layout Principles

### Spacing Scale
`4 · 6 · 8 · 10 · 12 · 14 · 16 · 20 · 24 · 28px`

- **Intra-component gap**: 6–8px
- **Section gap**: 16px
- **Card padding**: 20px
- **Page section padding**: 28px
- **Max content width**: 1200px

### Grid
- **Primary layout**: CSS Grid, `gap: 16px`
- **KPI row**: 4-column grid at large breakpoints
- **Side-by-side sections**: 2-column grid with equal or 60/40 split
- **Nested content**: flexbox with `gap: 8–12px`

### Whitespace Philosophy
- Let content breathe — never jam elements together
- Card padding (20px) is sacred: do not reduce below 16px
- Group related items tightly (6–8px gap); separate logical sections with 16px+

---

## 6. Depth & Elevation

Surface hierarchy (lowest → highest):
1. **Page background** — `#FFFFFF` (no elevation)
2. **Card** — `#F2EFEB`, `border: 1px solid #E0DBD5` (subtle lift via color contrast)
3. **Nested card / inner panel** — `#FFFFFF` within a `#F2EFEB` card
4. **Highlighted MetricTile** — accent glow shadow: `0 2px 12px rgba(accent, 0.22)`
5. **Modal / overlay** — `#FFFFFF`, `border-radius: 16px`, `box-shadow: 0 8px 32px rgba(0,0,0,0.12)`

**Shadow scale:**
```
Subtle:  0 1px 4px rgba(0,0,0,0.06)
Default: 0 2px 12px rgba(accent, 0.22)
Raised:  0 8px 32px rgba(0,0,0,0.12)
```

Borders (`1px solid #E0DBD5`) do the primary work of separating surfaces — reserve shadows for interactive/highlighted states only.

---

## 7. Do's and Don'ts

### Do
- Use `#F2EFEB` as the card background (warm off-white, not pure gray)
- Apply the 3-color accent trio purposefully: purple for interaction, green for success, cyan for information
- Use UPPERCASE + letter-spacing for all label/category text
- Keep border-radius consistent: 4px (micro), 8px (inputs/buttons), 12–14px (cards)
- Tint accent colors for backgrounds: append `18` to hex
- Use Geist Sans for all body text; Geist Mono only for numbers/code
- Prefer `font-weight: 800` for large metric numbers to make them scan instantly
- Add glow shadows only on the single most important KPI tile on a given view

### Don't
- Don't use the brand gradient on body text, borders, or dense UI chrome
- Don't use pure black (`#000000`) — use `#413D3B` (warm dark) or `#171717` for max contrast
- Don't stack more than 2 levels of card nesting
- Don't mix border-radius values arbitrarily — stick to the 4/8/12/14 scale
- Don't add box-shadow to every card — borders carry elevation in this design
- Don't use more than 3 accent colors in a single chart or component
- Don't apply uppercase styling to body copy or paragraph text
- Don't use placeholder gray (`#999`) — use `#8A837E` (warm muted)

---

## 8. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| < 768px (mobile) | Single-column layout; cards stack vertically; tab nav scrolls horizontally |
| 768–1024px (tablet) | 2-column primary grid; KPI row becomes 2×2 |
| > 1024px (desktop) | Full 4-column KPI grid; side-by-side sections at 60/40 or 50/50 |

### Touch Targets
- Minimum tap target: 44×44px
- Buttons: always `padding: 8px 18px` minimum
- Tab items: minimum 36px height

### Collapse Strategy
- Navigation tabs: `overflow-x: auto`, hide scrollbar, allow horizontal scroll
- Data tables: on mobile, reduce font to 11px and allow horizontal scroll within card
- Charts: use `ResponsiveContainer` from Recharts — charts are always 100% width

---

## 9. Agent Prompt Guide

Quick reference for AI agents building UI in this codebase:

**Start every new component with:**
> "Use the Plaud Dashboard design system: warm off-white card (#F2EFEB), 14px border-radius, 20px padding, 1px solid #E0DBD5 border. Accent colors: purple #8F53ED (interaction), green #21EF6A (success), cyan #00D0FF (info). Font: Geist Sans. Body text: #413D3B."

**For a KPI/metric tile:**
> "MetricTile: 12px border-radius, value in 24px/800 weight, label in 11px/500/uppercase/#8A837E. Highlighted variant adds box-shadow: 0 2px 12px rgba(accent, 0.22)."

**For a data table:**
> "Headers: 11px/700/uppercase/#8A837E. Rows: 12px/500/#413D3B. Alternate rows at #F2EFEB 50% opacity. Dividers: 1px solid #E0DBD5 50% opacity."

**For a CTA button:**
> "GradButton: gradient background linear-gradient(135deg, #21EF6A, #00D0FF, #8F53ED), white text, 8px border-radius, 8px 18px padding, 13px/600 weight."

**For status/sentiment:**
> "Positive: #21EF6A · Negative: #f43f5e · Warning: #f59e0b · Neutral: #8F53ED. Always use tinted background (color+'18') + tinted border (color+'40') + full-opacity text for StatusBadge."

**For charts:**
> "Recharts with ResponsiveContainer, 240–280px height. Primary series: #8F53ED. Secondary: #00D0FF. Tertiary: #21EF6A. Chart background matches card (#F2EFEB). Tooltip: white bg, 12px border-radius, 1px solid #E0DBD5."
