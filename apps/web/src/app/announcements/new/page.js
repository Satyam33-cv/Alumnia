// apps/web/src/app/announcements/new/page.js
// Post an announcement (faculty / admin)
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ title: '', body: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (!user || !['FACULTY', 'ADMIN'].includes(user.role)) {
    router.push('/announcements'); return null;
  }

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      await api.post('/api/announcements', form);
      router.push('/announcements');
    } catch (err) {
      setError(err.message);
    } finally { setSubmitting(false); }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/announcements" className="text-sm text-brand-600 hover:underline">← Back to announcements</Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">Post Announcement</h1>
      <p className="text-gray-600 text-sm mb-6">Share a notice with the alumni community</p>

      <form onSubmit={submit} className="bg-white border rounded-xl p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input value={form.title} onChange={e => update('title', e.target.value)} required
            placeholder="Campus Placement Drive — Registration Open" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message *</label>
          <textarea value={form.body} onChange={e => update('body', e.target.value)} rows={5} required
            placeholder="Write your announcement..."
            className="w-full border rounded-lg px-3 py-2" />
        </div>

        <button disabled={submitting} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
          {submitting ? 'Posting...' : 'Post Announcement'}
        </button>
      </form>
    </div>
  );
}
