'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { DailyUpdateForm, type UpdateFormValues } from '@/components/daily-update-form';
import { TeamUpdatesView } from '@/components/team-updates-view';
import type { Update } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { generateSummaryAction } from './actions';

const initialUpdates: Update[] = [
  {
    id: '1',
    name: 'Alice',
    yesterday: 'Finished implementing the new authentication flow and wrote unit tests.',
    today: 'Will start working on the user profile page.',
    blockers: 'None so far.',
    createdAt: '2023-10-27T10:00:00Z',
  },
  {
    id: '2',
    name: 'Bob',
    yesterday: 'Deployed the latest build to the staging server and fixed a critical bug in the API.',
    today: 'Monitoring the staging deployment and preparing for the production release.',
    blockers: 'Waiting for final approval from the QA team.',
    createdAt: '2023-10-27T10:05:00Z',
  },
];

export default function Home() {
  const [updates, setUpdates] = useState<Update[]>(initialUpdates);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addUpdate = (data: UpdateFormValues) => {
    const newUpdate: Update = {
      id: new Date().toISOString(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    setUpdates((prev) => [newUpdate, ...prev]);
    toast({
      title: 'Update Submitted!',
      description: 'Your daily update has been added to the list.',
    });
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary(null);
    const { summary: newSummary, error } = await generateSummaryAction(updates);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
    } else {
      setSummary(newSummary);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <aside className="lg:col-span-2">
            <div className="sticky top-8">
              <DailyUpdateForm onAddUpdate={addUpdate} />
            </div>
          </aside>
          <section className="lg:col-span-3">
            <TeamUpdatesView
              updates={updates}
              summary={summary}
              isLoading={isLoading}
              onGenerateSummary={handleGenerateSummary}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
