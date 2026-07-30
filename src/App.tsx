/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Download, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to save name');
      }

      setStatus('success');
      setName('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Sign the Guestbook</h1>
          <p className="text-sm text-neutral-500">Enter your name to add it to the records.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              disabled={status === 'loading'}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-colors disabled:opacity-50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || !name.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : status === 'success' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </>
            ) : status === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Error, Try Again
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Name
              </>
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-neutral-100">
          <a
            href="/api/names/download"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-all"
            download
          >
            <Download className="w-4 h-4" />
            Download Records (CSV)
          </a>
        </div>
      </div>
    </div>
  );
}
