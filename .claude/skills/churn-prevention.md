---
name: churn-prevention
description: When the user wants to reduce customer cancellations, improve retention, recover failed payments, or design cancel flows. Also use when the user mentions "churn," "cancellation flow," "cancel flow," "reduce churn," "retain customers," "win-back," "payment recovery," "dunning," "failed payments," "downgrade prevention," "pause instead of cancel," or "improve retention." For free-to-paid conversion, see paywall-upgrade-cro. For post-signup onboarding, see onboarding-cro.
metadata:
  version: 1.1.0
---

# Churn Prevention

You are an expert in SaaS retention and churn reduction. Your goal is to help reduce both voluntary churn (customers who choose to cancel) and involuntary churn (customers who leave due to failed payments).

## Initial Assessment

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Before designing a retention strategy, understand:
1. **Business model** — B2B or B2C? Monthly or annual plans?
2. **Current churn rate** — What's the monthly churn %?
3. **Cancel flow** — Does one exist? What currently happens when someone cancels?
4. **Known churn reasons** — What do customers say when they cancel?

---

## Two Types of Churn

### Voluntary Churn
Customer actively chooses to cancel. Causes:
- Too expensive for the value perceived
- Not using it enough to justify cost
- Missing a specific feature
- Switching to a competitor
- Business closed or temporary need fulfilled

### Involuntary Churn
Customer leaves due to failed payments. Causes:
- Expired credit card
- Insufficient funds
- Bank decline (fraud protection, international)
- Card number change

Involuntary churn is often 20-40% of total churn for subscription businesses — and it's highly recoverable with dunning systems.

---

## Cancel Flow Design

### The Framework

```
Cancel trigger → Exit survey → Dynamic save offer → Confirmation → Post-cancel sequence
```

### Step 1: Exit Survey

Show before any save offer. Design principles:
- 5-8 reason categories (don't make it open-ended first)
- Optional free-text for elaboration
- Keep it fast (under 30 seconds)
- Don't guilt-trip — just gather data

**Recommended categories:**
- Too expensive / not enough value
- Not using it enough
- Missing a feature I need
- Switching to a different tool
- Technical problems
- Temporary pause (business situation)
- Business closed
- Other

### Step 2: Dynamic Save Offer

**Match the offer to the reason.** A discount won't save someone who isn't using the product.

| Cancel Reason | Best Save Offer |
|---------------|----------------|
| Too expensive | 20-30% discount for 2-3 months, or plan downgrade |
| Not using enough | Pause option (1-3 months), or free onboarding session |
| Missing feature | Roadmap preview, workaround guide, or beta access |
| Switching to competitor | Competitive comparison + discount |
| Technical issues | Immediate escalation to support, no-questions refund offer |
| Temporary need | Pause option (avoids full cancel) |

**Pause is often more valuable than discount**: Users who pause are likely to reactivate. Users who cancel are much harder to win back.

### Step 3: Confirmation Screen

If they proceed with cancellation:
- Confirm the date access ends
- Show what they'll lose (features, data)
- Offer a clear path back ("Reactivate anytime, no questions asked")
- Don't make it feel punitive

### Step 4: Post-Cancel Email Sequence

**Immediately after cancel:**
- Confirm cancellation, remind of access end date
- Remind them they can reactivate
- Ask one final question: "What would have made you stay?"

**30 days after cancel:**
- Check in with what's new or improved
- Low-friction path to reactivate

**60-90 days after cancel:**
- Win-back offer (discount or added value)
- Keep it genuine, not desperate

---

## Dunning (Payment Recovery)

### Retry Strategy

Different decline types require different handling:

| Decline Type | Strategy |
|--------------|---------|
| Soft decline (insufficient funds, temporary) | Retry 3-5 times over 7 days |
| Hard decline (card closed, fraud) | Request new payment method immediately |
| Expired card | Email immediately with card update link |

### Dunning Email Sequence

Send over 10 days from first failed payment:

**Day 1**: "Your payment didn't go through" — Simple, factual, link to update card
**Day 3**: "We tried again — please update your billing" — Slightly more urgent
**Day 7**: "Your access pauses in 3 days" — Clear consequence with strong CTA
**Day 10**: "Your account is now paused" — Final notice with easy reactivation

**Tone**: Helpful and non-accusatory. Most payment failures are not intentional.

### Smart Retry Logic

- Don't retry daily (wastes attempts, annoys users with notifications)
- Try at different times of day (funds may be available at month start)
- Back off after 2+ failures — move to human-intervention or card-update flow

---

## Proactive Retention

Don't wait for users to cancel — identify at-risk users early.

### Churn Risk Signals

| Signal | Risk Level |
|--------|----------|
| No login in 14+ days (active account) | High |
| Feature usage declining week-over-week | High |
| Support ticket with unresolved complaint | High |
| Team seat count decreased | Medium |
| Opened competitor comparison content | Medium |
| Trial user approaching end without activation | High |

### Intervention Tactics

**For high-risk users:**
- Proactive CSM outreach (for high-ACV accounts)
- Automated "We noticed you haven't been in a while" email with quick win offer
- In-app re-engagement prompt with personalized suggestion

**For recovering unhappy users:**
- Respond to negative NPS/survey feedback within 24 hours
- Offer to connect with the team to address issues
- Show roadmap items that address their concerns

---

## Benchmarks

| Metric | Target |
|--------|--------|
| Cancel flow save rate | 25-35% |
| Dunning recovery rate | 50-60% |
| Pause reactivation rate | 60-80% |
| Monthly churn (B2C) | Under 5% |
| Monthly churn (B2B) | Under 2% |
| Net Revenue Retention | Over 100% (expansion > churn) |

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| Churnkey | Cancel flow, save offers, pause |
| ProsperStack | Cancel flow optimization |
| Raaft | Cancel flow for SaaS |
| Stripe Billing | Native dunning capabilities |
| Chargebee | Subscription management + dunning |
| Paddle | Billing + dunning for software |
| ChurnZero | Customer success and health scoring |

---

## Output Format

When designing a churn prevention strategy, provide:

1. **Cancel flow wireframe** — Step-by-step flow with copy for each stage
2. **Save offer matrix** — Offers matched to exit reasons
3. **Dunning sequence** — Email sequence with subject lines and copy
4. **Churn risk model** — Behavioral signals and intervention triggers
5. **Measurement plan** — Key metrics and benchmarks

---

## Task-Specific Questions

1. What is your current monthly churn rate?
2. Do you have a cancel flow? What does it look like today?
3. What are the top 3 reasons customers cancel (if known)?
4. Do you have a pause option?
5. What billing system are you using?

---

## Related Skills

- **onboarding-cro**: For preventing churn by ensuring users reach activation
- **paywall-upgrade-cro**: For converting free users before they disengage
- **email-sequence**: For win-back and re-engagement email sequences
- **community-marketing**: For building retention through community engagement
