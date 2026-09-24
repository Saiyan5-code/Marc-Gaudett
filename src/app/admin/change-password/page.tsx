"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Redirect back to dashboard after a short delay
        setTimeout(() => router.push("/admin"), 2000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin"
          className="text-sm text-[#6B6861] hover:text-black transition-colors font-sans"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white border border-[#c5c1b9] shadow-sm p-10">
        <h2 className="font-georgia text-3xl mb-2 text-[#171714]">
          Change Password
        </h2>
        <p className="text-[#6B6861] text-sm mb-8 font-sans">
          Update the admin dashboard password below.
        </p>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-4 text-sm font-sans">
            ✓ Password updated successfully. Redirecting to dashboard…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6861] mb-2 font-sans">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-[#c5c1b9] p-3 text-sm font-sans focus:outline-none focus:border-black transition-colors bg-transparent"
                required
                autoComplete="current-password"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6861] mb-2 font-sans">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-[#c5c1b9] p-3 text-sm font-sans focus:outline-none focus:border-black transition-colors bg-transparent"
                required
                autoComplete="new-password"
                minLength={6}
              />
              <p className="text-xs text-[#6B6861] mt-1 font-sans">
                Minimum 6 characters.
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B6861] mb-2 font-sans">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-[#c5c1b9] p-3 text-sm font-sans focus:outline-none focus:border-black transition-colors bg-transparent"
                required
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-sans">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white p-3 font-semibold text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-400 font-sans"
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
              <Link
                href="/admin"
                className="px-5 py-3 border border-[#c5c1b9] text-sm font-semibold text-[#171714] hover:bg-[#f0efeb] transition-colors font-sans"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
