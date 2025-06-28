'use client';

import { Calendar, Download, ListTodo, Loader2, ShieldAlert, Sparkles } from 'lucide-react';
import type { Update } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

interface TeamUpdatesViewProps {
  updates: Update[];
  summary: string | null;
  isLoading: boolean;
  onGenerateSummary: () => void;
  onExport?: () => void;
}

export function TeamUpdatesView({ updates, summary, isLoading, onGenerateSummary }: TeamUpdatesViewProps) {
  const { toast } = useToast();

  const handleExport = () => {
    if (!updates.length && !summary) {
      toast({
        variant: 'destructive',
        title: 'Nothing to export',
        description: 'There are no updates or summaries to export.',
      });
      return;
    }

    const dataToExport = {
      summary,
      updates,
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `standuply_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: 'Export Successful',
      description: 'Your data has been downloaded as a JSON file.',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">Team Updates</h2>
            <p className="text-muted-foreground">Here's what the team is working on.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline">
              <Download />
              Export
            </Button>
            <Button onClick={onGenerateSummary} disabled={isLoading || updates.length === 0}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Sparkles />
              )}
              {isLoading ? 'Generating...' : 'AI Summary'}
            </Button>
          </div>
        </div>

        {isLoading && (
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        )}

        {summary && !isLoading && (
          <Card className="mb-6 bg-primary/5 border-primary/20 transition-all animate-in fade-in-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary" />
                <span>AI Generated Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90">{summary}</p>
            </CardContent>
          </Card>
        )}

        {updates.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {updates.map((update) => (
              <AccordionItem key={update.id} value={update.id} className="bg-card rounded-lg border shadow-sm">
                <AccordionTrigger className="p-4 hover:no-underline">
                  <div className="flex items-center gap-4 w-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://placehold.co/40x40.png?text=${update.name.charAt(0)}`} alt={update.name} />
                      <AvatarFallback>{update.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">{update.name}</p>
                      <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                        {new Date(update.createdAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="space-y-4 pl-14">
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" /> Yesterday's Progress
                      </h4>
                      <p className="text-foreground/90">{update.yesterday}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground">
                        <ListTodo className="h-4 w-4" /> Today's Goals
                      </h4>
                      <p className="text-foreground/90">{update.today}</p>
                    </div>
                    {update.blockers && (
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2 text-sm text-destructive/80">
                          <ShieldAlert className="h-4 w-4" /> Blockers
                        </h4>
                        <p className="text-foreground/90">{update.blockers}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold">No updates yet</h3>
              <p className="text-muted-foreground mt-2">
                Submit an update using the form to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
