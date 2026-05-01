import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
          ← Back to Nano Resume
        </Link>

        <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-ink-500">Last updated: May 1, 2026</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-700">
            <section>
              <h2 className="text-lg font-bold text-ink-900">Information We Collect</h2>
              <p className="mt-2">
                We collect information you provide directly, such as your account details and resume content. We may also
                collect basic usage data like browser type, pages visited, and device information to improve product
                performance and reliability.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink-900">How We Use Information</h2>
              <p className="mt-2">
                Your information is used to provide, maintain, and improve Nano Resume. This includes saving your resumes,
                enabling sharing links, providing customer support, and preventing abuse or security incidents.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink-900">Data Sharing</h2>
              <p className="mt-2">
                We do not sell your personal information. We may share data with trusted service providers that help us run
                the platform (for example hosting, analytics, or authentication), under strict confidentiality terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink-900">Data Retention</h2>
              <p className="mt-2">
                We retain account and resume data while your account is active, or as needed for legal and operational
                obligations. You can request deletion of your account and associated data through our contact page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink-900">Your Rights</h2>
              <p className="mt-2">
                Depending on your location, you may have rights to access, correct, export, or delete your personal data.
                To make a request, please reach out through our contact page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink-900">Contact</h2>
              <p className="mt-2">
                For privacy-related questions, visit the <Link to="/contact" className="text-brand-700 hover:underline">Contact</Link>{" "}
                page and include "Privacy Request" in your message.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
