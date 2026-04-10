# ImbueOps Vendor Intelligence Dashboard — Product Requirements Document

**Author:** Zi Wang
**Date:** April 9, 2026
**Status:** Draft v1
**Target delivery:** This week
**Target role:** Operations — Imbue

---

## 1. Problem Statement

At a ~35-person AI company that has raised $232M, vendor management is deceptively complex. Imbue operates a 10,000-GPU cluster (Dell), multiple cloud providers, dozens of SaaS subscriptions, outside legal counsel, accounting firms, insurance carriers, and specialized AI infrastructure vendors. Each relationship has its own contract terms, renewal dates, payment cadences, and internal owners.

The Ops team (currently one person, with this hire as the second) is responsible for:

- **Tracking every vendor relationship** across finance, legal, infrastructure, and productivity tooling
- **Catching renewal dates before they auto-renew** at unfavorable terms, or lapse and cause service disruptions
- **Managing spend** against budget, identifying cost optimization opportunities
- **Eliminating tooling overlap** as teams independently adopt tools that duplicate functionality
- **Supporting leadership decisions** with clean vendor data for budgeting, board reporting, and strategic planning

Today, this information lives across spreadsheets, email threads, Notion pages, Slack DMs, and individual team members' heads. There is no single source of truth for "what vendors do we have, what do they cost, when do contracts renew, and who owns the relationship?"

For a lean team scaling fast (shipping a new open-source tool every 1-2 weeks in 2026), the ops function cannot afford to be reactive. Missed renewals cost money. Overlapping tools waste budget. Unclear ownership creates gaps. The ops person needs a system that surfaces the right information at the right time, so they can focus on strategic work instead of chasing down contract PDFs.

## 2. Solution

**ImbueOps** is a vendor intelligence dashboard purpose-built for a lean, high-velocity AI startup's operations team. It combines vendor health scoring, renewal alerting, spend analytics, tooling overlap detection, and Claude-powered contract intelligence into a single view that gives the Ops lead (and leadership) a real-time picture of the company's vendor ecosystem.

The tool has three primary views:

- **Ops Pulse** (Landing Page) — A prioritized queue of the items that need attention this week: upcoming renewals, budget alerts, vendor issues, compliance deadlines. This is the Monday morning starting point.

- **Vendor Map** — A visual grid of all vendor relationships, organized by category and color-coded by health/urgency. Enables quick scanning of the entire vendor ecosystem.

- **Spend Command Center** — Budget vs. actual spend by category, burn rate trends, cost-per-employee benchmarks, and quarterly summaries suitable for board reporting.

Each vendor drills into a detail view with contract terms, spend history, renewal timeline, internal owner, notes, and Claude-powered analysis.

### 2.1 How This Maps to the Operations Job Description

Every feature maps directly to a responsibility in the Imbue Ops JD:

| JD Responsibility | ImbueOps Feature |
|---|---|
| "Manage contracts and relationships with Imbue's vendors" | Vendor Map + contract detail views + relationship health tracking |
| "Own company-wide tooling. Manage our tooling strategy (who we use, why, where are overlaps)" | Tooling Overlap Detector + category analysis |
| "Manage tooling contracts and payments" | Renewal calendar + payment tracking + auto-renewal alerts |
| "Create automation integrations, workflows and systems for company rhythm of business" | Ops Pulse automated prioritization + Slack alert integration |
| "Own our core finance operations... tracking bookkeeping, budgeting, quarterly reports" | Spend Command Center + budget vs. actual + quarterly export |
| "Manage our vendors and partners, tracking... accounts payable, invoices, and payments" | Payment status tracking + AP summary |
| "Auditing existing processes across finance, legal, tooling, and governance" | Vendor health scoring + overlap detection + audit trail |
| "Creating opportunities for improved workflows that can scale with Imbue's growth" | Claude-powered contract analysis + negotiation prep |
| "Support investor relations... verifying that financial data is clean and reliable" | Board-ready spend reports + clean data exports |
| "Comfortable navigating ambiguity... across multiple vendors in various domains" | Cross-domain vendor categorization (infra, legal, finance, productivity, security) |

## 3. Target User

