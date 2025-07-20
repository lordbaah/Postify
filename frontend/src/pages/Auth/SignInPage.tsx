import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthToast } from '@/hooks/useAuthToast';

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .max(30, { message: 'Password must be at most 30 characters.' }),
});

type SignInData = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  const { signin, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useAuthToast();

  const handleSignIn = async (data: SignInData) => {
    const result = await signin(data);
    console.log('Sign in attempt:', data);

    if (result.success) {
      reset();
      // navigate('/');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <div>
      <div>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter Email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter Password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button disabled={isLoading} type="submit">
            {isLoading ? 'Signing In.....' : 'Sign In'}
          </Button>
        </form>
        <Link to="/signin">Have an Account?</Link>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default SignInPage;
