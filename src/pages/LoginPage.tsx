import { useLocation } from 'react-router-dom';
import { Alert, Card } from 'antd';
import { LoginForm } from '@/features/auth';

export function LoginPage() {
  const location = useLocation();
  const state = location.state as {
    intent?: string;
    listingTitle?: string;
  } | null;

  const intentMessage =
    state?.listingTitle && state.intent === 'book'
      ? `Log in to book “${state.listingTitle}”.`
      : state?.listingTitle && state.intent === 'call'
        ? `Log in to call the provider for “${state.listingTitle}”.`
        : state?.listingTitle && state.intent === 'request'
          ? `Log in to request “${state.listingTitle}”.`
          : null;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-12 sm:px-6">
      <Card title="Log in" className="app-card w-full shadow-sm">
        {intentMessage ? (
          <Alert type="info" showIcon message={intentMessage} className="!mb-4" />
        ) : null}
        <LoginForm />
      </Card>
    </div>
  );
}
