import { Link } from "react-router-dom";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
          ← Back to Nano Resume
        </Link>

        <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Contact Us</h1>
          <p className="mt-2 text-sm text-ink-500">
            We would love to hear from you. Reach out for support, partnerships, feedback, or privacy requests.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">General Support</div>
              <p className="mt-2 text-sm text-ink-700">support@nanoresume.com</p>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">Business & Partnerships</div>
              <p className="mt-2 text-sm text-ink-700">partnerships@nanoresume.com</p>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">Phone</div>
              <p className="mt-2 text-sm text-ink-700">+91 98765 43210</p>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-ink-50 p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">Office Hours</div>
              <p className="mt-2 text-sm text-ink-700">Mon - Fri, 9:00 AM to 6:00 PM IST</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-brand-100 bg-brand-50 p-5 text-sm text-brand-900">
            For privacy or data deletion requests, include your account email and write "Privacy Request" in your subject
            line so our team can prioritize it quickly.
          </div>
        </div>
      </div>
    </div>
  );
}
