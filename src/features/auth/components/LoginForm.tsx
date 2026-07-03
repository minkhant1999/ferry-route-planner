import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from 'antd';
import { AppButton, FormInput } from '@/components';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/authSchema';
import { clearAuthError, loginUser } from '@/store/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const authError = useAppSelector((state) => state.auth.error);

  const from = (location.state as { from?: string } | null)?.from;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (!user) return;
    const destination =
      from ?? (user.role === 'owner' ? '/cms' : '/');
    navigate(destination, { replace: true });
  }, [user, navigate, from]);

  const onSubmit = handleSubmit((values) => {
    dispatch(clearAuthError());
    dispatch(loginUser(values));
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {authError ? <Alert type="error" showIcon message={authError} /> : null}

      <FormInput
        control={control}
        name="email"
        id="login-email"
        label="Email"
        error={errors.email?.message}
        autoComplete="email"
      />

      <FormInput
        password
        control={control}
        name="password"
        id="login-password"
        label="Password"
        error={errors.password?.message}
        autoComplete="current-password"
      />

      <AppButton type="primary" htmlType="submit" loading={isSubmitting} block>
        Log in
      </AppButton>

      <p className="text-center text-sm text-slate-600">
        No account?{' '}
        <Link to="/register" className="font-medium text-blue-600">
          Register
        </Link>
      </p>
    </form>
  );
}
