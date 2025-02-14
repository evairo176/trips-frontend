'use client';

import { insertMainCategory, updateMainCategory } from '@/api/main-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MainCategory } from '@/constants/main-category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.'
  }),
  description: z.string().optional()
});

export default function MainCategoryForm({
  initialData,
  pageTitle,
  onOpen
}: {
  initialData: MainCategory | undefined;
  pageTitle: string;
  onOpen: (e: boolean) => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const defaultValues = {
    title: initialData?.title || '',
    description: initialData?.description || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (initialData) {
        const result = await updateMainCategory(
          {
            ...data
          },
          initialData.id
        );
        form.reset();
        toast.success(result?.message);
        onOpen(false);
        router.push('/dashboard/main-category');
        return;
      }

      const result = await insertMainCategory({
        ...data,
        companyId: session?.user.companyId as string
      });
      form.reset();
      toast.success(result?.message);
      onOpen(false);
      router.push('/dashboard/main-category');
    } catch (err: any) {
      console.log('Error:', err.response?.data || err.message);
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Category Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter main category description'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button disabled={isLoading} type='submit'>
            {initialData ? 'Perbarui' : 'Simpan'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
