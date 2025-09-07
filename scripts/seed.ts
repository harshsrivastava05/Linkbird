// scripts/seed.ts - Enhanced with rich lead profile data
import 'dotenv/config'; // Load .env first, before db import
import { db } from '@/lib/db';
import { campaigns, leads, users, leadActivities } from '@/lib/db/schema';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

// Helper arrays for realistic data
const jobTitles = [
  'Regional Head', 'Director of Sales', 'Marketing Manager', 'Business Development Manager',
  'VP of Marketing', 'Sales Director', 'Chief Technology Officer', 'Product Manager',
  'Head of Operations', 'Senior Sales Manager', 'Marketing Director', 'CEO',
  'Founder', 'Co-Founder', 'Head of Business Development', 'Senior Account Manager'
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
  'Education', 'Real Estate', 'Consulting', 'Media', 'Telecommunications',
  'Automotive', 'Energy', 'Hospitality', 'Non-profit', 'Government'
];

const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

const connectionStatuses = ['1st', '2nd', '3rd'];

const cities = [
  'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu',
  'Hyderabad, Telangana', 'Pune, Maharashtra', 'Kolkata, West Bengal', 'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan', 'Surat, Gujarat', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
  'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra', 'Bhopal, Madhya Pradesh'
];

const activityTypes = ['message', 'connection_request', 'profile_view', 'email', 'call'];
const activityStatuses = ['pending', 'completed', 'failed'];

async function main() {
  console.log('🌱 Seeding database with enhanced lead data...');

  try {
    // Get the first user to assign data to
    const firstUser = await db.query.users.findFirst();
    if (!firstUser) {
      console.error('❌ No users found in the database. Please create a user first.');
      process.exit(1);
    }
    console.log(`👤 Seeding data for user: ${firstUser.name} (${firstUser.id})`);

    // Clear existing data
    await db.delete(leadActivities).where(eq(leadActivities.userId, firstUser.id));
    await db.delete(leads).where(eq(leads.userId, firstUser.id));
    await db.delete(campaigns).where(eq(campaigns.userId, firstUser.id));
    console.log('🧹 Cleared existing data.');

    // Create enhanced campaigns
    const createdCampaigns = Array.from({ length: 10 }, () => ({
      id: crypto.randomUUID(),
      name: faker.company.buzzPhrase(),
      description: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(['Active', 'Paused']),
      progress: faker.number.int({ min: 0, max: 100 }),
      targetAudience: faker.helpers.arrayElement([
        'Tech Executives', 'Marketing Directors', 'Sales Managers', 
        'Startup Founders', 'Healthcare Leaders', 'Finance Professionals'
      ]),
      goalCount: faker.number.int({ min: 50, max: 500 }),
      userId: firstUser.id,
    }));

    await db.insert(campaigns).values(createdCampaigns);
    console.log(`🏕️ Created ${createdCampaigns.length} enhanced campaigns.`);

    // Create rich lead profiles
    const createdLeads = Array.from({ length: 75 }, () => {
      const randomCampaign = faker.helpers.arrayElement(createdCampaigns);
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const companyName = faker.company.name();
      
      // Generate realistic last activity (within last 30 days)
      const lastActivity = faker.date.recent({ days: 30 });
      
      return {
        id: crypto.randomUUID(),
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        status: faker.helpers.arrayElement(['Pending', 'Contacted', 'Responded', 'Connected', 'Not Interested']),
        
        // Enhanced profile fields
        title: faker.helpers.arrayElement(jobTitles),
        company: companyName,
        location: faker.helpers.arrayElement(cities),
        profileImage: `https://i.pravatar.cc/150?u=${firstName}${lastName}`, // Placeholder avatar
        connectionStatus: faker.helpers.arrayElement(connectionStatuses),
        linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
        phoneNumber: faker.phone.number(), // Removed specific format to avoid type error
        industry: faker.helpers.arrayElement(industries),
        companySize: faker.helpers.arrayElement(companySizes),
        
        // Activity data
        lastActivity,
        lastContactedAt: faker.helpers.maybe(() => 
          faker.date.between({ from: lastActivity, to: new Date() })
        ),
        responseRate: faker.number.int({ min: 0, max: 100 }),
        
        // Foreign keys
        campaignId: randomCampaign.id,
        userId: firstUser.id,
      };
    });

    await db.insert(leads).values(createdLeads);
    console.log(`👥 Created ${createdLeads.length} enhanced lead profiles.`);

    // Create lead activities for more realistic data
    const activities = [];
    for (const lead of createdLeads.slice(0, 30)) { // Add activities for first 30 leads
      const numActivities = faker.number.int({ min: 1, max: 5 });
      
      for (let i = 0; i < numActivities; i++) {
        const activityType = faker.helpers.arrayElement(activityTypes);
        const createdAt = faker.date.recent({ days: 15 });
        
        let title, description;
        switch (activityType) {
          case 'message':
            title = 'LinkedIn Message Sent';
            description = `Hi ${lead.name.split(' ')[0]}, I'm building consultative AI solutions...`;
            break;
          case 'connection_request':
            title = 'Connection Request Sent';
            description = 'Sent connection request with personalized message';
            break;
          case 'profile_view':
            title = 'Profile Viewed';
            description = 'Viewed LinkedIn profile';
            break;
          case 'email':
            title = 'Email Sent';
            description = 'Follow-up email sent';
            break;
          case 'call':
            title = 'Call Attempted';
            description = 'Phone call attempted';
            break;
          default:
            title = 'Activity';
            description = 'General activity';
        }

        activities.push({
          id: crypto.randomUUID(),
          leadId: lead.id,
          userId: firstUser.id,
          type: activityType,
          title,
          description,
          status: faker.helpers.arrayElement(activityStatuses),
          messageContent: activityType === 'message' ? description : null,
          responseReceived: faker.helpers.maybe(() => true, { probability: 0.3 }),
          responseContent: faker.helpers.maybe(() => 
            faker.lorem.sentence(), { probability: 0.2 }
          ),
          createdAt,
        });
      }
    }

    if (activities.length > 0) {
      await db.insert(leadActivities).values(activities);
      console.log(`📋 Created ${activities.length} lead activities.`);
    }

    console.log('✅ Database seeded successfully with enhanced data!');
    console.log(`📊 Summary:`);
    console.log(`   - ${createdCampaigns.length} campaigns`);
    console.log(`   - ${createdLeads.length} leads with rich profiles`);
    console.log(`   - ${activities.length} lead activities`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('❌ Failed to seed database:', e);
  process.exit(1);
});