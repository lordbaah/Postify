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

import { useAuthStore } from '@/store/authStore';

const Signup = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const { signup, isLoading, success, error } = useAuthStore();

  const handleSignUp = async (data) => {
    try {
      await signup(data);

      form.reset();

      setTimeout(() => {
        navigate('/verify-email');
      }, 3000);
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <section>
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              rules={{ required: 'First name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              rules={{ required: 'Last name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userName"
              rules={{ required: 'Username is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Must be at least 6 characters',
                },
              }}
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

            <div className="text-right">
              <Link
                to="/signin"
                className="text-sm text-blue-600 hover:underline"
              >
                Already have an account? Sign In
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing Up....' : 'Sign Up'}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default Signup;
