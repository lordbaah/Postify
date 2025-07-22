import { z } from 'zod';

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters.' })
      .max(50, { message: 'First name must be at most 50 characters.' }),

    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters.' })
      .max(50, { message: 'Last name must be at most 50 characters.' }),

    userName: z
      .string()
      .min(2, { message: 'Username must be at least 2 characters.' })
      .max(50, { message: 'Username must be at most 50 characters.' }),

    email: z.string().email({ message: 'Please enter a valid email address.' }),

    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' })
      .max(30, { message: 'Password must be at most 30 characters.' }),

    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm password must be at least 6 characters.' })
      .max(30, { message: 'Confirm password must be at most 30 characters.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

// Infer the type for form values
export type signUpData = z.infer<typeof signUpSchema>;
