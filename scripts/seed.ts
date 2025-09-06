// scripts/seed.ts
import { db } from '@/lib/db';
import { campaigns, leads, users } from '@/lib/db/schema';
import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';

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
  await db.delete(leads).where(sql`${leads.userId} = ${firstUser.id}`);
  await db.delete(campaigns).where(sql`${campaigns.userId} = ${firstUser.id}`);
  console.log('🧹 Cleared existing data.');

  // Create 10 fake campaigns
  const createdCampaigns = [];
  for (let i = 0; i < 10; i++) {
    const campaign = {
      id: crypto.randomUUID(),
      name: faker.company.buzzPhrase(),
      status: faker.helpers.arrayElement(['Active', 'Paused']),
      progress: faker.number.int({ min: 0, max: 100 }),
      userId: firstUser.id,
    };
    createdCampaigns.push(campaign);
  }
  await db.insert(campaigns).values(createdCampaigns);
  console.log(`🏕️ Created ${createdCampaigns.length} campaigns.`);

  // Create 50 fake leads and assign them to random campaigns
  const createdLeads = [];
  for (let i = 0; i < 50; i++) {
    const randomCampaign = faker.helpers.arrayElement(createdCampaigns);
    const lead = {
      id: crypto.randomUUID(),
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      status: faker.helpers.arrayElement(['Pending', 'Contacted', 'Responded']),
      campaignId: randomCampaign.id,
      userId: firstUser.id,
    };
    createdLeads.push(lead);
  }
  await db.insert(leads).values(createdLeads);
  console.log(`👥 Created ${createdLeads.length} leads.`);

  console.log('✅ Database seeded successfully!');
}

main().catch((e) => {
  console.error('❌ Failed to seed database:', e);
  process.exit(1);
});