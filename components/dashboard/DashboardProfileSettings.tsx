"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { parseApiError } from "@/app/lib/authClient";
import {
  changePassword,
  fetchNotificationPreferences,
  fetchProfileSettings,
  NotificationPreferences,
  updateNotificationPreferences,
  updateProfileSettings,
} from "@/app/lib/profileClient";

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
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  mobileNumber: "",
  whatsappNumber: "",
  location: "",
};

const initialPreferences: PreferenceState = {
  orderUpdates: true,
  priceAlerts: true,
  announcements: true,
  whatsappNotifications: false,
};

const toPreferenceState = (prefs: NotificationPreferences): PreferenceState => ({
  orderUpdates: prefs.order_updates,
  priceAlerts: prefs.price_alerts,
  announcements: prefs.announcements,
  whatsappNotifications: prefs.whatsapp_notifications,
});

const DashboardProfileSettings = () => {
  const [profile, setProfile] = useState<ProfileFormState>(initialProfile);
  const [preferences, setPreferences] = useState<PreferenceState>(initialPreferences);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [preferencesMessage, setPreferencesMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const initials = useMemo(() => {
    const first = profile.firstName.trim().charAt(0);
    const last = profile.lastName.trim().charAt(0);
    return `${first}${last}`.trim() || "CU";
  }, [profile.firstName, profile.lastName]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    const profileResult = await fetchProfileSettings()
      .then((data) => {
        setProfile({
          firstName: data.first_name,
          lastName: data.last_name,
          username: data.username,
          email: data.email,
          mobileNumber: data.mobile_number,
          whatsappNumber: data.whatsapp_number,
          location: data.location,
        });
        return null;
      })
      .catch((error) => parseApiError(error, "Unable to load your profile right now."));

    const preferenceResult = await fetchNotificationPreferences()
      .then((data) => {
        setPreferences(toPreferenceState(data));
        return null;
      })
      .catch((error) => parseApiError(error, "Unable to load notification preferences."));

    if (profileResult) {
      setLoadError(profileResult.message);
    }

    if (!profileResult && preferenceResult) {
      setPreferencesMessage(preferenceResult.message);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileMessage("");

    try {
      const updated = await updateProfileSettings({
        first_name: profile.firstName.trim(),
        last_name: profile.lastName.trim(),
        username: profile.username.trim(),
        email: profile.email.trim(),
        mobile_number: profile.mobileNumber.trim(),
        whatsapp_number: profile.whatsappNumber.trim() || null,
        location: profile.location.trim(),
      });

      setProfile({
        firstName: updated.first_name,
        lastName: updated.last_name,
        username: updated.username,
        email: updated.email,
        mobileNumber: updated.mobile_number,
        whatsappNumber: updated.whatsapp_number,
        location: updated.location,
      });
      setProfileMessage("Profile details saved successfully.");
    } catch (error) {
      const parsed = parseApiError(error, "Unable to save profile details.");
      setProfileMessage(parsed.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePreferencesSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setPreferencesSaving(true);
    setPreferencesMessage("");

    try {
      const updated = await updateNotificationPreferences({
        order_updates: preferences.orderUpdates,
        price_alerts: preferences.priceAlerts,
        announcements: preferences.announcements,
        whatsapp_notifications: preferences.whatsappNotifications,
      });

      setPreferences(toPreferenceState(updated));
      setPreferencesMessage("Notification preferences updated.");
    } catch (error) {
      const parsed = parseApiError(error, "Unable to update notification preferences.");
      setPreferencesMessage(parsed.message);
    } finally {
      setPreferencesSaving(false);
    }
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

    try {
      const response = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage(response.message);
    } catch (error) {
      const parsed = parseApiError(error, "Unable to update password.");
      setPasswordError(parsed.message);
    } finally {
      setPasswordSaving(false);
    }
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
        <p className="mt-2 max-w-3xl text-sm text-primary/80">Update your profile, notification preferences, and account security settings.</p>
      </header>

      {loadError ? (
        <p className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{loadError}</p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={handleProfileSave} className="rounded-2xl border border-secondary/25 bg-white p-5">
          <div className="mb-5 flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary/30 bg-primary text-lg font-black text-white"
              aria-hidden="true"
            >
              {initials}
            </div>
            <div>
              <p className="text-base font-black text-primary">
                {profile.firstName || "Customer"} {profile.lastName}
              </p>
              <p className="text-sm text-primary/80">{profile.email || "No email loaded"}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">First Name</span>
              <input
                value={profile.firstName}
                onChange={(event) => setProfile((prev) => ({ ...prev, firstName: event.target.value }))}
                disabled={isLoading}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">Last Name</span>
              <input
                value={profile.lastName}
                onChange={(event) => setProfile((prev) => ({ ...prev, lastName: event.target.value }))}
                disabled={isLoading}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">Username</span>
              <input
                value={profile.username}
                onChange={(event) => setProfile((prev) => ({ ...prev, username: event.target.value }))}
                disabled={isLoading}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                disabled={isLoading}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">Mobile Number</span>
              <input
                value={profile.mobileNumber}
                onChange={(event) => setProfile((prev) => ({ ...prev, mobileNumber: event.target.value }))}
                disabled={isLoading}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-secondary">WhatsApp Number (Optional)</span>
              <input
                value={profile.whatsappNumber}
                onChange={(event) => setProfile((prev) => ({ ...prev, whatsappNumber: event.target.value }))}
                disabled={isLoading}
                className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
              />
            </label>
          </div>

          <label className="mt-3 flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wide text-secondary">Location / Town</span>
            <input
              value={profile.location}
              onChange={(event) => setProfile((prev) => ({ ...prev, location: event.target.value }))}
              disabled={isLoading}
              className="h-11 rounded-xl border border-secondary/35 px-3 text-sm text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
            />
          </label>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={profileSaving || isLoading}
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
                      disabled={isLoading}
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
                disabled={preferencesSaving || isLoading}
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
