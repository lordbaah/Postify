import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { useAuthToast } from '@/hooks/useAuthToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { forgotPassword } = useAuthStore();
  const navigate = useNavigate();

  useAuthToast();

  const resetPassword = async (data: ForgotPasswordData) => {
    console.log('Forgot password request:', data.email);

    const result = await forgotPassword(data.email);

    if (result.success) {
      reset();
      navigate('/reset-password', { state: { email: data.email } });
      setTimeout(() => {
        navigate('/reset-password', { state: { email: data.email } });
      }, 1500);
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit(resetPassword)}>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            {...register('email')}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <Button type="submit">Send Reset Code</Button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
