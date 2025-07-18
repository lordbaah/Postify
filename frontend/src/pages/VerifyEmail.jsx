import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from navigation state
  const emailFromState = location.state?.email;

  const {
    verifyaccount,
    resendSignUpOTp,
    isLoading,
    success,
    error,
    clearMessages,
  } = useAuthStore();

  const form = useForm({
    defaultValues: {
      email: emailFromState || '',
      otp: '',
    },
  });

  // Clear messages when component mounts
  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  // Set email in form when component mounts or email changes
  useEffect(() => {
    if (emailFromState) {
      form.setValue('email', emailFromState);
    }
  }, [emailFromState, form]);

  // Handle success messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      form.reset();

      // Navigate to profile after successful verification
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    }
  }, [success, form, navigate]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle resend timer
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Redirect if no email is provided (optional)
  useEffect(() => {
    if (!emailFromState) {
      // Uncomment this if you want to redirect users without email back to signup
      // navigate('/signup');
    }
  }, [emailFromState, navigate]);

  const handleEmailVerification = async (data) => {
    try {
      await verifyaccount(data);
      // Success/error handling is done in useEffect above
    } catch (err) {
      console.error('Verification failed:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleResend = async () => {
    const email = form.getValues('email');

    if (!email) {
      toast.error('Email is required to resend code');
      return;
    }

    try {
      await resendSignUpOTp(email);
      setResendTimer(60);
      toast.success('Verification code resent successfully');
    } catch (err) {
      console.error('Resend failed:', err);
      toast.error('Failed to resend code. Please try again.');
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 border rounded-md shadow-sm">
        <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {emailFromState ? (
            <>
              Enter the 6-digit code sent to <strong>{emailFromState}</strong>
            </>
          ) : (
            'Enter your email and the 6-digit code sent to your email.'
          )}
        </p>

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
                      readOnly={!!emailFromState}
                      className={emailFromState ? 'bg-gray-50' : ''}
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
                disabled={
                  resendTimer > 0 || !form.getValues('email') || isLoading
                }
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
