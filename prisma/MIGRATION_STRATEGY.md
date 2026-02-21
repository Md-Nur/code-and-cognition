# Premium B2B Agency Schema Migration Strategy

## Overview

This document outlines the migration strategy from the legacy fixed-pricing system (Service → SubCategory → Plans) to a flexible premium B2B agency model (ServiceCategory → Service → EngagementModel → Proposal).

## Schema Changes Summary

### New Models

1. **ServiceCategory** - High-level service groupings (e.g., Digital Platforms, Brand Strategy)
2. **EngagementModel** - Flexible service delivery approaches with dynamic pricing
3. **Proposal** - Custom project proposals with scope and budget

### Modified Models

1. **Service** - Enhanced with categoryId, overview, positioningText, and order field
2. **Booking** - Added engagementModelId reference
3. **Project** - Added proposals relation

### Deprecated Models

1. **SubCategory** - Marked as deprecated, kept for backward compatibility

---

## Migration Steps

### Phase 1: Schema Migration (Database Structure)

#### Step 1: Create Migration File

```bash
npx prisma migrate dev --name refactor_to_premium_b2b_structure --create-only
```

#### Step 2: Manual Migration SQL (Add to migration file)

**Before the auto-generated migration, add:**

```sql
-- ===================================
-- PHASE 1: Create New Tables
-- ===================================

-- Create ServiceCategory table
CREATE TABLE "ServiceCategory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "order" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create EngagementModel table
CREATE TABLE "EngagementModel" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "serviceId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "pricingType" TEXT NOT NULL DEFAULT 'CUSTOM',
  "basePriceBDT" DOUBLE PRECISION,
  "basePriceUSD" DOUBLE PRECISION,
  "deliverables" TEXT[],
  "estimatedDays" INTEGER,
  "order" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EngagementModel_serviceId_name_key" UNIQUE ("serviceId", "name")
);

-- Create Proposal table
CREATE TABLE "Proposal" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "engagementModelId" TEXT,
  "scopeSummary" TEXT NOT NULL,
  "deliverables" TEXT[],
  "budgetBDT" DOUBLE PRECISION,
  "budgetUSD" DOUBLE PRECISION,
  "currency" TEXT NOT NULL DEFAULT 'BDT',
  "estimatedDays" INTEGER,
  "approved" BOOLEAN NOT NULL DEFAULT false,
  "approvedAt" TIMESTAMP(3),
  "notes" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ===================================
-- PHASE 2: Seed Initial Data
-- ===================================

-- Create default service categories
INSERT INTO "ServiceCategory" (id, name, description, slug, "order")
VALUES
  (gen_random_uuid()::text, 'Digital Platforms', 'End-to-end digital solutions including web and mobile applications', 'digital-platforms', 1),
  (gen_random_uuid()::text, 'Brand Strategy', 'Strategic branding and positioning services', 'brand-strategy', 2),
  (gen_random_uuid()::text, 'Data & Analytics', 'Data-driven insights and business intelligence solutions', 'data-analytics', 3),
  (gen_random_uuid()::text, 'Consulting', 'Strategic technology and business consulting', 'consulting', 4);

-- ===================================
-- PHASE 3: Migrate Existing Data
-- ===================================

-- Add temporary categoryId column to Service table (nullable initially)
ALTER TABLE "Service" ADD COLUMN "categoryId" TEXT;
ALTER TABLE "Service" ADD COLUMN "overview" TEXT;
ALTER TABLE "Service" ADD COLUMN "positioningText" TEXT;
ALTER TABLE "Service" ADD COLUMN "order" INTEGER DEFAULT 0;

-- Assign all existing services to a default category
UPDATE "Service"
SET "categoryId" = (SELECT id FROM "ServiceCategory" WHERE slug = 'digital-platforms' LIMIT 1)
WHERE "categoryId" IS NULL;

-- Now make categoryId required
ALTER TABLE "Service" ALTER COLUMN "categoryId" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "Service"
ADD CONSTRAINT "Service_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Migrate SubCategory pricing to EngagementModel
-- This creates engagement models based on existing subcategories
INSERT INTO "EngagementModel" (id, "serviceId", name, description, "pricingType", "basePriceBDT", "basePriceUSD", deliverables, "order", status)
SELECT
  gen_random_uuid()::text,
  "serviceId",
  title || ' - Basic' as name,
  COALESCE(description, 'Basic tier offering') as description,
  'FIXED' as "pricingType",
  "basePriceBDT",
  "basePriceUSD",
  ARRAY['Standard deliverables']::TEXT[] as deliverables,
  0 as "order",
  'ACTIVE' as status
FROM "SubCategory"
WHERE "basePriceBDT" > 0 OR "basePriceUSD" > 0;

INSERT INTO "EngagementModel" (id, "serviceId", name, description, "pricingType", "basePriceBDT", "basePriceUSD", deliverables, "order", status)
SELECT
  gen_random_uuid()::text,
  "serviceId",
  title || ' - Plus' as name,
  COALESCE("mediumDescription", 'Medium tier offering') as description,
  'FIXED' as "pricingType",
  "mediumPriceBDT",
  "mediumPriceUSD",
  ARRAY['Enhanced deliverables']::TEXT[] as deliverables,
  1 as "order",
  'ACTIVE' as status
FROM "SubCategory"
WHERE "mediumPriceBDT" > 0 OR "mediumPriceUSD" > 0;

INSERT INTO "EngagementModel" (id, "serviceId", name, description, "pricingType", "basePriceBDT", "basePriceUSD", deliverables, "order", status)
SELECT
  gen_random_uuid()::text,
  "serviceId",
  title || ' - Pro' as name,
  COALESCE("proDescription", 'Pro tier offering') as description,
  'FIXED' as "pricingType",
  "proPriceBDT",
  "proPriceUSD",
  ARRAY['Premium deliverables']::TEXT[] as deliverables,
  2 as "order",
  'ACTIVE' as status
FROM "SubCategory"
WHERE "proPriceBDT" > 0 OR "proPriceUSD" > 0;

-- Add engagementModelId to Booking table (nullable for backward compatibility)
ALTER TABLE "Booking" ADD COLUMN "engagementModelId" TEXT;

-- Add foreign key constraints
ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_engagementModelId_fkey"
FOREIGN KEY ("engagementModelId") REFERENCES "EngagementModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "EngagementModel"
ADD CONSTRAINT "EngagementModel_serviceId_fkey"
FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Proposal"
ADD CONSTRAINT "Proposal_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Proposal"
ADD CONSTRAINT "Proposal_engagementModelId_fkey"
FOREIGN KEY ("engagementModelId") REFERENCES "EngagementModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

#### Step 3: Apply Migration

```bash
npx prisma migrate dev
npx prisma generate
```

---

### Phase 2: Data Seeding (Enhanced Engagement Models)

Create or update `prisma/seed.ts` to include premium engagement models:

```typescript
import { PrismaClient, PricingType } from "@prisma/client";

