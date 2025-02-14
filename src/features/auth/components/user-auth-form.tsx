'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import GithubSignInButton from './github-auth-button';
import PasswordTextInput from '@/components/password-text-input';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string()
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const defaultValues = {
    email: 'coba@gmail.com',
    password: '123456'
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const authenticated = await signIn('credentials', {
        ...data,
        redirect: false
      });

      if (authenticated?.error) {
        const promise = () =>
          new Promise((resolve, reject) =>
            setTimeout(() => reject({ message: authenticated?.error }), 1000)
          );

        toast.promise(promise, {
          loading: 'Please wait...',
          success: (data: any) => {
            return `${data.message}`;
          },
          error: (data: any) => {
            return `${authenticated?.error}`;
          }
        });

        setIsLoading(false);
        return;
      }

      // data.imageUrl = imageUrl;
      const promise = () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ message: 'Login Successfully' }), 1000)
        );

      toast.promise(promise, {
        loading: 'Please wait...',
        success: (data: any) => {
          router.push('/dashboard');
          // router.push('/overview/choose-business');
          setIsLoading(false);
          return `${data.message}`;
        },
        error: 'Error'
      });
    } catch (error: any) {
      console.error('There was an error creating the data!', error);
      toast.error(`${error?.message}`);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-2'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter your email...'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PasswordTextInput form={form} name='password' showGeneate={false} />

          <Button disabled={isLoading} className='ml-auto w-full' type='submit'>
            Login
          </Button>
        </form>
      </Form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>
      <GithubSignInButton />
    </>
  );
}
