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
  submitButtonText?: string;
};

const ReusableAuthForm = <T extends ZodTypeAny>({
  schema,
  type,
  defaultValues,
  fields,
  onSubmit,
  submitButtonText = 'Submit',
}: ReusableAuthFormProps<T>) => {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as z.infer<T> || fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {} as z.infer<T>),
  });

  const loading = form.formState.isSubmitting;

  return (
    <div className=' h-full border-red-500'>
      <Form {...form}>
        <form className='bg-white z-[50] h-full rounded-t-4xl flex flex-col gap-4 p-10' onSubmit={form.handleSubmit(onSubmit)}>
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
                      className='h-16'
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
          <div>
            <Link className='text-[#FF7E00]' href="/auth/forgotpassword">Forgot Password?</Link>
          </div>
          <AuthButton
            variant="default"
            className='rounded-2xl bg-[#FF7E00] shadow text-xl p-6  h-14'
            buttonText={submitButtonText}
            loading={loading}
          />
          {type === "login" ? <p>Don't have an account? <Link className='text-[#FF7E00]' href="/auth/signup">Signup</Link></p> : <p>Already have an account? <Link className='text-[#FF7E00]' href="/auth/login">Login</Link></p>}
          <div className='flex w-full flex-col gap-4 items-center'>
            <Button className='flex items-center gap-2 w-full rounded-2xl p-6 text-xl h-14'>
              <FcGoogle className='!size-8' />
              <span>Sign in with Google</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReusableAuthForm;