const prisma = new PrismaClient();

async function seedEngagementModels() {
  // Example: Digital Platform Service Engagement Models
  const digitalPlatformService = await prisma.service.findFirst({
    where: { slug: "web-development" },
  });

  if (digitalPlatformService) {
    await prisma.engagementModel.createMany({
      data: [
        {
          serviceId: digitalPlatformService.id,
          name: "Strategy",
          description:
            "Discovery and strategic planning phase with technology roadmap and architecture design",
          pricingType: PricingType.CUSTOM,
          deliverables: [
            "Technology Audit & Assessment",
            "Strategic Roadmap Document",
            "Architecture Blueprint",
            "Risk Analysis Report",
          ],
          estimatedDays: 14,
          order: 1,
        },
        {
          serviceId: digitalPlatformService.id,
          name: "Implementation",
          description:
            "Full-scale development and deployment of digital solutions",
          pricingType: PricingType.CUSTOM,
          deliverables: [
            "Complete Application Development",
            "QA & Testing",
            "Deployment & Setup",
            "Documentation",
          ],
          estimatedDays: 90,
          order: 2,
        },
        {
          serviceId: digitalPlatformService.id,
          name: "Optimization",
          description:
            "Performance tuning, scaling, and enhancement of existing platforms",
          pricingType: PricingType.CUSTOM,
          deliverables: [
            "Performance Audit",
            "Code Optimization",
            "Infrastructure Scaling",
            "Security Hardening",
          ],
          estimatedDays: 21,
          order: 3,
        },
        {
          serviceId: digitalPlatformService.id,
          name: "Retainer",
          description:
            "Ongoing maintenance, support, and continuous improvement",
          pricingType: PricingType.RETAINER,
          basePriceBDT: 150000,
          basePriceUSD: 1500,
          deliverables: [
            "Monthly Maintenance",
            "Priority Support",
            "Feature Updates",
            "Monthly Reporting",
          ],
          order: 4,
        },
      ],
    });
  }
}

