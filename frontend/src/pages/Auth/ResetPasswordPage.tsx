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
import { Label } from '@/components/ui/label';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { resetPassword, forgotPassword, isLoading } = useAuthStore();

  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useAuthToast();

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle resend code
  const handleResendCode = async () => {
    if (!email) {
      toast.error('Missing email. Please restart the reset process.');
      return;
    }

    try {
      setIsResending(true);

      await forgotPassword(email);

      setResendTimer(60); // restart timer
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to resend code.';
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  // Handle reset password form submit
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
      reset();
      // navigate('/signin');
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    }
  };

  return (
    <div>
      <h1>Reset Your Password</h1>
      {email && (
        <p>
          Resetting password for: <strong>{email}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit(handlePasswordReset)}>
        <div>
          <label>Verification Code</label>
          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="Enter the 6-digit code"
            {...register('otp')}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              // Remove all non-digits and limit to 6 characters
              target.value = target.value.replace(/\D/g, '').slice(0, 6);
            }}
          />
          {errors.otp && <p>{errors.otp.message}</p>}
        </div>

        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            placeholder="Enter new password"
            {...register('newPassword')}
          />
          {errors.newPassword && <p>{errors.newPassword.message}</p>}
        </div>

        <div>
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            placeholder="Confirm new password"
            {...register('confirmNewPassword')}
          />
          {errors.confirmNewPassword && (
            <p>{errors.confirmNewPassword.message}</p>
          )}
        </div>

        <Button disabled={isLoading} type="submit">
          {isLoading ? 'Sending Reset code.' : 'Send Reset Code'}
        </Button>
      </form>

      {/* Resend Code Section */}
      <div style={{ marginTop: '1rem' }}>
        <Button
          type="button"
          onClick={handleResendCode}
          disabled={resendTimer > 0 || isResending}
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
