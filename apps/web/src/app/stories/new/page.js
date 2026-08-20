// apps/web/src/app/stories/new/page.js
// Submit a success story (alumni only)
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

export default function NewStoryPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    title: '', story: '', company: '', role: '', batchYear: '', imageUrl: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (!user) { router.push('/login'); return null; }
  if (user.role !== 'ALUMNI' && user.role !== 'ADMIN') {
    router.push('/stories'); return null;
  }

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      await api.post('/api/stories', form);
      router.push('/stories');
    } catch (err) {
      setError(err.message);
    } finally { setSubmitting(false); }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/stories" className="text-sm text-brand-600 hover:underline">← Back to stories</Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">Share Your Success Story</h1>
      <p className="text-gray-600 text-sm mb-6">
        Your story will be reviewed by the college admin before appearing on the Spotlight Wall.
      </p>

      <form onSubmit={submit} className="bg-white border rounded-xl p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input value={form.title} onChange={e => update('title', e.target.value)} required
            placeholder="From CSE classroom to Google" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Your Story *</label>
          <textarea value={form.story} onChange={e => update('story', e.target.value)} rows={5} required
            placeholder="Share your journey, challenges, and learnings..."
            className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Company *" value={form.company} onChange={v => update('company', v)} required placeholder="Google" />
          <Field label="Role *" value={form.role} onChange={v => update('role', v)} required placeholder="Software Engineer" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Batch Year" value={form.batchYear} onChange={v => update('batchYear', v)} type="number" placeholder="2018" />
          <Field label="Image URL (optional)" value={form.imageUrl} onChange={v => update('imageUrl', v)} placeholder="https://..." />
        </div>

        <button disabled={submitting} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2" />
    </div>
  );
}
