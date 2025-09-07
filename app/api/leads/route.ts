import { auth } from "@/auth";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { and, eq, gt, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    console.log('Session:', session?.user?.id);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const cursor = searchParams.get("cursor");
    const searchTerm = searchParams.get("search"); // Get the search term

    const userLeads = await db.query.leads.findMany({
      limit: limit + 1, // Fetch one extra to see if there are more pages
      where: and(
        eq(leads.userId, session.user.id),
        // If we have a cursor, only fetch items created after it
        cursor ? gt(leads.createdAt, new Date(cursor)) : undefined,
        searchTerm
          ? or(
              ilike(leads.name, `%${searchTerm}%`),
              ilike(leads.email, `%${searchTerm}%`)
            )
          : undefined
      ),
      orderBy: (leads, { asc }) => [asc(leads.createdAt)],
    });

    let nextCursor: string | null = null;
    if (userLeads.length > limit) {
      const nextItem = userLeads.pop(); // Remove the extra item
      nextCursor = nextItem!.createdAt.toISOString();
    }

    return NextResponse.json({ leads: userLeads, nextCursor });
  } catch (error) {
    console.error("[LEADS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
