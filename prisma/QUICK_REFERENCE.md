# Premium B2B Agency Structure - Quick Reference Guide

## 📋 New Model Hierarchy

```
ServiceCategory (Digital Platforms, Brand Strategy, etc.)
  ↓
Service (Web Development, Mobile Apps, etc.)
  ↓
EngagementModel (Strategy, Implementation, Retainer, etc.)
  ↓
Booking → Project → Proposal
```

---

## 🏗️ Model Definitions

### 1. ServiceCategory

High-level service groupings for organizing your offerings.

**Fields:**

- `id` - Unique identifier
- `name` - Category name (e.g., "Digital Platforms")
- `description` - Category description
- `slug` - URL-friendly identifier
- `order` - Display order
- `status` - ACTIVE | INACTIVE

**Relations:**

- `services` → Service[]

**Example:**

```typescript
{
  name: "Digital Platforms",
  description: "End-to-end digital solutions",
  slug: "digital-platforms",
  order: 1
}
```

---

### 2. Service (Enhanced)

Individual service offerings with business value positioning.

**New Fields Added:**

- `categoryId` - Link to ServiceCategory
- `overview` - High-level service overview
- `positioningText` - Business value proposition
- `order` - Display order within category

**Relations:**

- `category` → ServiceCategory
- `engagementModels` → EngagementModel[]
- `bookings` → Booking[]
- `portfolioItems` → PortfolioItem[]
- `subCategories` → SubCategory[] (deprecated)

**Example:**

```typescript
{
  title: "Enterprise Web Development",
  slug: "enterprise-web",
  categoryId: "...",
  overview: "Scalable, secure web applications",
  positioningText: "Transform your digital presence with enterprise-grade solutions",
  description: "Technical details...",
  order: 1
}
```

---

### 3. EngagementModel (NEW)

Flexible engagement types with dynamic pricing.

**Fields:**

- `id` - Unique identifier
- `serviceId` - Link to Service
- `name` - Engagement name (Strategy, Implementation, Optimization, Retainer)
- `description` - What's included
- `pricingType` - FIXED | CUSTOM | RETAINER
- `basePriceBDT` - Base price in BDT (nullable)
- `basePriceUSD` - Base price in USD (nullable)
- `deliverables` - Array of deliverable items
- `estimatedDays` - Timeline estimate
- `order` - Display order
- `status` - ACTIVE | INACTIVE

**Relations:**

- `service` → Service
- `proposals` → Proposal[]
- `bookings` → Booking[]

**Pricing Types:**

- `FIXED` - Fixed price (e.g., $5,000 flat fee)
- `CUSTOM` - "Contact us for pricing" - quote per project
- `RETAINER` - Monthly recurring (e.g., $1,500/month)

**Example - Strategy Engagement:**

```typescript
{
  serviceId: "...",
  name: "Strategy",
  description: "Discovery and strategic planning",
  pricingType: "CUSTOM", // No fixed price
  deliverables: [
    "Technology Audit",
    "Strategic Roadmap",
    "Architecture Blueprint"
  ],
  estimatedDays: 14,
  order: 1
}
```

**Example - Retainer Engagement:**

```typescript
{
  serviceId: "...",
  name: "Retainer",
  description: "Ongoing maintenance and support",
  pricingType: "RETAINER",
  basePriceBDT: 150000,
  basePriceUSD: 1500,
  deliverables: [
    "Monthly Maintenance",
    "Priority Support",
    "Feature Updates"
  ],
  order: 99
}
```

---

### 4. Proposal (NEW)

Custom project proposals with scope and budget.

**Fields:**

- `id` - Unique identifier
- `projectId` - Link to Project
- `engagementModelId` - Optional reference to engagement model
- `scopeSummary` - Detailed scope of work
- `deliverables` - Array of deliverables
- `budgetBDT` / `budgetUSD` - Proposed budget
- `currency` - BDT | USD
- `estimatedDays` - Timeline
- `approved` - Boolean approval status
- `approvedAt` - Timestamp of approval
- `notes` - Additional terms/notes
- `version` - Version number for iterations

**Relations:**

- `project` → Project
- `engagementModel` → EngagementModel (optional)

**Example:**

```typescript
{
  projectId: "...",
  engagementModelId: "...", // Can be null for fully custom
  scopeSummary: "Build a customer portal with authentication...",
  deliverables: [
    "User authentication system",
    "Dashboard interface",
    "API integration",
    "Documentation"
  ],
  budgetUSD: 15000,
  currency: "USD",
  estimatedDays: 60,
  approved: false,
  version: 1
}
```

---

## 🔄 Common Queries

### Get Services with Engagement Models

```typescript
const services = await prisma.service.findMany({
  include: {
    category: true,
    engagementModels: {
      where: { status: "ACTIVE" },
      orderBy: { order: "asc" },
    },
  },
  where: { status: "ACTIVE" },
  orderBy: { order: "asc" },
});
```

### Get Service Categories with Services

