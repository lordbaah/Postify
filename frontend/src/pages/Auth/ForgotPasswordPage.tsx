import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { forgotPassword } = useAuthStore();
  const navigate = useNavigate();
  useAuthToast();

  const resetPassword = async (data: ForgotPasswordData) => {
    console.log('Forgot password request:', data.email);

    const result = await forgotPassword(data.email);

    if (result.success) {
      form.reset();
      setTimeout(() => {
        navigate('/reset-password', { state: { email: data.email } });
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Forgot Password
        </h1>
        <p>Enter your email address to receive a password reset code.</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(resetPassword)}
          className="grid gap-6"
        >
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
                <FormMessage /> {/* Displays Zod validation messages */}
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Send Reset Code
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordPage;
