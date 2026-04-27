import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getMyProfile, updateMyProfile, uploadPhoto, type UserProfile } from "../lib/api";
import { useAuth } from "../store/AuthContext";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (err: any) {
        setError("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const updated = await updateMyProfile({
        name: profile.name,
        country: profile.country,
        city: profile.city,
        age: profile.age,
      });
      setProfile(updated);
      // Also update auth context so the header refreshes
      if (user) {
        setUser({ ...user, name: updated.name });
      }
      setSuccess(true);
    } catch (err: any) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const url = await uploadPhoto(file);
      const updated = await updateMyProfile({ photoURL: url });
      setProfile(updated);
      if (user) {
        setUser({ ...user, photoURL: url });
      }
    } catch (err: any) {
      setError("Failed to upload photo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-ink-100 bg-white p-8 shadow-soft"
      >
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink-900">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Update your personal details and account information.
        </p>

        <form onSubmit={handleSave} className="mt-8 space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {profile?.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.name}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-brand-100"
                />
              ) : (
                <div 
                  className="grid h-20 w-20 place-items-center rounded-full text-2xl font-bold text-white shadow-inner"
                  style={{ background: user?.avatarColor ?? "#4f46e5" }}
                >
                  {(profile?.name?.[0] ?? "U").toUpperCase()}
                </div>
              )}
              <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-brand-600 p-1.5 text-white shadow-pop hover:bg-brand-700">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div>
              <div className="text-sm font-bold text-ink-900">{profile?.name}</div>
              <div className="text-xs text-ink-500">{profile?.email}</div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                Full Name
              </label>
              <input
                type="text"
                value={profile?.name ?? ""}
                onChange={(e) => setProfile(p => p ? { ...p, name: e.target.value } : null)}
                className="w-full rounded-xl border border-ink-100 bg-ink-50/50 px-4 py-2.5 text-sm transition focus:border-brand-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                Email Address
              </label>
              <input
                type="email"
                value={profile?.email ?? ""}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-ink-100 bg-ink-50/30 px-4 py-2.5 text-sm text-ink-400 opacity-70"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                Country
              </label>
              <input
                type="text"
                value={profile?.country ?? ""}
                onChange={(e) => setProfile(p => p ? { ...p, country: e.target.value } : null)}
                placeholder="e.g. United States"
                className="w-full rounded-xl border border-ink-100 bg-ink-50/50 px-4 py-2.5 text-sm transition focus:border-brand-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                City
              </label>
              <input
                type="text"
                value={profile?.city ?? ""}
                onChange={(e) => setProfile(p => p ? { ...p, city: e.target.value } : null)}
                placeholder="e.g. New York"
                className="w-full rounded-xl border border-ink-100 bg-ink-50/50 px-4 py-2.5 text-sm transition focus:border-brand-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                Age
              </label>
              <input
                type="number"
                value={profile?.age ?? ""}
                onChange={(e) => setProfile(p => p ? { ...p, age: parseInt(e.target.value) || null } : null)}
                className="w-full rounded-xl border border-ink-100 bg-ink-50/50 px-4 py-2.5 text-sm transition focus:border-brand-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-600">
              Profile updated successfully!
            </div>
          )}

          <div className="flex items-center justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-pop transition hover:bg-brand-700 disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