```typescript
const categories = await prisma.serviceCategory.findMany({
  include: {
    services: {
      where: { status: "ACTIVE" },
      include: {
        engagementModels: {
          where: { status: "ACTIVE" },
        },
      },
    },
  },
  where: { status: "ACTIVE" },
  orderBy: { order: "asc" },
});
```

### Create Booking with Engagement Model

```typescript
const booking = await prisma.booking.create({
  data: {
    clientName: "John Doe",
    clientEmail: "john@example.com",
    clientPhone: "+1234567890",
    serviceId: serviceId,
    engagementModelId: engagementModelId, // Optional
    budgetUSD: 10000,
    message: "Looking for strategy consultation",
    status: "PENDING",
  },
});
```

### Create Project with Proposal

```typescript
// First create project
const project = await prisma.project.create({
  data: {
    title: "Client Portal Development",
    bookingId: booking.id,
    finderId: userId,
    status: "ACTIVE",
    scope: "Build comprehensive client portal",
  },
});

// Then create proposal
const proposal = await prisma.proposal.create({
  data: {
    projectId: project.id,
    engagementModelId: engagementModelId,
    scopeSummary: "Detailed scope here...",
    deliverables: ["Auth", "Dashboard", "Reports"],
    budgetUSD: 15000,
    currency: "USD",
    estimatedDays: 60,
    approved: false,
    version: 1,
  },
});
```

### Get Project with Proposals

```typescript
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    booking: {
      include: {
        service: true,
        engagementModel: true,
      },
    },
    proposals: {
      orderBy: { version: "desc" },
      include: {
        engagementModel: true,
      },
    },
    members: {
      include: { user: true },
    },
    milestones: true,
  },
});
```

---

## 🎨 UI/UX Patterns

### Service Page Layout

```
┌─────────────────────────────────────┐
│ [Category Badge: Digital Platforms] │
│                                     │
│ Enterprise Web Development          │
│                                     │
│ Transform your digital presence     │ ← positioningText
│ with enterprise-grade solutions     │
│                                     │
│ [Overview section]                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ How We Can Help                 │ │
│ │                                 │ │
│ │ ┌── Strategy ─────────────────┐ │ │
│ │ │ Custom Pricing              │ │ │
│ │ │ • Technology Audit          │ │ │
│ │ │ • Strategic Roadmap         │ │ │
│ │ │ [Get Quote]                 │ │ │
│ │ └─────────────────────────────┘ │ │
│ │                                 │ │
│ │ ┌── Implementation ───────────┐ │ │
│ │ │ Custom Pricing              │ │ │
│ │ │ • Full Development          │ │ │
│ │ │ • QA & Testing              │ │ │
│ │ │ [Get Quote]                 │ │ │
│ │ └─────────────────────────────┘ │ │
│ │                                 │ │
│ │ ┌── Retainer ─────────────────┐ │ │
│ │ │ $1,500/month                │ │ │
│ │ │ • Monthly Maintenance       │ │ │
│ │ │ • Priority Support          │ │ │
│ │ │ [Start Retainer]            │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Booking Form

```typescript
// When engagement model is selected
<select name="engagementModelId">
  <option value="">What do you need?</option>
  {engagementModels.map(model => (
    <option value={model.id}>
      {model.name}
      {model.pricingType === 'FIXED'
        ? ` - $${model.basePriceUSD}`
        : model.pricingType === 'RETAINER'
        ? ` - $${model.basePriceUSD}/month`
        : ' - Custom Quote'}
    </option>
  ))}
</select>
```

---

## ✅ Migration Checklist

### Pre-Migration

- [ ] Backup database
- [ ] Review current Service and SubCategory data
- [ ] Plan ServiceCategory assignments
- [ ] Identify services needing custom engagement models

### During Migration

- [ ] Run Prisma migration: `npx prisma migrate dev`
- [ ] Run data migration script: `npx tsx prisma/migrate-to-engagement-models.ts`
- [ ] Verify all services have categoryId
- [ ] Verify EngagementModels created
- [ ] Test Prisma client generation: `npx prisma generate`

### Post-Migration

- [ ] Update API routes to use new structure
- [ ] Update frontend components
- [ ] Update admin panel CRUD operations
- [ ] Test booking flow end-to-end
- [ ] Test proposal creation workflow
- [ ] Update documentation

---

## 🚀 Next Steps

1. **Run Migration**

   ```bash
   npx prisma migrate dev --name add_premium_b2b_structure
   npx tsx prisma/migrate-to-engagement-models.ts
   ```

2. **Update Frontend**
   - Modify service pages to show EngagementModels
   - Update booking forms
   - Build proposal management UI

3. **Update Backend**
   - Refactor API routes in `/app/api/`
   - Add proposal approval endpoints
   - Update admin panel

4. **Test Thoroughly**
   - Test legacy bookings still work
   - Test new booking with engagement models
   - Test proposal workflow
   - Verify Project model unchanged

---

## 📞 Support

For questions or issues during migration:

- Check migration logs in console
- Review [MIGRATION_STRATEGY.md](./MIGRATION_STRATEGY.md)
- Consult Prisma docs: https://www.prisma.io/docs

---

**Last Updated:** February 21, 2026
