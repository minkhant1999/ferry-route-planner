import { Card } from 'antd';
import { RegisterForm } from '@/features/auth';

export function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4 py-12 sm:px-6">
      <Card title="Create your account" className="app-card w-full shadow-sm">
        <p className="mb-4 text-sm text-slate-600">
          Choose <strong>Customer</strong> to browse and book, or <strong>Owner</strong> to manage
          a service in your CMS at <code className="text-xs">/cms</code>.
        </p>
        <RegisterForm />
      </Card>
    </div>
  );
}
