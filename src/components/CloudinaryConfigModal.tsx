import React, { useState } from 'react';
import { X, Database, Shield, CheckCircle2, AlertCircle, Key, Cloud, ExternalLink, RefreshCw, Check } from 'lucide-react';
import type { CloudinaryConfigStatus } from '../types/pipeline.js';
import { saveCloudinaryConfig, testCredentials, resetToDemoCloud } from '../lib/api.js';

interface CloudinaryConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: CloudinaryConfigStatus | null;
  onConfigSaved: (newStatus: CloudinaryConfigStatus) => void;
}

export const CloudinaryConfigModal: React.FC<CloudinaryConfigModalProps> = ({
  isOpen,
  onClose,
  status,
  onConfigSaved,
}) => {
  const [cloudName, setCloudName] = useState(status?.cloudName !== 'demo' ? status?.cloudName || '' : '');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!cloudName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a Cloud Name to test.' });
      return;
    }
    setIsTesting(true);
    setMessage(null);
    try {
      const res = await testCredentials({
        cloudName: cloudName.trim(),
        apiKey: apiKey.trim(),
        apiSecret: apiSecret.trim(),
      });
      if (res.success) {
        setMessage({ type: 'success', text: '✓ Cloudinary connection verified successfully!' });
      } else {
        setMessage({ type: 'error', text: res.message || 'Verification failed. Please check your credentials.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Verification failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSwitchToDemo = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const updated = await resetToDemoCloud();
      setCloudName('');
      setApiKey('');
      setApiSecret('');
      setMessage({ type: 'success', text: 'Switched to Cloudinary Demo Cloud successfully!' });
      onConfigSaved(updated);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to switch to Demo Cloud' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudName.trim()) {
      setMessage({ type: 'error', text: 'Cloud name is required.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const updated = await saveCloudinaryConfig({
        cloudName: cloudName.trim(),
        apiKey: apiKey.trim(),
        apiSecret: apiSecret.trim(),
      });
      setMessage({ type: 'success', text: 'Cloudinary configuration updated successfully!' });
      onConfigSaved(updated);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update credentials' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Cloudinary Configuration
              </h3>
              <p className="text-xs text-neutral-500">
                Programmable Media credentials & pipeline settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Banner */}
        <div className="px-6 pt-5">
          <div className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 ${
            status?.configured
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {status?.configured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-bold flex items-center justify-between">
                <span>{status?.configured ? 'Custom Account Connected' : 'Running in Demo Cloud Mode'}</span>
                {status?.configured && (
                  <button
                    type="button"
                    onClick={handleSwitchToDemo}
                    className="text-[11px] underline font-normal text-amber-800 hover:text-amber-950"
                  >
                    Switch to Demo Cloud
                  </button>
                )}
              </div>
              <div className="mt-0.5 opacity-90">
                {status?.configured
                  ? `Active Cloud: ${status.cloudName} with server-side signing enabled.`
                  : 'Currently delivering media via Cloudinary demo cloud. Provide your free Cloudinary credentials to execute signed uploads to your own account.'}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Cloud Name <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-neutral-400">Found on Cloudinary Console Dashboard</span>
            </div>
            <div className="relative">
              <Cloud className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="e.g. dxyz8123 (NOT project name)"
                className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
                required
              />
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              <strong>Tip:</strong> Your Cloud Name is unique to your Cloudinary account (e.g. <code className="font-mono">dxy8abcde</code>), not your local app name.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              API Key (Server-side)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="e.g. 123456789012345"
                className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              API Secret (Server-side Only)
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="••••••••••••••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-neutral-900 font-mono"
              />
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Your API Secret is kept exclusively on the Node server and never sent to the browser.
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-xs font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting || !cloudName.trim()}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 disabled:opacity-50"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>

              <button
                type="button"
                onClick={handleSwitchToDemo}
                disabled={isSaving}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200"
              >
                Use Demo Cloud
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Connecting...' : 'Save Credentials'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
