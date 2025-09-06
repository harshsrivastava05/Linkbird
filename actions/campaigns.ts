// actions/campaigns.ts
'use server';

import { db } from '@/lib/db';
import { campaigns } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Action to delete a campaign
export async function deleteCampaign(campaignId: string) {
  try {
    await db.delete(campaigns).where(eq(campaigns.id, campaignId));
    
    // This tells Next.js to refresh the data on the campaigns page
    revalidatePath('/campaigns'); 
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete campaign.' };
  }
}

// Action to toggle the status (e.g., from 'Active' to 'Paused')
export async function toggleCampaignStatus(campaignId: string, currentStatus: string) {
    try {
        const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
        await db.update(campaigns).set({ status: newStatus }).where(eq(campaigns.id, campaignId));
        revalidatePath('/campaigns');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update status.' };
    }
}