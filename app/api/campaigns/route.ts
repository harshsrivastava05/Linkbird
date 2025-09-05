// app/api/campaigns/route.ts
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { campaigns } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userCampaigns = await db.query.campaigns.findMany({
    where: eq(campaigns.userId, session.user.id),
  });

  return NextResponse.json(userCampaigns);
}