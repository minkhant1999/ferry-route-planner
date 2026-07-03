import { Card } from 'antd';

export function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Contact us</h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        Questions about a service or your account? Reach out — we are happy to help.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card className="app-card shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Email</p>
          <a
            href="mailto:support@servicehub.example"
            className="mt-2 block text-blue-600"
          >
            support@servicehub.example
          </a>
        </Card>
        <Card className="app-card shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Phone</p>
          <a href="tel:+959000000000" className="mt-2 block text-blue-600">
            +95 9 000 000 000
          </a>
        </Card>
      </div>

      <Card className="app-card mt-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Office hours</p>
        <p className="mt-2 text-sm text-slate-600">Monday – Saturday, 9:00 AM – 6:00 PM</p>
      </Card>
    </div>
  );
}
