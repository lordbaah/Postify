import { useForm } from 'react-hook-form';
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
import apiInstance from '@/services/api';

export default function Signup() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
    },
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      // POST to your backend's actual endpoint
      const response = await apiInstance.post('/auth/signup', {
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        email: data.email,
        password: data.password,
      });

      console.log('Signup success:', response.data);

      // setSuccessMessage('Account created successfully!');
      setSuccessMessage(`${response.data?.message}`);
      setErrorMessage('');
      form.reset();

      // Optionally store token and redirect:
      // localStorage.setItem("token", response.data.token);
      // window.location.href = "/dashboard";
    } catch (error) {
      console.error('Signup failed:', error);
      setSuccessMessage('');
      setErrorMessage(
        error?.response?.data?.message || 'Something went wrong. Try again.'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>

      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields same as before... */}
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
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </Form>
    </div>
  );
}
