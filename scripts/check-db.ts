// scripts/check-db.ts - Add this to test your database
import { db } from '@/lib/db';
import { users, campaigns, leads } from '@/lib/db/schema';

async function checkDatabase() {
  console.log('🔍 Checking database connection and data...');
  
  try {
    // Check users
    const allUsers = await db.query.users.findMany();
    console.log('👥 Users in database:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) [ID: ${user.id}]`);
    });

    // Check campaigns
    const allCampaigns = await db.query.campaigns.findMany();
    console.log('🏕️ Campaigns in database:', allCampaigns.length);
    allCampaigns.forEach(campaign => {
      console.log(`  - ${campaign.name} [User: ${campaign.userId}]`);
    });

    // Check leads
    const allLeads = await db.query.leads.findMany();
    console.log('👤 Leads in database:', allLeads.length);
    allLeads.forEach(lead => {
      console.log(`  - ${lead.email} [User: ${lead.userId}]`);
    });

    console.log('✅ Database check completed');
  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

checkDatabase();