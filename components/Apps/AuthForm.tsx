"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodTypeAny } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import AuthButton from './common/AuthButton';
import { Button } from '../ui/button';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { LoginOAuth } from '@/actions/authactions';
import { cn } from '@/lib/utils';

type Field = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
};

type ReusableAuthFormProps<T extends ZodTypeAny> = {
  schema: T;
  type: "signup" | "login";
  defaultValues: Record<string, any>;
  fields: Field[];
  onSubmit: (values: z.infer<T>) => void;
  className?: string
  submitButtonText?: string;
  googleLogin: boolean;
};

const ReusableAuthForm = <T extends ZodTypeAny>({
  schema,
  type,
  defaultValues,
  fields,
  className,
  onSubmit,
  submitButtonText = 'Submit',
  googleLogin = true
}: ReusableAuthFormProps<T>) => {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as z.infer<T> || fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {} as z.infer<T>),
  });

  const loading = form.formState.isSubmitting;

  return (
    <div className={cn(className)}>
      <Form {...form}>
        <form className='bg-white flex flex-col gap-2 h-full rounded-lg gap-x-2 p-8 ' onSubmit={form.handleSubmit(onSubmit)}>
          {fields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name as any}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <Input
                      {...formField}
                      placeholder={field.placeholder}
                      type={field.type}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <div className='col-span-2'>
            <Link className='text-[#FF7E00]' href="/auth/forgotpassword">Forgot Password?</Link>
          </div>
          <AuthButton
            variant="default"
            className='rounded-2xl col-span-2 bg-[#FF7E00] shadow '
            buttonText={submitButtonText}
            loading={loading}
          />
          <div className='col-span-2 flex justify-center'>
            {type === "login" ? <p>Don&#39;t have an account? <Link className='text-[#FF7E00]' href="/auth/signup">Signup</Link></p> : <p>Already have an account? <Link className='text-[#FF7E00]' href="/auth/login">Login</Link></p>}
          </div>
          {googleLogin ? <div className='flex w-full col-span-2 flex-col gap-4 items-center'>
            <Button onClick={async () => await LoginOAuth()} className='flex items-center gap-2 w-full rounded-2xl p-6 text-xl h-14'>
              <FcGoogle className='!size-8' />
              <span>Sign in with Google</span>
            </Button>
          </div> : ""}
        </form>
      </Form>
    </div>
  );
};

export default ReusableAuthForm;
