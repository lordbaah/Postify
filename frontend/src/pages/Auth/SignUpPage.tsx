import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthToast } from '@/hooks/useAuthToast';

const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, {
        message: 'First name must be at least 2 characters.',
      })
      .max(50, {
        message: 'First name must be at most 50 characters.',
      }),

    lastName: z
      .string()
      .min(2, {
        message: 'Last name must be at least 2 characters.',
      })
      .max(50, {
        message: 'Last name must be at most 50 characters.',
      }),

    userName: z
      .string()
      .min(2, {
        message: 'Username must be at least 2 characters.',
      })
      .max(50, {
        message: 'Username must be at most 50 characters.',
      }),

    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),

    password: z
      .string()
      .min(6, {
        message: 'Password must be at least 6 characters.',
      })
      .max(30, {
        message: 'Password must be at most 30 characters.',
      }),

    confirmPassword: z
      .string()
      .min(6, {
        message: 'Confirm password must be at least 6 characters.',
      })
      .max(30, {
        message: 'Confirm password must be at most 30 characters.',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

// same as interface
type signUpData = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<signUpData>({
    resolver: zodResolver(signUpSchema),
  });

  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useAuthToast();

  const handleSignUp = async (data: signUpData) => {
    const { confirmPassword, ...payload } = data; // 🧹 Exclude confirmPassword

    const result = await signup(payload);
    console.log('Sign in attempt:', data);
    console.log('Submitted payload:', payload);

    if (result.success) {
      reset();
      // navigate('/verify-email', { state: { email: data.email } });
      setTimeout(() => {
        navigate('/verify-email', { state: { email: data.email } });
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div>
        <h1> Sign For an Account</h1>
        <form onSubmit={handleSubmit(handleSignUp)}>
          <div>
            <Label>first name</Label>
            <Input
              type="text"
              placeholder="enter fisrt name"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <Label>Last name</Label>
            <Input
              type="text"
              placeholder="enter Last name"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <Label>UserName</Label>
            <Input
              type="text"
              placeholder="enter user name"
              {...register('userName')}
            />
            {errors.userName && (
              <p className="text-red-500">{errors.userName.message}</p>
            )}
          </div>

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
              placeholder="enter password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              placeholder="enter password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button disabled={isLoading} type="submit">
            {isLoading ? 'Signing Up.....' : 'Sign Up'}
          </Button>
        </form>

        <Link to="/signin">Have an Account?</Link>
      </div>
    </div>
  );
};

export default SignUpPage;
