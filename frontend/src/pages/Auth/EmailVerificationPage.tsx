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

const verificationSchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'Code must be 6 digits.' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers.' }),
});

type VerificationData = z.infer<typeof verificationSchema>;

const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const { verifyaccount, resendOtp } = useAuthStore();

  useAuthToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
  });

  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerification = async (data: VerificationData) => {
    const { otp } = data;
    if (!email) {
      toast.error('Missing email. Please start the process again.');
      return;
    }

    const result = await verifyaccount({ email, otp });

    if (result.success) {
      reset();
      navigate('/');
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Missing email.');
      return;
    }

    try {
      setIsResending(true);

      const result = await resendOtp(email);

      if (result.success) {
        reset();
      }
      setResendTimer(60);
    } catch {
      toast.error('Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <h2>Email Verification</h2>
      {email && (
        <p>
          Verifying account for: <strong>{email}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit(handleVerification)}>
        <div>
          <Label>Verification Code</Label>
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

        <Button type="submit">Verify Email</Button>
      </form>

      <div className="mt-2">
        <Button
          onClick={handleResend}
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

export default EmailVerificationPage;
