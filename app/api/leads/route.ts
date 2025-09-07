import { auth } from "@/auth";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { and, eq, gt, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const cursor = searchParams.get("cursor");
    const searchTerm = searchParams.get("search");

    const userLeads = await db.query.leads.findMany({
      limit: limit + 1, // Fetch one extra to see if there are more pages
      where: and(
        eq(leads.userId, session.user.id),
        // If we have a cursor, only fetch items created after it
        cursor ? gt(leads.createdAt, new Date(cursor)) : undefined,
        searchTerm
          ? or(
              ilike(leads.name, `%${searchTerm}%`),
              ilike(leads.email, `%${searchTerm}%`),
              ilike(leads.company, `%${searchTerm}%`),
              ilike(leads.title, `%${searchTerm}%`)
            )
          : undefined
      ),
      orderBy: (leads, { desc }) => [desc(leads.createdAt)],
    });

    let nextCursor: string | null = null;
    if (userLeads.length > limit) {
      const nextItem = userLeads.pop(); // Remove the extra item
      nextCursor = nextItem!.createdAt.toISOString();
    }

    // Transform the data to include computed fields
    const enrichedLeads = userLeads.map(lead => ({
      ...lead,
      // Calculate days since last activity for better UX
      daysSinceLastActivity: lead.lastActivity 
        ? Math.floor((new Date().getTime() - lead.lastActivity.getTime()) / (1000 * 60 * 60 * 24))
        : null,
      // Format last activity for display
      lastActivityFormatted: lead.lastActivity 
        ? formatRelativeTime(lead.lastActivity)
        : 'Never',
    }));

    return NextResponse.json({ 
      leads: enrichedLeads, 
      nextCursor,
      total: enrichedLeads.length 
    });
  } catch (error) {
    console.error("[LEADS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}