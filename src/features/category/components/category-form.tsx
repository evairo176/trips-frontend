'use client';

import { insertCategory, updateCategory } from '@/api/category';
import { Button } from '@/components/ui/button';
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
import { Category } from '@/constants/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import Select from 'react-select';
import { Label } from '@/components/ui/label';
import { useGetMainCategoryNoFilter } from '@/api/main-category';
import { MainCategory } from '@/constants/main-category';

const formSchema = z.object({
  mainCategoryId: z.string(),
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.'
  }),
  description: z.string().optional()
});

const customStyles = {
  control: (base: any) => ({
    ...base,
    height: 35,
    minHeight: 35,
    fontSize: 15
  })
};
export default function CategoryForm({
  initialData,
  onOpen
}: {
  initialData: Category | undefined;
  pageTitle: string;
  onOpen: (e: boolean) => void;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { maincategorys, maincategorysLoading } = useGetMainCategoryNoFilter();
  const defaultValues = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    mainCategoryId: initialData?.mainCategoryId || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  const mainCategory: MainCategory[] = maincategorys || [];

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (initialData) {
        const result = await updateCategory(
          {
            ...data
          },
          initialData.id
        );
        form.reset();
        toast.success(result?.message);
        onOpen(false);
        router.push('/dashboard/category');
        return;
      }

      const result = await insertCategory({
        ...data,
        companyId: session?.user.companyId as string
      });
      form.reset();
      toast.success(result?.message);
      onOpen(false);
      router.push('/dashboard/category');
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
          name='mainCategoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pilih Main Category</FormLabel>
              <FormControl>
                <Select
                  options={mainCategory?.map((row) => ({
                    label: row.title,
                    value: row.id
                  }))}
                  isClearable
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption?.value);
                  }}
                  placeholder='Pilih Main Category'
                  value={
                    mainCategory
                      ?.map((row) => ({ label: row.title, value: row.id }))
                      .find((option) => option.value === field.value) || null
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Title</FormLabel>
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
