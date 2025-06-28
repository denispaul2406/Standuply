'use server';

import { summarizeTeamUpdates } from '@/ai/flows/summarize-team-updates';
import type { Update } from '@/lib/types';

export async function generateSummaryAction(updates: Update[]): Promise<{ summary: string | null; error: string | null }> {
  if (updates.length === 0) {
    return { summary: null, error: 'No updates to summarize.' };
  }

  const updatesString = updates
    .map(
      (u) =>
        `From: ${u.name}\nYesterday's progress: ${u.yesterday}\nToday's goals: ${u.today}\nBlockers: ${u.blockers}`
    )
    .join('\n\n');

  try {
    const result = await summarizeTeamUpdates({ teamUpdates: updatesString });
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error('Error generating summary:', error);
    return { summary: null, error: 'Failed to generate AI summary. Please try again.' };
  }
}
