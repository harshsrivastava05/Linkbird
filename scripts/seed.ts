// scripts/seed.ts
import 'dotenv/config'; // ✅ Load .env first, before db import
import { db } from '@/lib/db';
import { campaigns, leads, users } from '@/lib/db/schema';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🌱 Seeding database...');

  // Get the first user to assign data to
  const firstUser = await db.query.users.findFirst();
  if (!firstUser) {
    console.error('❌ No users found in the database. Please create a user first.');
    process.exit(1);
  }
  console.log(`👤 Seeding data for user: ${firstUser.name} (${firstUser.id})`);

  // Clear existing campaigns and leads for this user
  await db.delete(leads).where(eq(leads.userId, firstUser.id));
  await db.delete(campaigns).where(eq(campaigns.userId, firstUser.id));
  console.log('🧹 Cleared existing data.');

  // Create 10 fake campaigns
  const createdCampaigns = Array.from({ length: 10 }, () => ({
    id: crypto.randomUUID(),
    name: faker.company.buzzPhrase(),
    status: faker.helpers.arrayElement(['Active', 'Paused']),
    progress: faker.number.int({ min: 0, max: 100 }),
    userId: firstUser.id,
  }));

  await db.insert(campaigns).values(createdCampaigns);
  console.log(`🏕️ Created ${createdCampaigns.length} campaigns.`);

  // Create 50 fake leads and assign them to random campaigns
  const createdLeads = Array.from({ length: 50 }, () => {
    const randomCampaign = faker.helpers.arrayElement(createdCampaigns);
    return {
      id: crypto.randomUUID(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      status: faker.helpers.arrayElement(['Pending', 'Contacted', 'Responded']),
      campaignId: randomCampaign.id,
      userId: firstUser.id,
    };
  });

  await db.insert(leads).values(createdLeads);
  console.log(`👥 Created ${createdLeads.length} leads.`);

  console.log('✅ Database seeded successfully!');
}

main().catch((e) => {
  console.error('❌ Failed to seed database:', e);
  process.exit(1);
});
