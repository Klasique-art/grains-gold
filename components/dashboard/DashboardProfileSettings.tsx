"use client";

import { useState } from "react";

type ProfileFormState = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobileNumber: string;
  whatsappNumber: string;
  location: string;
};

type PreferenceState = {
  orderUpdates: boolean;
  priceAlerts: boolean;
  announcements: boolean;
  whatsappNotifications: boolean;
};

const initialProfile: ProfileFormState = {
  firstName: "John",
  lastName: "Doe",
  username: "john_doe",
  email: "john@example.com",
  mobileNumber: "+233241234567",
  whatsappNumber: "+233241234567",
  location: "Accra",
};

const initialPreferences: PreferenceState = {
  orderUpdates: true,
  priceAlerts: true,
  announcements: true,
  whatsappNotifications: false,
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DashboardProfileSettings = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [preferencesMessage, setPreferencesMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileMessage("");
    await wait(900);
    setProfileSaving(false);
    setProfileMessage("Profile details saved successfully (simulated).");
  };

  const handlePreferencesSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setPreferencesSaving(true);
    setPreferencesMessage("");
    await wait(800);
    setPreferencesSaving(false);
    setPreferencesMessage("Notification preferences updated (simulated).");
  };

  const handlePasswordUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password must match.");
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword) || newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters and include uppercase, lowercase, and number.");
      return;
    }

    setPasswordSaving(true);
    await wait(1000);
    setPasswordSaving(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("Password updated successfully (simulated).");
  };

  return (
    <section className="dash-page" aria-labelledby="profile-settings-title">
      <header className="mb-6">
        <p className="inline-flex rounded-full border border-secondary/30 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.13em] text-secondary">
          Customer Profile Settings
        </p>
        <h1 id="profile-settings-title" className="mt-3 text-2xl font-black text-primary sm:text-3xl">
          Manage Your Profile
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-primary/80">
          This page is simulated for frontend now. Save actions mimic backend responses and will be connected to real
          endpoints later.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={handleProfileSave} className="rounded-2xl border border-secondary/25 bg-white p-5">
          <div className="mb-5 flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary/30 bg-primary text-lg font-black text-white"
              aria-hidden="true"
            >
              {profile.firstName.charAt(0)}
              {profile.lastName.charAt(0)}
            </div>
            <div>
              <p className="text-base font-black text-primary">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-sm text-primary/80">{profile.email}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">First Name</span>
              <input
                value={profile.firstName}
                onChange={(event) => setProfile((prev) => ({ ...prev, firstName: event.target.value }))}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">Last Name</span>
              <input
                value={profile.lastName}
                onChange={(event) => setProfile((prev) => ({ ...prev, lastName: event.target.value }))}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">Username</span>
              <input
                value={profile.username}
                onChange={(event) => setProfile((prev) => ({ ...prev, username: event.target.value }))}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">Mobile Number</span>
              <input
                value={profile.mobileNumber}
                onChange={(event) => setProfile((prev) => ({ ...prev, mobileNumber: event.target.value }))}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">WhatsApp Number (Optional)</span>
              <input
                value={profile.whatsappNumber}
                onChange={(event) => setProfile((prev) => ({ ...prev, whatsappNumber: event.target.value }))}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
          </div>

          <label className="mt-3 flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Location / Town</span>
            <input
              value={profile.location}
              onChange={(event) => setProfile((prev) => ({ ...prev, location: event.target.value }))}
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            />
          </label>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={profileSaving}
              className="rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              {profileSaving ? "Saving..." : "Save Profile"}
            </button>
            {profileMessage ? <p className="text-sm font-semibold text-secondary">{profileMessage}</p> : null}
          </div>
        </form>

        <div className="grid gap-4">
          <form onSubmit={handlePreferencesSave} className="rounded-2xl border border-secondary/25 bg-white p-5">
            <h2 className="text-lg font-black text-primary">Notification Preferences</h2>
            <div className="mt-3 space-y-2">
              {[
                { key: "orderUpdates", label: "Order updates" },
                { key: "priceAlerts", label: "Price alert notifications" },
                { key: "announcements", label: "Announcements and news" },
                { key: "whatsappNotifications", label: "WhatsApp notifications" },
              ].map((item) => {
                const prefKey = item.key as keyof PreferenceState;
                return (
                  <label key={item.key} className="flex items-center gap-2 rounded-lg border border-secondary/20 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={preferences[prefKey]}
                      onChange={(event) =>
                        setPreferences((prev) => ({
                          ...prev,
                          [prefKey]: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-sm font-semibold text-primary">{item.label}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={preferencesSaving}
                className="rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              >
                {preferencesSaving ? "Updating..." : "Save Preferences"}
              </button>
              {preferencesMessage ? <p className="text-sm font-semibold text-secondary">{preferencesMessage}</p> : null}
            </div>
          </form>

          <form onSubmit={handlePasswordUpdate} className="rounded-2xl border border-secondary/25 bg-white p-5">
            <h2 className="text-lg font-black text-primary">Security</h2>
            <p className="mt-1 text-xs text-primary/75">Update your password with secure rules.</p>

            <div className="mt-3 space-y-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wide text-secondary">Current Password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wide text-secondary">New Password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wide text-secondary">Confirm Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
                />
              </label>
            </div>

            {passwordError ? (
              <p className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {passwordError}
              </p>
            ) : null}
            {passwordMessage ? (
              <p className="mt-3 rounded-lg border border-secondary/35 bg-accent/20 px-3 py-2 text-sm font-semibold text-primary">
                {passwordMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={passwordSaving}
              className="mt-4 rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            >
              {passwordSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DashboardProfileSettings;
