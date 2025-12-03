import React, { useState } from 'react';
import { EasyStoreConfig } from '../types';
import { Settings as SettingsIcon, Save, Info, AlertTriangle } from 'lucide-react';

interface SettingsProps {
  config: EasyStoreConfig | null;
  onSave: (config: EasyStoreConfig) => void;
  onUseDemo: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ config, onSave, onUseDemo }) => {
  const [shopUrl, setShopUrl] = useState(config?.shopUrl || '');
  const [accessToken, setAccessToken] = useState(config?.accessToken || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate validation
    setTimeout(() => {
      onSave({ shopUrl, accessToken });
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">EasyStore Connection</h2>
            <p className="text-sm text-slate-500">Configure your API credentials to access store data</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 text-sm">Don't have an API Key?</h4>
            <p className="text-sm text-amber-700 mt-1">
              You can explore the application using mock data generated for demonstration purposes.
            </p>
            <button 
              onClick={onUseDemo}
              type="button"
              className="mt-2 text-sm font-medium text-amber-900 underline hover:text-amber-700"
            >
              Use Demo Mode
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Shop URL
            </label>
            <input
              type="url"
              required
              placeholder="https://your-shop.easystore.co"
              value={shopUrl}
              onChange={(e) => setShopUrl(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Access Token
            </label>
            <input
              type="password"
              required
              placeholder="easystore_token_..."
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <p className="mt-1 text-xs text-slate-400">
              Your access token is stored locally in your browser session.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Connection
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-indigo-600 shrink-0" />
          <div>
            <h3 className="font-semibold text-indigo-900">How to get your API Key</h3>
            <ol className="mt-2 space-y-2 text-sm text-indigo-800 list-decimal list-inside">
              <li>Log in to your EasyStore admin panel.</li>
              <li>Navigate to <strong>Apps</strong> &gt; <strong>Private Apps</strong>.</li>
              <li>Create a new private app and enable read/write permissions for Products and Orders.</li>
              <li>Copy the generated <strong>Access Token</strong>.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};