**Primary:** Operations team member at Imbue (the role being hired for). Reports to Ops Lead (Michelle Simonek). Responsible for vendor management, tooling strategy, finance ops, and compliance workflows. Needs to manage 30-50+ vendor relationships across domains while supporting leadership decision-making.

**Secondary:** CEO (Kanjun Qiu) and leadership team, for board-level spend visibility and strategic tooling decisions.

## 4. Core Features

### 4.1 Ops Pulse (Landing Page)

The daily workflow starts here. This is the ops team's command center; the first screen you open every morning. It answers the question: "What needs my attention today, and what's coming this week?"

**Top-level summary strip:**

- **Active alerts count** — How many items need attention right now (badge: red for critical, amber for warning)
- **This week's renewals** — Count and total dollar value of contracts renewing in the next 7 days
- **Budget health** — A quick gauge showing overall spend vs. quarterly budget (on track / watch / over)
- **Compliance status** — Green/yellow/red indicator for upcoming deadlines (all clear / approaching / overdue)

**Priority action queue:**

Each pulse card includes:

- **Urgency indicator** — Red (act today), amber (act this week), blue (informational/upcoming)
- **Item type badge** (Renewal / Budget Alert / Vendor Issue / Compliance / Overlap / New Request)
- **Vendor name and category** — Linked to vendor detail
- **Why now** — The specific trigger: "Figma contract renews in 14 days, auto-renew is ON," "Cloud spend is 18% over Q2 budget," "Two teams using overlapping project management tools"
- **Impact estimate** — Dollar value at stake or risk level: "$9,600/yr auto-renews in 14 days," "Potential $6,000/yr savings from consolidation"
- **Recommended action** — Claude-generated suggestion: "Review Figma usage data before renewal; 3 seats unused last 90 days," "Schedule vendor review with engineering lead," "Consolidate to single tool and negotiate volume pricing"
- **Owner** — Who is responsible for this item (defaults to ops, can be reassigned)
- **Quick action buttons** — "Open Vendor," "Set Reminder," "Mark Resolved," "Snooze 7 Days," "Escalate"
- **Expandable detail** — Click to expand the card for full context: vendor health score, spend history sparkline, related compliance items, and a timeline of how this alert was generated

**Trigger categories:**

| Category | Example Triggers | Default Urgency |
|---|---|---|
| **Renewal Alert** | Contract renewing in 30/60/90 days, auto-renewal approaching, rate increase notification | Red at 14 days, amber at 30, blue at 60-90 |
| **Budget Variance** | Category spend >15% over budget, unexpected charges, invoice anomaly | Red if >25% over, amber if >15% |
| **Tooling Overlap** | Multiple tools serving same function, new tool request duplicates existing capability | Amber |
| **Vendor Issue** | Service degradation, support quality decline, contact/champion departure | Red if service-critical vendor, amber otherwise |
| **Compliance** | Insurance renewal due, SOC 2 cert expiring, BAA update needed | Red if <14 days, amber if <30 |
| **New Vendor** | Team requesting new tool, vendor outreach, trial expiring | Blue |

**Weekly digest panel (sidebar or collapsible section):**

- **Resolved this week** — Items completed, with who resolved them (builds a visible track record)
- **Upcoming next week** — Preview of what's coming so you can plan ahead
- **Savings captured** — Running total of money saved through renegotiations, consolidations, and cancelled unused tools (this is a great number to cite in your first 90 days)

**Slack alert preview strip:**

At the bottom of the Ops Pulse, a preview of what automated Slack notifications would look like for the current week's alerts. Shows mock Slack message blocks with Imbue branding, formatted exactly as they'd appear in a #ops-alerts channel. Demonstrates the integration concept without requiring a live workspace.

### 4.2 Vendor Map

A visual grid of all vendor relationships. Each tile represents one vendor with:

- **Color coding** by health/urgency (green = healthy, yellow = attention needed, orange = action required, red = critical)
- **Category grouping** (Infrastructure, Productivity, Finance, Legal, Security, HR, Design)
- **Spend indicator** — relative size or badge showing monthly/annual cost
- **Renewal countdown** — days until next renewal, highlighted when approaching
- **Owner badge** — who internally owns the relationship
- **Click to drill** into vendor detail

