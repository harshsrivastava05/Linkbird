'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { campaigns } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Action to delete a campaign
export async function deleteCampaign(campaignId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // Make sure the campaign belongs to the current user
    await db.delete(campaigns).where(
      and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, session.user.id)
      )
    );
    
    // This tells Next.js to refresh the data on the campaigns page
    revalidatePath('/campaigns'); 
    
    return { success: true };
  } catch (error) {
    console.error('Delete campaign error:', error);
    return { success: false, error: 'Failed to delete campaign.' };
  }
}

// Action to toggle the status (e.g., from 'Active' to 'Paused')
export async function toggleCampaignStatus(campaignId: string, currentStatus: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }
    
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    
    // Make sure the campaign belongs to the current user
    await db.update(campaigns)
      .set({ status: newStatus })
      .where(
        and(
          eq(campaigns.id, campaignId),
          eq(campaigns.userId, session.user.id)
        )
      );
      
    revalidatePath('/campaigns');
    return { success: true };
  } catch (error) {
    console.error('Toggle campaign status error:', error);
    return { success: false, error: 'Failed to update status.' };
  }
}