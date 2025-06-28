// Summarize team updates into a single paragraph using an LLM.
'use server';
/**
 * @fileOverview Summarizes team updates into a concise paragraph.
 *
 * - summarizeTeamUpdates - A function that summarizes team updates.
 * - SummarizeTeamUpdatesInput - The input type for the summarizeTeamUpdates function.
 * - SummarizeTeamUpdatesOutput - The return type for the summarizeTeamUpdates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTeamUpdatesInputSchema = z.object({
  teamUpdates: z
    .string()
    .describe('A list of team updates for the day.'),
});
export type SummarizeTeamUpdatesInput = z.infer<typeof SummarizeTeamUpdatesInputSchema>;

const SummarizeTeamUpdatesOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the team updates.'),
  progress: z.string().describe('A one-sentence summary of the flow.'),
});
export type SummarizeTeamUpdatesOutput = z.infer<typeof SummarizeTeamUpdatesOutputSchema>;

export async function summarizeTeamUpdates(input: SummarizeTeamUpdatesInput): Promise<SummarizeTeamUpdatesOutput> {
  return summarizeTeamUpdatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTeamUpdatesPrompt',
  input: {schema: SummarizeTeamUpdatesInputSchema},
  output: {schema: SummarizeTeamUpdatesOutputSchema},
  prompt: `You are a team lead. Please summarize the following team updates into a single concise paragraph: {{{teamUpdates}}}`,
});

const summarizeTeamUpdatesFlow = ai.defineFlow(
  {
    name: 'summarizeTeamUpdatesFlow',
    inputSchema: SummarizeTeamUpdatesInputSchema,
    outputSchema: SummarizeTeamUpdatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    output!.progress = 'Summarized the team updates into a concise paragraph.';
    return output!;
  }
);
