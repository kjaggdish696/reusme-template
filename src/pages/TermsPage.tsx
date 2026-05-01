import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
          ← Back to Nano Resume
        </Link>

        <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-ink-500">Last updated: May 1, 2026</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-700">
            <section>
              <h2 className="text-lg font-bold text-ink-900">Acceptance of Terms</h2>
              <p className="mt-2">
                By using Nano Resume, you agree to these Terms of Service. If you do not agree, please do not use the
                platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink-900">Account Responsibilities</h2>
              <p className="mt-2">
                You are responsible for keeping your account credentials secure and for all activity under your account.
                You agree to provide accurate information and keep it up to date.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink-900">Acceptable Use</h2>
              <p className="mt-2">
                You may not use the service to upload unlawful, abusive, or harmful content, attempt unauthorized access,
                or interfere with service stability and security.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink-900">Your Content</h2>
              <p className="mt-2">
                You retain ownership of the resumes and content you create. You grant us a limited license to process that
                content only to operate and improve the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink-900">Service Availability</h2>
              <p className="mt-2">
                We aim for reliable uptime but cannot guarantee uninterrupted service. Features may change over time as we
                improve Nano Resume.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink-900">Limitation of Liability</h2>
              <p className="mt-2">
                To the fullest extent permitted by law, Nano Resume is provided "as is" without warranties. We are not
                liable for indirect, incidental, or consequential damages arising from use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink-900">Contact</h2>
              <p className="mt-2">
                Questions about these terms can be submitted through our <Link to="/contact" className="text-brand-700 hover:underline">Contact</Link>{" "}
                page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
