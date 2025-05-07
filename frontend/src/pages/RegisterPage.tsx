import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { useAuthStore } from '../store/auth.store';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, error: authError, isLoading: authLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      await registerUser(data.email, data.password, data.name);
      navigate('/chat');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors;
        const errorMessages = validationErrors.map((err: any) => err.message).join(', ');
        setError(errorMessages);
      } else {
        setError(
          error.response?.data?.message || 
          error.message || 
          'Failed to register. Please try again.'
        );
      }
    }
  };

  // Google sign up handler (placeholder)
  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth logic
    alert('Google sign up coming soon!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F2] py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white/80 rounded-2xl p-8 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-bold text-center font-serif mb-2">Create your account</h2>
          <p className="text-md text-gray-600 mb-6 text-center">Sign up to get started</p>
        </div>
        <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
            error={errors.name?.message}
          />
          <Input
            label="Email address"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={errors.password?.message}
          />
          {(error || authError) && (
            <div className="text-red-600 text-sm text-center">{error || authError}</div>
          )}
          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={authLoading}
            variant="primary"
            size="md"
          >
            Register
          </Button>
        </form>
        <div className="flex items-center my-4 w-full">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <Button
          type="button"
          variant="secondary"
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-[#3B2F1E] font-medium text-base py-2"
          onClick={handleGoogleSignup}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.71 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.19 5.6C43.99 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.13a14.5 14.5 0 0 1 0-8.26l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.56l7.98-6.43z"/><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.59l-7.19-5.6c-2.01 1.35-4.6 2.15-7.96 2.15-6.38 0-11.87-3.63-13.33-8.56l-7.98 6.43C6.71 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Sign up with Google
        </Button>
        <div className="mt-6 text-center w-full">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-[#FFD600] font-semibold hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}; 