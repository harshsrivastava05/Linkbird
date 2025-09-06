// app/api/campaigns/route.ts
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { campaigns } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  // Get the current user's session from the server
  const session = await auth();

  // If there is no user, return an unauthorized error
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all campaigns from the database where the userId matches the session userId
  const userCampaigns = await db.query.campaigns.findMany({
    where: eq(campaigns.userId, session.user.id),
  });

  // Return the campaigns as a JSON response
  return NextResponse.json(userCampaigns);
}