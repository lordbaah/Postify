import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

const SignIn = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const { signin, isLoading, success, error } = useAuthStore();

  const handleSignIn = async (data) => {
    try {
      await signin(data);

      toast.success(success);
      form.reset();

      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (err) {
      console.error('Signup failed:', err);
      toast.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Sign Into Your Account</h2>

      {success && <p className="text-green-600">{success}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignIn)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Enter a valid email',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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

          <FormField
            control={form.control}
            name="password"
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Forgot Password link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="text-right">
            <Link
              to="/signup"
              className="text-sm text-blue-600 hover:underline"
            >
              Don't have an account? Sign up
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sign In....' : 'Sign In'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignIn;
