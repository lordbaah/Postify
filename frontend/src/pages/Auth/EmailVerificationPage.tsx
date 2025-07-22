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

  const form = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      otp: '',
    },
  });

  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Countdown for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerification = async (data: VerificationData) => {
    if (!email) {
      toast.error('Missing email. Please start the process again.');
      return;
    }

    const result = await verifyaccount({ email, otp: data.otp });
    if (result.success) {
      form.reset();
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
      if (result.success) form.reset();
      setResendTimer(60);
    } catch {
      toast.error('Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Email Verification
      </h2>

      {email && (
        <p className="text-center text-gray-600 mb-4">
          Verifying account for: <strong>{email}</strong>
        </p>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleVerification)}
          className="space-y-6"
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

          <Button type="submit" className="w-full">
            Verify Email
          </Button>
        </form>
      </Form>

      {/* Resend Code Button */}
      <div className="mt-6 text-center">
        <Button
          type="button"
          onClick={handleResend}
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

export default EmailVerificationPage;
