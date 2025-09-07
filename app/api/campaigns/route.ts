// app/api/campaigns/route.ts - Enhanced debug version
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🏕️ ===============================");
    console.log("🏕️ CAMPAIGNS API ROUTE CALLED");
    console.log("🏕️ ===============================");

    // Get the current user's session from the server
    const session = await auth();

    console.log("📊 Session data:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      userName: session?.user?.name,
    });

    // If there is no user, return an unauthorized error
    if (!session?.user?.id) {
      console.log("❌ No session or user ID found - returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      "✅ User authenticated, fetching campaigns for user:",
      session.user.id
    );

    // Test database connection first
    try {
      const allCampaigns = await db.query.campaigns.findMany();
      console.log("📋 Total campaigns in database:", allCampaigns.length);
      console.log(
        "📋 All campaigns:",
        allCampaigns.map((c) => ({ id: c.id, name: c.name, userId: c.userId }))
      );
    } catch (dbError) {
      console.error("💥 Database query error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Fetch campaigns for the specific user
    const userCampaigns = await db.query.campaigns.findMany({
      where: eq(campaigns.userId, session.user.id),
    });

    console.log("🎯 User campaigns found:", userCampaigns.length);
    console.log("🎯 User campaigns data:", userCampaigns);

    // Return the campaigns as a JSON response
    return NextResponse.json(userCampaigns);
  } catch (error) {
    console.error(
      "💥 Campaigns API error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
