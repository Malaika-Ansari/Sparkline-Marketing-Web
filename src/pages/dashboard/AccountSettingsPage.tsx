/**
 * User Account Profile & Settings Page
 * Sparkline Marketing Intelligence Platform — Phase 21
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { TextInput, SelectInput } from '@/components/common/Form';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Feedback';
import { auditService, AuditLogEntry } from '@/services/audit.service';
import { securityService } from '@/services/security.service';
import {
  User,
  Mail,
  Building,
  Briefcase,
  KeyRound,
  ShieldCheck,
  Save,
  LogOut,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  Download,
  Trash2,
  Activity,
  AlertTriangle,
} from 'lucide-react';

const CURRENCY_OPTIONS = [
  { label: 'USD ($) — United States Dollar', value: 'USD' },
  { label: 'EUR (€) — Euro', value: 'EUR' },
  { label: 'GBP (£) — British Pound', value: 'GBP' },
  { label: 'CAD (C$) — Canadian Dollar', value: 'CAD' },
  { label: 'AUD (A$) — Australian Dollar', value: 'AUD' },
  { label: 'JPY (¥) — Japanese Yen', value: 'JPY' },
  { label: 'PKR (₨) — Pakistani Rupee', value: 'PKR' },
  { label: 'INR (₹) — Indian Rupee', value: 'INR' },
  { label: 'AED (د.إ) — UAE Dirham', value: 'AED' },
  { label: 'SAR (﷼) — Saudi Riyal', value: 'SAR' },
  { label: 'SGD (S$) — Singapore Dollar', value: 'SGD' },
];

const TIMEZONE_OPTIONS = [
  { label: 'America/New_York (Eastern Time - UTC-5)', value: 'America/New_York (EST)' },
  { label: 'America/Chicago (Central Time - UTC-6)', value: 'America/Chicago (CST)' },
  { label: 'America/Denver (Mountain Time - UTC-7)', value: 'America/Denver (MST)' },
  { label: 'America/Los_Angeles (Pacific Time - UTC-8)', value: 'America/Los_Angeles (PST)' },
  { label: 'Europe/London (GMT / BST - UTC+0)', value: 'Europe/London (GMT)' },
  { label: 'Europe/Berlin (Central European Time - UTC+1)', value: 'Europe/Berlin (CET)' },
  { label: 'Asia/Dubai (Gulf Standard Time - UTC+4)', value: 'Asia/Dubai (GST)' },
  { label: 'Asia/Karachi (Pakistan Standard Time - UTC+5)', value: 'Asia/Karachi (PKT)' },
  { label: 'Asia/Kolkata (India Standard Time - UTC+5:30)', value: 'Asia/Kolkata (IST)' },
  { label: 'Asia/Singapore (Singapore Time - UTC+8)', value: 'Asia/Singapore (SGT)' },
  { label: 'Asia/Tokyo (Japan Standard Time - UTC+9)', value: 'Asia/Tokyo (JST)' },
];

const LANGUAGE_OPTIONS = [
  { label: 'English (United States)', value: 'English' },
  { label: 'English (United Kingdom)', value: 'English (UK)' },
  { label: 'Spanish / Español', value: 'Spanish' },
  { label: 'German / Deutsch', value: 'German' },
  { label: 'French / Français', value: 'French' },
  { label: 'Urdu / اردو', value: 'Urdu' },
];

const COUNTRY_OPTIONS = [
  { label: 'United States', value: 'United States' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Germany', value: 'Germany' },
  { label: 'France', value: 'France' },
  { label: 'Pakistan', value: 'Pakistan' },
  { label: 'India', value: 'India' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'Saudi Arabia', value: 'Saudi Arabia' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Other Country', value: 'Other' },
];

export const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, signOut, providerStatus } = useAuth();
  const { addToast } = useToast();

  // Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || '');
  const [country, setCountry] = useState(user?.country || 'United States');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'English');
  const [preferredCurrency, setPreferredCurrency] = useState(user?.preferredCurrency || 'USD');
  const [timeZone, setTimeZone] = useState(user?.timeZone || 'America/New_York (EST)');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Privacy, Data Export & Deletion State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    if (user?.id) {
      setAuditLogs(auditService.getLogs({ userId: user.id, limit: 5 }));
    }
  }, [user?.id]);

  const handleExportData = () => {
    if (!user) return;
    const { filename, jsonContent } = securityService.exportAllUserData(user.id);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      title: 'Data Export Generated',
      message: 'Your personal workspace archive was exported as JSON.',
      type: 'success',
    });
    setAuditLogs(auditService.getLogs({ userId: user.id, limit: 5 }));
  };

  const handlePurgeAccount = () => {
    if (!user) return;
    const result = securityService.purgeUserAccount(user.id, deleteInput);
    if (!result.success) {
      addToast({
        title: 'Action Blocked',
        message: result.error || 'Account deletion failed.',
        type: 'error',
      });
      return;
    }
    addToast({
      title: 'Account Permanently Deleted',
      message: 'All private projects and session records have been purged.',
      type: 'info',
    });
    navigate('/signup');
  };

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setCompanyName(user.companyName || '');
      setJobTitle(user.jobTitle || '');
      setCountry(user.country || 'United States');
      setPreferredLanguage(user.preferredLanguage || 'English');
      setPreferredCurrency(user.preferredCurrency || 'USD');
      setTimeZone(user.timeZone || 'America/New_York (EST)');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      addToast({
        title: 'Validation Error',
        message: 'Full Name cannot be empty.',
        type: 'error',
      });
      return;
    }

    setIsSavingProfile(true);
    try {
      await updateProfile({
        fullName,
        companyName,
        jobTitle,
        country,
        preferredLanguage,
        preferredCurrency,
        timeZone,
        avatarUrl,
      });

      addToast({
        title: 'Profile Updated',
        message: 'Your account preferences and profile details have been saved.',
        type: 'success',
      });
    } catch (err: any) {
      addToast({
        title: 'Update Failed',
        message: err.message || 'Could not update profile information.',
        type: 'error',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        addToast({
          title: 'Password Changed',
          message: 'Your account password was updated successfully.',
          type: 'success',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.error || 'Failed to update password.');
      }
    } catch (err: any) {
      setPasswordError(err.message || 'An error occurred.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    addToast({
      title: 'Signed Out',
      message: 'You have been safely signed out of your account.',
      type: 'info',
    });
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <SEO
        title="Account Profile & Settings | Sparkline Marketing"
        description="Manage your user profile, currency preferences, time zone, and account credentials."
        noIndex={true}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/dashboard" className="hover:text-sparkline-blue font-medium">
          Dashboard
        </Link>
        <span>/</span>
        <span className="font-semibold text-sparkline-midnight">Account Profile</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-sparkline-midnight text-white flex items-center justify-center font-bold text-xl shadow-card shrink-0">
            {user?.fullName
              ? user.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'SM'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-sparkline-midnight tracking-tight">
                {user?.fullName || 'User Profile'}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Active Member
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>{user?.email}</span>
              <span>•</span>
              <span className="capitalize">{user?.companyName || 'Sparkline Marketing'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            leftIcon={<LogOut className="w-4 h-4 text-slate-500" />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-bold text-sparkline-midnight mb-1 flex items-center gap-2">
              <User className="w-4 h-4 text-sparkline-blue" />
              <span>Personal & Professional Profile</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Update your corporate identity, currency standards, and localization settings.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <TextInput
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    leftIcon={<User className="w-4 h-4 text-slate-400" />}
                  />
                </div>
                <div>
                  <TextInput
                    label="Email Address"
                    value={user?.email || ''}
                    disabled
                    readOnly
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    helperText="Email is bound to your authentication provider."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <TextInput
                    label="Company / Organization"
                    value={companyName}
                    placeholder="e.g. Acme Corp"
                    onChange={(e) => setCompanyName(e.target.value)}
                    leftIcon={<Building className="w-4 h-4 text-slate-400" />}
                  />
                </div>
                <div>
                  <TextInput
                    label="Job Title / Role"
                    value={jobTitle}
                    placeholder="e.g. VP of Marketing"
                    onChange={(e) => setJobTitle(e.target.value)}
                    leftIcon={<Briefcase className="w-4 h-4 text-slate-400" />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <SelectInput
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    options={COUNTRY_OPTIONS}
                  />
                </div>
                <div>
                  <SelectInput
                    label="Preferred Language"
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    options={LANGUAGE_OPTIONS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <SelectInput
                    label="Default Budget & Metric Currency"
                    value={preferredCurrency}
                    onChange={(e) => setPreferredCurrency(e.target.value)}
                    options={CURRENCY_OPTIONS}
                  />
                </div>
                <div>
                  <SelectInput
                    label="Workspace Time Zone"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    options={TIMEZONE_OPTIONS}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  disabled={isSavingProfile}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  {isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password Card */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-sparkline-midnight mb-1 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-sparkline-blue" />
              <span>Change Security Password</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Ensure your account uses a secure password with at least 8 characters.
            </p>

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{passwordError}</div>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <div className="relative">
                  <TextInput
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    placeholder="••••••••••••"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <TextInput
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    placeholder="Min. 8 characters"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div>
                  <TextInput
                    label="Confirm New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    placeholder="Confirm new password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isChangingPassword}
                  leftIcon={<Lock className="w-4 h-4" />}
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Privacy & Data Portability (Phase 22) */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-sparkline-midnight mb-1 flex items-center gap-2">
                  <Download className="w-4 h-4 text-sparkline-blue" />
                  <span>Data Sovereignty & Portability</span>
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                  Download a complete cryptographic backup of your personal workspace, brand intelligence, advertising strategies, and audit trail in JSON format.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportData}
                leftIcon={<Download className="w-3.5 h-3.5" />}
                className="shrink-0"
              >
                Export All Data (JSON)
              </Button>
            </div>
          </Card>

          {/* Security Audit Activity (Phase 22) */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-sparkline-midnight mb-1 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sparkline-blue" />
              <span>Recent Security Audit Activity</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Immutable ledger of recent authentication, authorization, and sensitive operations.
            </p>

            {auditLogs.length > 0 ? (
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-semibold text-sparkline-midnight block">
                        {log.action}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(log.timestamp).toLocaleString()} • {log.resourceType}
                      </span>
                    </div>
                    <Badge
                      variant={log.outcome === 'success' ? 'cyan' : 'orange'}
                      size="sm"
                    >
                      {log.outcome}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">No security events logged yet.</p>
            )}
          </Card>

          {/* Danger Zone: Account Deletion (Phase 22) */}
          <Card className="p-6 border-rose-200 bg-rose-50/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-rose-700 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Danger Zone: Account Deletion</span>
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  Permanently delete your user profile, revoke authentication tokens, and purge all private marketing workspaces and generated reports.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setDeleteModalOpen(true);
                  setDeleteInput('');
                }}
                className="shrink-0 border-rose-300 text-rose-700 hover:bg-rose-100/60"
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Security Status & Account Metadata */}
        <div className="space-y-6">
          {/* Provider Card */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-sparkline-midnight mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Authentication Provider</span>
            </h3>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{providerStatus.providerName}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {providerStatus.isCloudConnected ? 'Cloud Active' : 'Local Isolated'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {providerStatus.description}
              </p>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Account ID</span>
                <span className="font-mono text-[10px] text-slate-700 font-semibold">{user?.id}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Created Date</span>
                <span className="text-slate-700 font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Data Isolation</span>
                <span className="font-semibold text-sparkline-blue">Private Tenant</span>
              </div>
            </div>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-200/60">
            <h3 className="text-sm font-bold text-sparkline-midnight mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sparkline-blue" />
              <span>Workspace Management</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Need to manage multiple client brand containers or export project briefs?
            </p>
            <div className="space-y-2">
              <Button
                to="/dashboard/projects"
                variant="outline"
                size="sm"
                className="w-full justify-center bg-white text-xs"
              >
                Go to Projects Hub
              </Button>
              <Button
                to="/dashboard/reports"
                variant="outline"
                size="sm"
                className="w-full justify-center bg-white text-xs"
              >
                Executive Reports Command
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal (Phase 22) */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-sparkline-midnight">
                  Confirm Account Deletion
                </h3>
                <p className="text-xs text-slate-500">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              All your configured brands, product catalogs, marketing strategies, ad flights, and generated reports will be permanently deleted.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Type <span className="font-mono font-bold text-rose-600">DELETE MY ACCOUNT</span> to confirm:
            </div>

            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={deleteInput.trim() !== 'DELETE MY ACCOUNT'}
                onClick={handlePurgeAccount}
                className="bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 border-transparent"
              >
                Permanently Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