The map enables quick pattern recognition: which categories have the most spend, where renewals cluster, which areas have overlap.

### 4.3 Vendor Health Scoring

Each vendor gets a composite health score:

**Vendor Health Score (0-100)** — Weighted blend of relationship signals:

| Signal | Weight | What It Measures |
|---|---|---|
| Cost efficiency | 25% | Price vs. market benchmarks, cost trend over time |
| Utilization | 25% | Seats used vs. licensed, features adopted vs. available |
| Relationship quality | 15% | Support responsiveness, account manager engagement |
| Contract terms | 15% | Flexibility, auto-renewal risk, termination clauses |
| Strategic alignment | 20% | How critical is this vendor to Imbue's mission and growth |

Vendors are classified into four tiers:

| Tier | Score | Action |
|---|---|---|
| **Optimized** | >=80 | Maintain; consider multi-year for discount |
| **Healthy** | 60-79 | Monitor; review at next renewal |
| **Attention** | 40-59 | Proactive review needed; evaluate alternatives |
| **Critical** | <40 | Immediate action; renegotiate, replace, or escalate |

### 4.4 Spend Command Center

A financial analytics view designed for ops reporting and board preparation:

- **Total vendor spend** — Monthly and annual, with trend line
- **Category breakdown** — Stacked bar chart showing spend by domain (Infrastructure, Productivity, etc.)
- **Budget vs. actual** — Per-category tracking against quarterly budget
- **Cost per employee** — Key metric for a scaling company; tracks tooling cost efficiency as headcount grows
- **Top 10 vendors by spend** — Ranked list with percentage of total
- **Quarterly summary** — Exportable view formatted for board reporting or investor updates

### 4.5 Tooling Overlap Detector

An audit view that identifies redundant or overlapping tools:

- **Function matrix** — Maps each tool to the functions it serves (e.g., "project management," "video conferencing," "document collaboration")
- **Overlap flags** — Highlights where two or more tools serve the same function
- **Consolidation recommendations** — Claude-generated analysis of which tool to keep based on adoption, cost, and integration depth
- **Potential savings** — Estimated annual savings from consolidating overlapping tools

Example overlaps for a startup:

| Function | Tools | Recommendation |
|---|---|---|
| Video conferencing | Zoom + Google Meet | Consolidate to Google Meet (bundled with Workspace) |
| Project management | Notion + Linear | Evaluate; Notion for docs, Linear for eng tickets (complementary, not overlapping) |
| Cloud storage | Google Drive + Dropbox | Consolidate to Google Drive |

### 4.6 Claude-Powered Intelligence

The tool calls Claude's API to generate:

- **Contract summaries** — Upload or paste contract text; Claude extracts key terms (renewal date, auto-renewal, termination notice period, rate escalation clauses, SLA commitments)
- **Renewal prep briefs** — Given vendor context (spend history, utilization, market alternatives), Claude generates a negotiation prep document with talking points
- **Vendor comparison** — When evaluating alternatives, Claude generates a structured comparison based on the company's specific needs
- **Spend narratives** — For board reports, Claude generates plain-English summaries of spend trends and notable changes

**Implementation:** User provides their Anthropic API key in settings. All calls use `claude-sonnet-4-6` with structured prompts that include vendor context. If no key is provided, pre-written templates are shown with a "Connect Claude API for AI-powered analysis" prompt.

### 4.7 Vendor Detail View

Clicking any vendor opens the full detail panel with tabs:

- **Overview** — Health score, key stats, spend chart, renewal countdown
- **Contract** — Terms summary, key dates, auto-renewal status, termination notice period, uploaded/linked contract document
- **Spend** — Monthly spend history, invoice tracking, payment status, budget allocation
- **Utilization** — Seats/licenses used vs. purchased, feature adoption, last active date per user
- **Relationship** — Internal owner, vendor contacts, meeting notes, support ticket history
- **Intelligence** — Claude-powered contract analysis, renewal prep, market alternatives

### 4.8 Compliance Calendar

A timeline view of all compliance-related deadlines across vendors and operations:

