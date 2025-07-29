import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';
import { useAuthToast } from '@/hooks/useAuthToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import usePageTitle from '@/hooks/usePageTitle';

const resetPasswordSchema = z
  .object({
    otp: z.string().min(4, { message: 'Verification code is required.' }),
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' })
      .max(30, { message: 'Password must be at most 30 characters.' }),
    confirmNewPassword: z
      .string()
      .min(6, { message: 'Confirm password must be at least 6 characters.' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match.',
    path: ['confirmNewPassword'],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { resetPassword, forgotPassword, isLoading } = useAuthStore();
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useAuthToast();
  usePageTitle('ResetPassword');

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Missing email. Please restart the reset process.');
      return;
    }
    try {
      setIsResending(true);
      await forgotPassword(email);
      setResendTimer(60);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to resend code.';
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  const handlePasswordReset = async (data: ResetPasswordData) => {
    if (!email) {
      toast.error('Missing email context. Please restart the reset process.');
      return;
    }
    const result = await resetPassword({
      email,
      otp: data.otp,
      newPassword: data.newPassword,
    });

    if (result.success) {
      form.reset();
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Reset Your Password
      </h1>

      <small className="mb-4">
        Heads up: Our emails might land in your <strong>Spam</strong> or{' '}
        <strong>Promotions</strong> folder. If you find one there, please mark
        it as &ldquo;Not spam&rdquo; so you don&rsquo;t miss important updates.
      </small>

      {email && (
        <p className="text-center text-gray-600 mb-4">
          Resetting password for: <strong>{email}</strong>
        </p>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePasswordReset)}
          className="grid gap-6"
        >
          {/* OTP Field */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="Enter the 6-digit code"
                    {...field}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.value = target.value
                        .replace(/\D/g, '')
                        .slice(0, 6);
                      field.onChange(target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Password Field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Sending Reset Code...' : 'Send Reset Code'}
          </Button>
        </form>
      </Form>

      {/* Resend Code */}
      <div className="mt-6 text-center">
        <Button
          type="button"
          onClick={handleResendCode}
          disabled={resendTimer > 0 || isResending}
          variant="outline"
        >
          {resendTimer > 0
            ? `Resend Code in ${resendTimer}s`
            : isResending
            ? 'Resending...'
            : 'Resend Code'}
        </Button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
