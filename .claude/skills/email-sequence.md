---
name: email-sequence
description: When the user wants to create automated email sequences, nurture campaigns, onboarding emails, re-engagement series, or lifecycle email programs. Also use when the user mentions "email sequence," "drip campaign," "nurture sequence," "welcome series," "onboarding emails," "re-engagement email," "lifecycle emails," "email automation," or "email flow." For cold outbound emails, see cold-email. For individual email copywriting, see copywriting.
metadata:
  version: 1.1.0
---

# Email Sequence Design

You are an expert in creating automated email sequences that nurture relationships and drive conversions.

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before designing a sequence, understand:
1. **Sequence Goal** - What should subscribers do by the end?
2. **Audience** - Who is receiving these emails? What do they know/need?
3. **Trigger** - What causes someone to enter this sequence?
4. **Current State** - Do you have existing sequences? What's working?

---

## Core Principles

### 1. One Email, One Purpose
Each email has one primary purpose and a single main call-to-action. Multiple asks dilute focus.

### 2. Value Before Ask
Deliver value before requesting action. Build trust through helpfulness first.

### 3. Quality Over Frequency
An irrelevant email hurts more than no email. Every email should earn its place.

### 4. Respect the Journey
Match email content to where the subscriber is in their journey, not where you want them to be.

---

## Sequence Types

### Welcome Sequence (5-7 emails)
**Purpose**: Orient new subscribers, deliver promised value, establish relationship

**Typical structure:**
1. Immediate: Deliver lead magnet/confirmation + what to expect
2. Day 1: Most important thing they should know
3. Day 2-3: Your origin story or key insight
4. Day 4-5: Social proof / how others use this
5. Day 6-7: First soft CTA (trial, demo, resource)

### Onboarding Sequence (5-7 emails)
**Purpose**: Help new users reach activation and first value

**Typical structure:**
1. Immediate: Welcome + first action to take
2. Day 1: Key feature walkthrough
3. Day 2-3: Tips for getting more value
4. Day 4-5: Social proof (how others use it)
5. Day 6-7: Team/collaboration features
6. Day 10-14: Check-in / offer help

### Lead Nurture Sequence (6-8 emails)
**Purpose**: Move prospects from awareness to consideration to decision

**Typical structure:**
1. Deliver content promise + set expectations
2. Address core problem in depth
3. Introduce solution approach (not just your product)
4. Case study or social proof
5. Common objections addressed
6. Product-specific value with CTA
7-8. Follow-up and alternatives

### Re-engagement Sequence (3-4 emails)
**Purpose**: Win back inactive subscribers

**Typical structure:**
1. "We miss you" + what's new
2. Valuable content relevant to why they subscribed
3. Soft CTA + explicit opt-out option
4. Final "should we part ways?" email

---

## Timing Patterns

### General Guidelines
- Welcome emails: Send immediately
- Early onboarding: 1-2 days apart
- Nurture sequences: 2-4 days apart
- Long-term campaigns: Weekly or bi-weekly

### B2B vs B2C Timing
- **B2B**: Respect working hours, avoid weekends for time-sensitive emails
- **B2C**: More flexibility, test for your audience

### Testing Timing
- Run A/B tests on send day and time
- Look at reply rates and click rates, not just opens
- Consider time zones for global audiences

---

## Subject Line Best Practices

### Principles
- Specific beats clever
- Benefit-driven when possible
- 40-60 characters (mobile preview)

### Effective Patterns
- **Question**: "Still struggling with [problem]?"
- **How-to**: "How [customer] achieved [result]"
- **Number**: "3 things to do in your first week"
- **Story tease**: "The mistake most [audience] make"
- **Direct**: "Your [product] setup checklist"

### A/B Test Ideas
- Question vs. statement
- Specific vs. curiosity
- Short (3-5 words) vs. longer (8-10 words)

---

## Email Copy Structure

### Hook (Opening Line)
The first sentence determines if they read the rest.
- Reference something timely or relevant
- Ask a question they're wondering
- Make a bold, relevant claim
- Tell the beginning of a story

### Body
- Short paragraphs (2-3 sentences)
- One idea per paragraph
- Mobile-first: assume narrow screen
- Plain text often outperforms HTML for relationship-building emails

### CTA
- One primary action
- Describe the outcome, not just the action
- Repeat CTA at bottom for long emails
- Make it easy to find

### Closing
- Warm but professional
- Set expectation for next email (in sequences)
- Personal signature for relationship-building emails

---

## Measurement

### Key Metrics by Sequence Type

| Sequence | Primary Metric | Secondary |
|----------|---------------|-----------|
| Welcome | Click rate, Reply rate | Unsubscribe rate |
| Onboarding | Activation rate | Email engagement |
| Nurture | Conversion rate | Open/click rate |
| Re-engagement | Re-engagement rate | Unsubscribe rate |

### Benchmarks (general)
- Open rate: 20-30% (varies widely by industry and list quality)
- Click rate: 2-5%
- Unsubscribe rate: <0.5% per email (concern if higher)

### Optimization Process
1. Identify lowest-performing email in sequence
2. Hypothesize why (subject line, content, CTA, timing)
3. Test one change
4. Measure and iterate

---

## Platform Integration

Common email platforms for automation:
- **Mailchimp**: Good for getting started, basic automation
- **Customer.io**: Strong for behavior-triggered sequences
- **Klaviyo**: Strong for e-commerce
- **ConvertKit**: Good for creators and content businesses
- **HubSpot**: Strong for B2B with CRM integration
- **SendGrid**: Good for transactional + marketing mix

---

## Output Format

When creating an email sequence, provide:

1. **Sequence overview**: Goal, audience, entry trigger, total emails
2. **Timing map**: Visual or table showing email timing
3. **Each email**: Subject line, body copy, CTA
4. **Notes**: Rationale for key choices, A/B test recommendations

---

## Task-Specific Questions

1. What triggers entry into this sequence?
2. What action do you want subscribers to take by the end?
3. What does your audience know/believe when they enter?
4. What objections do you need to overcome?
5. What platform are you using for automation?
6. How long should the sequence run?

---

## Related Skills

- **cold-email**: For outbound B2B prospecting emails
- **copywriting**: For individual email copywriting
- **onboarding-cro**: For in-app onboarding that complements email
- **lead-magnets**: For the lead magnet that feeds the sequence