async function main() {
  await seedEngagementModels();
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:

```bash
npx prisma db seed
```

---

### Phase 3: Code Updates

#### Update Service Handlers

**Before:**

```typescript
// Old approach
const services = await prisma.service.findMany({
  include: { subCategories: true },
});
```

**After:**

```typescript
// New approach
const services = await prisma.service.findMany({
  include: {
    category: true,
    engagementModels: {
      where: { status: "ACTIVE" },
      orderBy: { order: "asc" },
    },
  },
});
```

#### Update Booking Flow

**Before:**

```typescript
await prisma.booking.create({
  data: {
    clientName,
    clientEmail,
    serviceId,
    budgetBDT,
  },
});
```

**After:**

```typescript
await prisma.booking.create({
  data: {
    clientName,
    clientEmail,
    serviceId,
    engagementModelId, // Optional, can be null for "Contact Us" bookings
    budgetBDT,
  },
});
```

#### Create Proposal Flow (NEW)

```typescript
// After project is created, generate proposal
async function createProposal(projectId: string, engagementModelId?: string) {
  const proposal = await prisma.proposal.create({
    data: {
      projectId,
      engagementModelId,
      scopeSummary: "To be defined during discovery",
      deliverables: engagementModelId
        ? (
            await prisma.engagementModel.findUnique({
              where: { id: engagementModelId },
            })
          )?.deliverables || []
        : [],
      budgetBDT: null, // Will be filled after scoping
      currency: "BDT",
      approved: false,
      version: 1,
    },
  });
  return proposal;
}
```

---

### Phase 4: Frontend Updates

#### Service Page Rendering

**Update `/app/services/[serviceSlug]/page.tsx`:**

```typescript
export default async function ServicePage({ params }) {
  const service = await prisma.service.findUnique({
    where: { slug: params.serviceSlug },
    include: {
      category: true,
      engagementModels: {
        where: { status: 'ACTIVE' },
        orderBy: { order: 'asc' }
      }
    }
  });

  return (
    <div>
      <h1>{service.title}</h1>
      <p className="text-gray-600">{service.category.name}</p>
      <p className="text-lg">{service.positioningText}</p>

      <div className="engagement-models">
        <h2>How We Can Help</h2>
        {service.engagementModels.map(model => (
          <EngagementModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
}
```

#### Booking Form Update

```typescript
<select name="engagementModelId">
  <option value="">— Select Engagement Type —</option>
  {engagementModels.map(model => (
    <option key={model.id} value={model.id}>
      {model.name}
      {model.pricingType === 'FIXED' && model.basePriceUSD
        ? ` - Starting at $${model.basePriceUSD}`
        : ' - Custom Pricing'}
    </option>
  ))}
</select>
```

---

## Benefits of New Structure

### 1. **Premium Positioning**

- ServiceCategory provides high-level service grouping
- positioningText allows articulating business value
- Moves away from commodity pricing to value-based selling

### 2. **Flexible Pricing**

- EngagementModel supports FIXED, CUSTOM, and RETAINER pricing
- No longer locked into 3 rigid tiers (Basic/Plus/Pro)
- Can offer purely consultative engagements

### 3. **Professional Proposal Workflow**

- Proposal model enables formal scope documentation
- Budget negotiation separate from service catalog
- Approval workflow for client sign-off
- Version tracking for proposal iterations

### 4. **Better Client Experience**

- Clearer distinction between engagement types
- Retainer options for ongoing relationships
- Custom proposals feel more enterprise-grade

### 5. **Backward Compatibility**

- SubCategory remains for legacy data
- Existing bookings and projects still work
- Gradual migration path without breaking changes

---

## Verification Checklist

After migration, verify:

- [ ] All existing services have a categoryId
- [ ] EngagementModels created for each service
- [ ] Old bookings still reference correct services
- [ ] Projects table unchanged and functional
- [ ] Payments still work correctly
- [ ] Frontend displays new structure properly
- [ ] Admin panel can manage new models
- [ ] API routes updated to use new relations

---

## Rollback Plan

If critical issues arise:

1. **Keep SubCategory table intact** (already done)
2. **Make new fields nullable** (already designed this way)
3. **Add feature flag** to toggle between old/new UI
4. **Database rollback**: Run previous migration down

```bash
npx prisma migrate dev --name rollback_to_legacy_structure
```

---

## Timeline Recommendation

- **Week 1**: Schema migration + data migration
- **Week 2**: Backend API updates + testing
- **Week 3**: Frontend updates + admin panel
- **Week 4**: QA, polish, and production deployment

---

## Support & Questions

For questions about this migration, contact the development team or refer to:

- Prisma docs: https://www.prisma.io/docs
- Migration guide: https://www.prisma.io/docs/guides/migrate
