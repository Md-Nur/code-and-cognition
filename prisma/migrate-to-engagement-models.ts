/**
 * Data Migration Script: Legacy SubCategory to EngagementModel
 *
 * This script helps migrate existing SubCategory pricing data to the new
 * EngagementModel structure for a premium B2B agency model.
 *
 * Run: npx tsx prisma/migrate-to-engagement-models.ts
 */

import { PrismaClient, PricingType, Status } from "@prisma/client";

const prisma = new PrismaClient();

interface MigrationStats {
  servicesUpdated: number;
  engagementModelsCreated: number;
  categoriesCreated: number;
  errors: string[];
}

async function createDefaultCategories() {
  console.log("📦 Creating default service categories...");

  const categories = [
    {
      name: "Digital Platforms",
      slug: "digital-platforms",
      description:
        "End-to-end digital solutions including web and mobile applications",
      order: 1,
    },
    {
      name: "Brand Strategy",
      slug: "brand-strategy",
      description: "Strategic branding and positioning services",
      order: 2,
    },
    {
      name: "Data & Analytics",
      slug: "data-analytics",
      description: "Data-driven insights and business intelligence solutions",
      order: 3,
    },
    {
      name: "Consulting",
      slug: "consulting",
      description: "Strategic technology and business consulting",
      order: 4,
    },
  ];

  let created = 0;

  for (const cat of categories) {
    const existing = await prisma.serviceCategory.findUnique({
      where: { slug: cat.slug },
    });

    if (!existing) {
      await prisma.serviceCategory.create({
        data: {
          ...cat,
          status: Status.ACTIVE,
        },
      });
      created++;
      console.log(`  ✓ Created category: ${cat.name}`);
    } else {
      console.log(`  ⊙ Category already exists: ${cat.name}`);
    }
  }

  return created;
}

async function assignServiceToCategory(
  serviceId: string,
  serviceTitle: string,
) {
  // Simple categorization logic - customize based on your needs
  const title = serviceTitle.toLowerCase();

  let categorySlug = "digital-platforms"; // default

  if (
    title.includes("brand") ||
    title.includes("design") ||
    title.includes("identity")
  ) {
    categorySlug = "brand-strategy";
  } else if (
    title.includes("data") ||
    title.includes("analytics") ||
    title.includes("insight")
  ) {
    categorySlug = "data-analytics";
  } else if (
    title.includes("consult") ||
    title.includes("advisory") ||
    title.includes("strategy")
  ) {
    categorySlug = "consulting";
  }

  const category = await prisma.serviceCategory.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    throw new Error(`Category not found: ${categorySlug}`);
  }

  return category.id;
}

async function migrateSubCategoriesToEngagementModels() {
  console.log("\n🔄 Migrating SubCategories to EngagementModels...");

  const subCategories = await prisma.subCategory.findMany({
    include: { service: true },
  });

  if (subCategories.length === 0) {
    console.log("  ℹ No SubCategories found to migrate");
    return 0;
  }

  let created = 0;

  for (const subCat of subCategories) {
    // Create Basic/Standard engagement
    if (subCat.basePriceBDT > 0 || subCat.basePriceUSD > 0) {
      const basicExists = await prisma.engagementModel.findFirst({
        where: {
          serviceId: subCat.serviceId,
          name: `${subCat.title} - Standard`,
        },
      });

      if (!basicExists) {
        await prisma.engagementModel.create({
          data: {
            serviceId: subCat.serviceId,
            name: `${subCat.title} - Standard`,
            description: subCat.description || "Standard tier offering",
            pricingType: PricingType.FIXED,
            basePriceBDT: subCat.basePriceBDT,
            basePriceUSD: subCat.basePriceUSD,
            deliverables: [
              "Standard deliverables",
              "Documentation",
              "Basic support",
            ],
            estimatedDays: 30,
            order: 0,
            status: Status.ACTIVE,
          },
        });
        created++;
        console.log(`  ✓ Created: ${subCat.title} - Standard`);
      }
    }

    // Create Plus engagement
    if (subCat.mediumPriceBDT > 0 || subCat.mediumPriceUSD > 0) {
      const plusExists = await prisma.engagementModel.findFirst({
        where: {
          serviceId: subCat.serviceId,
          name: `${subCat.title} - Plus`,
        },
      });

      if (!plusExists) {
        await prisma.engagementModel.create({
          data: {
            serviceId: subCat.serviceId,
            name: `${subCat.title} - Plus`,
            description:
              subCat.mediumDescription ||
              "Enhanced tier with additional features",
            pricingType: PricingType.FIXED,
            basePriceBDT: subCat.mediumPriceBDT,
            basePriceUSD: subCat.mediumPriceUSD,
            deliverables: [
              "Enhanced deliverables",
              "Extended documentation",
              "Priority support",
            ],
            estimatedDays: 45,
            order: 1,
            status: Status.ACTIVE,
          },
        });
        created++;
        console.log(`  ✓ Created: ${subCat.title} - Plus`);
      }
    }

    // Create Pro engagement
    if (subCat.proPriceBDT > 0 || subCat.proPriceUSD > 0) {
      const proExists = await prisma.engagementModel.findFirst({
        where: {
          serviceId: subCat.serviceId,
          name: `${subCat.title} - Pro`,
        },
      });

      if (!proExists) {
        await prisma.engagementModel.create({
          data: {
            serviceId: subCat.serviceId,
            name: `${subCat.title} - Pro`,
            description:
              subCat.proDescription ||
              "Premium tier with full features and dedicated support",
            pricingType: PricingType.FIXED,
            basePriceBDT: subCat.proPriceBDT,
            basePriceUSD: subCat.proPriceUSD,
            deliverables: [
              "Premium deliverables",
              "Comprehensive documentation",
              "Dedicated support",
              "Training sessions",
            ],
            estimatedDays: 60,
            order: 2,
            status: Status.ACTIVE,
          },
        });
        created++;
        console.log(`  ✓ Created: ${subCat.title} - Pro`);
      }
    }
  }

  return created;
}

