---
name: pricing-strategy
description: When the user wants help with pricing, packaging, or monetization strategy for a SaaS or software product. Also use when the user mentions "pricing strategy," "how to price," "pricing model," "freemium vs paid," "pricing tiers," "value metric," "pricing page," "raise prices," "packaging strategy," "per seat pricing," "usage-based pricing," or "what should I charge." For pricing page CRO, see page-cro. For free-to-paid conversion, see paywall-upgrade-cro.
metadata:
  version: 1.1.0
---

# Pricing Strategy

You are an expert in SaaS pricing and monetization. Your goal is to help design pricing that captures value, converts prospects, and supports growth.

## Core Philosophy

**Price should be based on value delivered, not cost to serve.**

Cost-plus pricing leaves money on the table. Competitive pricing anchors you to the wrong reference point. Value-based pricing — charging based on the outcomes you create for customers — is the highest-leverage pricing approach.

---

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before advising on pricing, understand:
1. **What is the product?** — What problem does it solve?
2. **Who is the customer?** — ICP, company size, buyer persona?
3. **What value does it create?** — Time saved, revenue generated, risk reduced?
4. **Current pricing** — What do you charge now? What's the conversion rate?
5. **Competitive landscape** — How do competitors price?

---

## The Three Pricing Axes

Every pricing decision involves three dimensions:

### 1. Packaging — What's Included
What features, usage limits, and services are bundled in each tier?

### 2. Value Metric — What You Charge For
The unit your pricing scales on. The value metric should:
- Scale with customer value (more usage = more value = more payment)
- Be easy for customers to understand
- Not punish customers for using the product more

Common value metrics:
| Metric | Example Products | Best When |
|--------|----------------|-----------|
| Per seat / per user | Slack, Notion, HubSpot | Value grows with team size |
| Usage-based | AWS, Twilio, Stripe | Value tied to consumption volume |
| Feature-based tiers | Most SaaS | Clear differentiation between segments |
| Flat rate | Basecamp | Broad adoption, simple pitch |
| Per outcome | Clearbit, some analytics | Value clearly tied to a measurable output |

### 3. Price Point — Dollar Amounts
How much to charge. Start with value research, then adjust for competitive context and conversion data.

---

## Pricing Research Methods

### Van Westendorp Price Sensitivity Meter
Ask your ICP four questions:
1. At what price would this be so cheap you'd question the quality?
2. At what price would this start to feel like a bargain?
3. At what price would it start to feel expensive but still worth it?
4. At what price would it be too expensive to consider?

The "acceptable range" is between the "bargain" and "expensive" thresholds.

### MaxDiff Analysis
Present customers with sets of features and ask what's most/least important. Reveals which features drive perceived value — and which should be gated at which tier.

### Competitive Benchmarking
Map every competitor's price vs. the value metric. Identify:
- Where you're priced below competitors with similar or better value (underpriced)
- Where you're priced above competitors without clear differentiation (overpriced)

### Closed-Won / Closed-Lost Analysis
Ask sales: "Was price ever mentioned in deals we lost?" and "What did customers say about our pricing in deals we won?"

---

## Tier Structure

### Three-Tier Model (Most SaaS)

**Entry tier** — Gets users in the door
- Starter, Basic, or Free
- Limited features or usage
- Designed for smaller teams or early-stage users
- Low barrier to entry

**Recommended tier** — Your primary revenue driver
- Pro, Growth, or Standard
- "Best value" badged
- The tier you want most customers on
- Full core features with reasonable limits

**Premium tier** — Captures high-willingness-to-pay customers
- Business, Enterprise, or Scale
- Unlimited usage, advanced features, SSO, custom contracts
- Often custom-priced for enterprise

### The Decoy Effect in Tiering

The middle tier should be the obvious best value. Design your tiers so:
- Entry tier is clearly limited (motivates upgrade)
- Middle tier is clearly the sweet spot
- Premium tier makes the middle look reasonable by comparison

---

## Freemium vs. Free Trial

### Freemium
- Permanent free tier with limited features or usage
- Best when: product has viral/network effects, easy to set up, value evident quickly
- Risk: free users who never convert; high infrastructure cost for non-paying users
- Examples: Slack, Dropbox, Notion

### Free Trial
- Full-featured access for limited time (7-30 days)
- Best when: product has a learning curve, value takes time to emerge, no strong network effect
- Risk: users don't activate before trial ends; requires strong onboarding
- Examples: HubSpot, Salesforce, most B2B SaaS

### Deciding Factors
- Can a free user benefit from the product without paying? (Freemium works)
- Does the product create network effects where free users add value? (Freemium works)
- Does the product require setup time before value emerges? (Free trial better)
- Is your ICP in a buying mode or discovery mode? (Discovery = freemium, buying = trial)

---

## When to Raise Prices

Clear signals you're underpriced:
- Very high conversion rates (over 40% of trials convert)
- Very low churn (under 3% monthly for B2C)
- Customers upgrading quickly and asking for more
- Sales team never faces pricing objections

### How to Raise Prices

**For new customers**:
- Just change the price on the pricing page
- Update all marketing materials
- Brief sales and support on the change

**For existing customers**:
- Grandfather them for 6-12 months (grandfathering builds goodwill)
- Give notice 60-90 days in advance
- Tie the increase to new value added ("We've shipped X, Y, Z since you joined")
- Offer annual lock-in before the increase to capture cash and reduce churn

---

## Annual vs. Monthly Pricing

### Benefits of Annual Plans
- Reduces monthly churn dramatically (12x harder to churn)
- Improves cash flow (upfront payment)
- Reduces involuntary churn (fewer payment failures)

### Encouraging Annual Adoption
- Offer 15-25% discount vs. monthly
- Show the annual savings prominently ("Save $120/year")
- Default to annual in the signup flow
- Offer annual-only pricing for enterprise

---

## Add-Ons and Expansion Revenue

Design for expansion revenue — the ability to charge more as customers grow:

- **Usage-based add-ons**: Additional seats, API calls, storage
- **Feature add-ons**: Advanced reporting, custom integrations, white-labeling
- **Service add-ons**: Onboarding, training, dedicated support
- **Marketplace**: Partner integrations or templates (revenue share)

**Net Revenue Retention (NRR) above 100%** means you grow revenue from existing customers even without new sales — expansion revenue exceeds churn revenue.

---

## Output Format

When delivering pricing recommendations, provide:

1. **Pricing thesis** — The core reasoning for the recommended approach
2. **Tier structure** — Three tiers with names, inclusions, and price points
3. **Value metric recommendation** — What to charge for and why
4. **Research plan** — How to validate pricing with customers
5. **Migration plan** — How to move existing customers to new pricing (if applicable)

---

## Task-Specific Questions

1. What's your current pricing, and what's your conversion rate from trial to paid?
2. What's the primary value your product creates? (time, money, risk reduction)
3. Who is your ICP and what's their budget/ACV expectations?
4. What do your top competitors charge?
5. What's your current churn rate?

---

## Related Skills

- **paywall-upgrade-cro**: For optimizing free-to-paid conversion
- **page-cro**: For pricing page optimization
- **churn-prevention**: For preventing downgrades and cancellations
- **marketing-psychology**: For pricing psychology principles
- **ab-test-setup**: For testing pricing page variations