- **Insurance renewals** (D&O, E&O, cyber liability)
- **Certification expirations** (vendor SOC 2 reports, security certifications)
- **Tax deadlines** (Delaware franchise tax, federal/state filings, 1099 distribution)
- **Legal deadlines** (409A valuation timing, board consent deadlines)
- **Vendor-specific** (BAA renewals, DPA updates, audit rights windows)

Each deadline has an owner, status (upcoming / in progress / complete / overdue), and configurable alert cadence.

## 5. Data Architecture

### 5.1 Mock Data (MVP)

Ship with 20-25 vendors representing a realistic vendor ecosystem for a ~35-person AI startup that has raised $232M and operates a large GPU cluster:

**Infrastructure & Compute**

| Vendor | Category | Annual Spend | Health | Story |
|---|---|---|---|---|
| Dell Technologies | GPU Infrastructure | $2,400,000 | 85 | 10,000 H100 cluster; strategic partnership, dedicated support team |
| AWS | Cloud | $840,000 | 72 | Primary cloud for non-GPU workloads; spend growing faster than expected |
| Cloudflare | CDN/Security | $36,000 | 88 | Straightforward, well-priced, reliable |
| Vercel | Hosting | $14,400 | 82 | Product website and docs hosting; good developer experience |

**Productivity & Collaboration**

| Vendor | Category | Annual Spend | Health | Story |
|---|---|---|---|---|
| Notion | Knowledge Base | $15,000 | 78 | Company wiki and project management; some teams also using Linear |
| Slack | Communication | $18,000 | 75 | Core comms; usage growing, approaching next pricing tier |
| Google Workspace | Email/Docs | $25,200 | 90 | Foundation; Drive, Gmail, Calendar, Meet |
| Zoom | Video | $6,000 | 45 | Underutilized since Google Meet is available; overlap candidate |
| Linear | Project Management | $8,400 | 80 | Engineering team loves it; potential overlap with Notion boards |
| Loom | Async Video | $4,800 | 55 | Low adoption after initial excitement; 4 of 12 seats active |

**Development & Engineering**

| Vendor | Category | Annual Spend | Health | Story |
|---|---|---|---|---|
| GitHub Enterprise | Source Control | $21,000 | 92 | Critical infrastructure; 42 public repos, all private repos |
| Docker Business | Containers | $7,200 | 85 | Essential for Sculptor product; well-utilized |
| Weights & Biases | ML Ops | $48,000 | 70 | Experiment tracking; some researchers prefer custom solutions |
| DataDog | Monitoring | $60,000 | 65 | Powerful but expensive; team questions if they need all features |

**Finance & Legal**

| Vendor | Category | Annual Spend | Health | Story |
|---|---|---|---|---|
| Brex | Corporate Card | $3,600 | 88 | Clean integration, good controls |
| Mercury | Banking | $0 (free tier) | 82 | Primary operating account |
| Carta | Cap Table | $12,000 | 76 | Cap table management and 409A; renewal coming up, price increased 20% |
| Pilot | Bookkeeping | $36,000 | 68 | Monthly closes running 5 days late consistently; quality concerns |
| Cooley LLP | Outside Counsel | $180,000 | 82 | Strong relationship; handles corporate, IP, financing |
| Fenwick & West | Secondary Counsel | $45,000 | 74 | Tax and employment matters; responsive but expensive |

**Security & Compliance**

| Vendor | Category | Annual Spend | Health | Story |
|---|---|---|---|---|
| 1Password Business | Password Mgmt | $5,400 | 90 | Well-adopted, essential |
| Vanta | Compliance | $24,000 | 78 | SOC 2 compliance automation; renewal in 45 days |

**HR & Benefits**

| Vendor | Category | Annual Spend | Health | Story |
|---|---|---|---|---|
| Rippling | HRIS/Payroll | $42,000 | 80 | Payroll, benefits admin, device management |
| Gusto (legacy) | Payroll | $0 (migrating) | 30 | Migration to Rippling 90% complete; need to cancel |
| Tock | Lunch Catering | $108,000 | 72 | Daily lunch ($250/day); quality inconsistent recently |

**Design & Brand**

| Vendor | Category | Annual Spend | Health | Story |
|---|---|---|---|---|
| Figma | Design | $9,600 | 85 | Design team core tool; well-utilized |
| Framer | Website | $3,600 | 70 | Marketing site; considering migration to custom Next.js |

