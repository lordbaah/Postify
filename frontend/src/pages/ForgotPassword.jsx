import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail } from 'lucide-react';

import { useAuthStore } from '@/store/authStore';

const ForgotPassword = () => {
  const form = useForm({
    defaultValues: {
      email: '',
    },
  });

  const navigate = useNavigate();
  const { forgotPassword, isLoading, success, error } = useAuthStore();

  const handleForgotPassword = async (data) => {
    try {
      await forgotPassword(data);

      // Navigate to reset password page with email
      setTimeout(() => {
        navigate('/reset-password', {
          state: { email: data.email },
        });
      }, 2000);
    } catch (err) {
      console.error('Forgot password failed:', err);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 border rounded-md shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/signin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>

          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              No worries! Enter your email address and we'll send you a
              verification code to reset your password.
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleForgotPassword)}
            className="space-y-6"
          >
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
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              to="/signin"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
