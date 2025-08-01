import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .max(30, { message: 'Password must be at most 30 characters.' }),
});

type SignInData = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { signin, isLoading } = useAuthStore();
  const navigate = useNavigate();
  useAuthToast();
  usePageTitle('SignIn');

  const handleSignIn = async (data: SignInData) => {
    const result = await signin(data);
    // console.log('Sign in attempt:', data);

    if (result.success) {
      form.reset();
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6 text-center">Sign In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignIn)} className="grid gap-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage /> {/* Shows Zod validation message */}
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage /> {/* Shows Zod validation message */}
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Signing In.....' : 'Sign In'}
          </Button>
        </form>
      </Form>

      {/* Links */}
      <div className="mt-4 flex justify-between text-sm">
        <Link to="/signup" className="text-blue-500 hover:underline">
          Don't Have an Account?
        </Link>
        <Link to="/forgot-password" className="text-blue-500 hover:underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;