async function addPremiumEngagementModels() {
  console.log("\n✨ Adding premium engagement models...");

  const services = await prisma.service.findMany({
    include: { engagementModels: true },
  });

  let created = 0;

  for (const service of services) {
    // Add Strategy engagement if it doesn't exist
    const hasStrategy = service.engagementModels.some((em) =>
      em.name.toLowerCase().includes("strategy"),
    );

    if (!hasStrategy) {
      await prisma.engagementModel.create({
        data: {
          serviceId: service.id,
          name: "Strategy",
          description:
            "Discovery and strategic planning with technology roadmap and architecture design",
          pricingType: PricingType.CUSTOM,
          deliverables: [
            "Technology Audit & Assessment",
            "Strategic Roadmap Document",
            "Architecture Blueprint",
            "Risk Analysis Report",
          ],
          estimatedDays: 14,
          order: 10,
          status: Status.ACTIVE,
        },
      });
      created++;
      console.log(`  ✓ Added Strategy to: ${service.title}`);
    }

    // Add Retainer engagement if it doesn't exist
    const hasRetainer = service.engagementModels.some((em) =>
      em.name.toLowerCase().includes("retainer"),
    );

    if (!hasRetainer) {
      await prisma.engagementModel.create({
        data: {
          serviceId: service.id,
          name: "Retainer",
          description:
            "Ongoing maintenance, support, and continuous improvement",
          pricingType: PricingType.RETAINER,
          basePriceBDT: 100000,
          basePriceUSD: 1000,
          deliverables: [
            "Monthly Maintenance",
            "Priority Support",
            "Feature Updates",
            "Monthly Reporting",
          ],
          order: 99,
          status: Status.ACTIVE,
        },
      });
      created++;
      console.log(`  ✓ Added Retainer to: ${service.title}`);
    }
  }

  return created;
}

async function updateServicesWithCategories() {
  console.log("\n🔗 Assigning services to categories...");

  const services = await prisma.service.findMany();
  let updated = 0;

  for (const service of services) {
    try {
      const categoryId = await assignServiceToCategory(
        service.id,
        service.title,
      );

      await prisma.service.update({
        where: { id: service.id },
        data: {
          categoryId,
          overview: service.description, // Use existing description as overview
          positioningText: `Transform your business with our ${service.title.toLowerCase()} expertise`,
          order: 0,
        },
      });

      updated++;
      console.log(`  ✓ Updated: ${service.title}`);
    } catch (error) {
      console.error(`  ✗ Error updating ${service.title}:`, error);
    }
  }

  return updated;
}

async function generateSampleProposals() {
  console.log("\n📄 Generating sample proposals for active projects...");

  const activeProjects = await prisma.project.findMany({
    where: {
      status: "ACTIVE",
      proposals: {
        none: {}, // Only projects without proposals
      },
    },
    include: {
      booking: {
        include: {
          service: {
            include: {
              engagementModels: true,
            },
          },
        },
      },
    },
    take: 5, // Limit to first 5 for safety
  });

  let created = 0;

  for (const project of activeProjects) {
    const engagementModel = project.booking?.service.engagementModels[0];

    await prisma.proposal.create({
      data: {
        projectId: project.id,
        engagementModelId: engagementModel?.id,
        scopeSummary:
          project.scope || "Scope to be defined during discovery phase",
        deliverables: engagementModel?.deliverables || ["To be determined"],
        budgetBDT: project.booking?.budgetBDT,
        budgetUSD: project.booking?.budgetUSD,
        currency: "BDT",
        approved: false,
        notes: "Migrated from legacy system",
        version: 1,
      },
    });

    created++;
    console.log(`  ✓ Created proposal for: ${project.title}`);
  }

  return created;
}

async function main() {
  console.log("🚀 Starting migration to Premium B2B Agency Structure\n");
  console.log("=".repeat(60));

  const stats: MigrationStats = {
    servicesUpdated: 0,
    engagementModelsCreated: 0,
    categoriesCreated: 0,
    errors: [],
  };

  try {
    // Step 1: Create categories
    stats.categoriesCreated = await createDefaultCategories();

    // Step 2: Assign services to categories
    stats.servicesUpdated = await updateServicesWithCategories();

    // Step 3: Migrate SubCategories to EngagementModels
    const migratedModels = await migrateSubCategoriesToEngagementModels();
    stats.engagementModelsCreated += migratedModels;

    // Step 4: Add premium engagement models
    const premiumModels = await addPremiumEngagementModels();
    stats.engagementModelsCreated += premiumModels;

    // Step 5: Generate sample proposals (optional)
    const proposalsCreated = await generateSampleProposals();

    console.log("\n" + "=".repeat(60));
    console.log("✅ Migration completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`  • Service Categories Created: ${stats.categoriesCreated}`);
    console.log(`  • Services Updated: ${stats.servicesUpdated}`);
    console.log(
      `  • Engagement Models Created: ${stats.engagementModelsCreated}`,
    );
    console.log(`  • Sample Proposals Created: ${proposalsCreated}`);

    if (stats.errors.length > 0) {
      console.log("\n⚠️  Errors encountered:");
      stats.errors.forEach((err) => console.log(`  • ${err}`));
    }
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
