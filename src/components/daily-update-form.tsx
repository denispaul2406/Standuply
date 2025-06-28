'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  yesterday: z.string().min(10, { message: 'Please provide a brief update on yesterday\'s progress.' }),
  today: z.string().min(10, { message: 'Please provide a brief plan for today.' }),
  blockers: z.string().optional(),
});

export type UpdateFormValues = z.infer<typeof formSchema>;

interface DailyUpdateFormProps {
  onAddUpdate: (data: UpdateFormValues) => void;
}

export function DailyUpdateForm({ onAddUpdate }: DailyUpdateFormProps) {
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      yesterday: '',
      today: '',
      blockers: '',
    },
  });

  function onSubmit(values: UpdateFormValues) {
    onAddUpdate(values);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Your Daily Update</CardTitle>
        <CardDescription>Share your progress, plans, and any challenges.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yesterday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What did you accomplish yesterday?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. I deployed the new feature to staging..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="today"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are your goals for today?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. I will start working on API integration..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blockers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Any blockers?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. I am waiting for the design assets..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <Send />
              Submit Update
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
