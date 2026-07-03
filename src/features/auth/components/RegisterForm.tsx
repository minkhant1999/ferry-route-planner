import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'antd';
import { AppButton, FormInput, FormSelect } from '@/components';
import {
  registerSchema,
  type RegisterFormValues,
  OWNER_SERVICE_OPTIONS,
} from '@/features/auth/schemas/authSchema';
import { REGISTER_ROLE_OPTIONS } from '@/types/auth';
import { clearAuthError, registerUser } from '@/store/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const authError = useAppSelector((state) => state.auth.error);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
      ownerServiceId: '',
    },
  });

  const role = useWatch({ control, name: 'role' });

  useEffect(() => {
    if (!user) return;
    const destination = user.role === 'owner' ? '/cms' : '/';
    navigate(destination, { replace: true });
  }, [user, navigate]);

  const onSubmit = handleSubmit((values) => {
    dispatch(clearAuthError());
    dispatch(
      registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        ownerServiceId: values.role === 'owner' ? values.ownerServiceId : undefined,
      }),
    );
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {authError ? <Alert type="error" showIcon message={authError} /> : null}

      <FormInput
        control={control}
        name="name"
        id="register-name"
        label="Full name"
        error={errors.name?.message}
        autoComplete="name"
      />

      <FormInput
        control={control}
        name="email"
        id="register-email"
        label="Email"
        error={errors.email?.message}
        autoComplete="email"
      />

      <FormSelect
        control={control}
        name="role"
        id="register-role"
        label="Account type"
        options={REGISTER_ROLE_OPTIONS}
        error={errors.role?.message}
      />

      {role === 'owner' ? (
        <FormSelect
          control={control}
          name="ownerServiceId"
          id="register-owner-service"
          label="Service you provide"
          options={OWNER_SERVICE_OPTIONS}
          placeholder="Select your service"
          error={errors.ownerServiceId?.message}
        />
      ) : null}

      <FormInput
        password
        control={control}
        name="password"
        id="register-password"
        label="Password"
        error={errors.password?.message}
        autoComplete="new-password"
      />

      <FormInput
        password
        control={control}
        name="confirmPassword"
        id="register-confirm-password"
        label="Confirm password"
        error={errors.confirmPassword?.message}
        autoComplete="new-password"
      />

      <AppButton type="primary" htmlType="submit" loading={isSubmitting} block>
        Create account
      </AppButton>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600">
          Log in
        </Link>
      </p>
    </form>
  );
}
