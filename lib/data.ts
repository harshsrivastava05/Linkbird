// lib/data.ts
import { auth } from "@/auth";
import { db } from "./db";
import { campaigns, leads } from "./db/schema";
import { eq, desc } from "drizzle-orm";

export async function getDashboardData() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      stats: { totalCampaigns: 0, totalLeads: 0, activeCampaigns: 0 },
      recentCampaigns: [],
      recentLeads: [],
    };
  }

  const userId = session.user.id;

  // Fetch all campaigns and leads for stats
  const userCampaigns = await db.query.campaigns.findMany({
    where: eq(campaigns.userId, userId),
  });
  const userLeads = await db.query.leads.findMany({
    where: eq(leads.userId, userId),
  });

  const stats = {
    totalCampaigns: userCampaigns.length,
    totalLeads: userLeads.length,
    activeCampaigns: userCampaigns.filter((c) => c.status === "Active").length,
  };

  // Fetch 5 most recent campaigns
  const recentCampaigns = await db.query.campaigns.findMany({
    where: eq(campaigns.userId, userId),
    orderBy: [desc(campaigns.createdAt)],
    limit: 5,
  });

  // Fetch 5 most recent leads
  const recentLeads = await db.query.leads.findMany({
    where: eq(leads.userId, userId),
    orderBy: [desc(leads.createdAt)],
    limit: 5,
  });

  return { stats, recentCampaigns, recentLeads };
}
