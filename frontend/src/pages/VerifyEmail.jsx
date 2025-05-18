import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';

const VerifyEmail = () => {
  const [resendTimer, setResendTimer] = useState(0);

  const { verifyaccount, resendSignUpOTp, isLoading, success, error } =
    useAuthStore();

  const form = useForm({
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleEmailVerification = async (data) => {
    try {
      await verifyaccount(data);

      form.reset();
    } catch (err) {
      console.error('verification failed:', err);
    }
  };

  const handleResend = async () => {
    const email = form.getValues('email');

    try {
      await resendSignUpOTp(email);

      form.reset();
    } catch (err) {
      console.error('verification failed:', err);
    }

    setResendTimer(60);
    console.log('Code resent to:', email);
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 border rounded-md shadow-sm">
        <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the 6-digit code sent to your email.
        </p>

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEmailVerification)}
            className="space-y-6"
          >
            {/* Email Input */}
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid email address',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* OTP Input */}
            <FormField
              control={form.control}
              name="otp"
              rules={{
                required: 'Verification code is required',
                minLength: {
                  value: 6,
                  message: 'Code must be 6 digits',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>Expires in 10 minutes</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={resendTimer > 0}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default VerifyEmail;
