import { z } from 'zod';

export const inquiryFormSchema = z.object({
  name: z.string().min(2, { message: 'name.required' }),
  phone: z.string().min(10, { message: 'phone.required' }).regex(/^\+?[0-9\s-()]+$/, { message: 'phone.invalid' }),
  email: z.string().email({ message: 'email.invalid' }).optional().or(z.literal('')),
  carModel: z.string().optional().or(z.literal('')),
  message: z.string().optional().or(z.literal('')),
  terms: z.boolean().refine(val => val === true, {
    message: 'terms.required'
  })
});

export const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'username.required' }),
  password: z.string().min(1, { message: 'password.required' })
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