### 5.2 Claude API Integration

**Endpoint:** `https://api.anthropic.com/v1/messages`
**Model:** `claude-sonnet-4-6`
**Use cases:**

| Feature | Prompt Strategy |
|---|---|
| Contract summary | System prompt with contract text; extract key terms, dates, risks, and obligations into structured format |
| Renewal prep | Vendor context (spend, utilization, health) + market context; generate negotiation talking points and recommended ask |
| Overlap analysis | Full tooling inventory as context; identify functional overlaps, recommend consolidation with reasoning |
| Spend narrative | Category spend data + quarter-over-quarter changes; generate board-ready summary paragraph |
| Vendor comparison | Two or more vendor profiles + company requirements; generate structured comparison matrix |

**Fallback:** If no API key is set, pre-written analysis is shown with a "Connect Claude API for live intelligence" prompt.

## 6. Design Direction

### 6.1 Aesthetic

Imbue-inspired design system. Imbue's brand is clean, modern, and purposeful, with a focus on clarity and trust. Deep navy and electric blue accents, clean white space, precise typography. This should feel like a tool Imbue's ops team would actually want to use internally.

- **Palette:** White (#ffffff) and light gray (#f8f9fa) backgrounds, deep navy (#1a1a2e) for text and headers, electric blue (#4361ee) for primary actions and accents, health colors (emerald green, amber, orange, red) for status indicators
- **Typography:** Inter or system sans-serif; clean, modern, highly legible
- **Depth:** Subtle shadows, clean borders, generous spacing
- **Tone:** Precise, trustworthy, uncluttered; like a well-organized ops system should feel

### 6.2 Layout

- **Header:** ImbueOps logo, "by Zi Wang," view toggle (Ops Pulse / Vendor Map / Spend), settings (API key)
- **Ops Pulse view:** Vertical stack of priority cards with urgency indicators
- **Vendor Map view:** Category-grouped grid of vendor tiles, filterable and sortable
- **Spend view:** Charts and summary tables, with quarterly export
- **Detail panel:** Slides in from right, tabbed interface
- **Responsive:** Functional on narrow viewports, optimized for desktop

### 6.3 Key Interactions

- **Vendor Map (deep):** Tiles show quick stats on hover; click to open full detail panel. Filter by category, health tier, renewal window, spend range. Sort by spend, health, renewal date. Animated transitions between filter states. Renewal countdown badges pulse when within 30 days.
- **Vendor Detail:** Tabbed panel slides in from right. Contract tab highlights risky terms (auto-renewal, rate escalation) in amber/red. Utilization tab shows seat usage as a visual gauge. Intelligence tab has live Claude generation with loading state.
- **Ops Pulse (deep):** Summary strip at top gives instant situational awareness. Priority cards expand to show full context with spend sparklines and timelines. Quick action buttons for common workflows. Weekly digest sidebar shows resolved items and upcoming previews. Slack alert preview strip at bottom shows mock notifications. Urgency color-coding (red/amber/blue) makes triage instant.
- **Spend Center (lighter):** Charts are interactive (hover for values, click to filter). Clean and informative, not flashy.
- **Compliance Calendar:** Timeline view with status columns. Items show owner, deadline, and days remaining.
- **Slack Alert Preview:** Mock Slack message blocks showing what notifications would look like (renewal reminders, budget warnings, compliance alerts). Demonstrates the integration concept visually.
- **Export:** Buttons generate both PDF and Excel formatted data for board decks.

## 7. Technical Spec

### 7.1 Stack

- **Framework:** React 19 + Vite
- **Charts:** Recharts (bar, line, pie for spend analytics)
- **Icons:** Lucide React
- **API:** Fetch to Anthropic Messages API (claude-sonnet-4-6)
- **State:** React hooks (useState, useEffect, useReducer for complex state)
- **Deployment:** Vercel + GitHub

### 7.2 Component Architecture

```
ImbueOps (root)
├── Header (logo, view toggle, settings/API key)
├── OpsPulse (landing page)
│   └── PulseCard[] (prioritized action queue)
├── VendorMap
│   ├── CategoryGroup[] (grouped vendor tiles)
│   │   └── VendorTile[] (color-coded, clickable)
│   └── FilterBar (category, health tier, sort)
├── SpendCenter
│   ├── SpendOverview (total spend, trend line, cost per employee)
│   ├── CategoryBreakdown (stacked bar chart)
│   ├── BudgetVsActual (per-category tracking)
│   └── TopVendors (ranked list)
├── VendorDetail (slide-in panel)
│   ├── OverviewTab (health score, key stats, spend chart)
│   ├── ContractTab (terms, dates, auto-renewal status)
│   ├── SpendTab (monthly history, invoices, payment status)
│   ├── UtilizationTab (seats used vs. licensed, adoption metrics)
│   ├── RelationshipTab (owner, contacts, notes)
│   └── IntelligenceTab (Claude-powered analysis)
├── OverlapDetector (tooling audit view)
│   ├── FunctionMatrix (tools mapped to functions)
│   ├── OverlapFlags (highlighted redundancies)
│   └── ConsolidationRecs (Claude-generated recommendations)
├── ComplianceCalendar (timeline of deadlines)
├── ExportModal (board-ready reports)
└── SettingsPanel (API key input, preferences)
```

## 8. Success Criteria

For the Operations application, ImbueOps demonstrates:

1. **Vendor management fluency** — The dashboard shows you understand the full lifecycle: procurement, contract management, renewal negotiation, utilization tracking, and sunsetting. This is not a theoretical understanding; it is a working system.

2. **Tooling strategy thinking** — The Overlap Detector shows you think about tooling as a system, not just a list of subscriptions. You ask "why do we have this?" and "does it duplicate something we already pay for?"

3. **Finance ops competence** — Spend Command Center with budget vs. actual, cost-per-employee, and board-ready exports shows you can own financial reporting for vendor spend.

4. **Automation instinct** — Instead of building this in Zapier or a spreadsheet, you built it with Claude Code. This is the "create automation integrations, workflows and systems" the JD asks for, executed at a higher level than Zapier connectors.

5. **Compliance awareness** — The compliance calendar shows you think proactively about deadlines that, if missed, create real legal or financial risk. You do not wait to be told about a deadline.

6. **Scaling mindset** — The tool is designed to work at 35 people and at 100+. Health scoring, categorization, and alerting are systems that scale, not manual checklists that break.

7. **Imbue-specific knowledge** — Mock data reflects Imbue's actual vendor landscape (Dell GPU cluster, open-source tooling, SF office with daily lunch, Carta for cap table). This shows you researched the company and thought about their specific context.

8. **AI-native approach** — Claude API integration for contract analysis, negotiation prep, and spend narratives shows you think about AI as a tool for ops, not just something the product team builds. This aligns with Imbue's mission of "tools to make AI serve humans."

## 9. Out of Scope (v1)

- Real vendor API integrations (QuickBooks, Brex, Slack webhooks)
- Real contract document parsing (OCR/PDF extraction)
- Multi-user roles and permissions
- Approval workflows for new vendor requests
- Procurement pipeline management
- SSO / authentication
- Mobile-native layout

## 10. Resolved Decisions

1. **Depth vs. breadth** — Go deep on Vendor Map and Ops Pulse as the two hero features. Vendor Map gets full interactivity, filtering, sorting, detailed tiles, and the richest drill-through experience. Ops Pulse gets a summary strip, expandable priority cards with impact estimates and sparklines, a weekly digest sidebar, and Slack alert previews. Spend Command Center is functional but lighter.
2. **Compliance Calendar** — Standalone feature with its own view/tab. Not folded into Ops Pulse. This reinforces compliance awareness as a distinct ops competency.
3. **Export format** — Both PDF and Excel for board-ready reports.
4. **Slack notification mockup** — Include mock Slack alert previews showing what renewal reminders, budget warnings, and compliance deadlines would look like as Slack messages. Demonstrates integration thinking without requiring a live Slack workspace.
5. **Demo context** — Tool will be demoed live in the interview (not the application video). Priorities: functional depth on Vendor Map, smooth navigation flow, impressive mock data that sparks conversation, and Claude API integration that works live. The interviewer should be able to click around and explore.
