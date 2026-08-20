// apps/web/src/app/events/new/page.js
// Create an event (admin / alumni / faculty)
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

export default function NewEventPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    title: '', description: '', date: '', location: '', mode: 'ONLINE', coverImage: '', maxCapacity: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (!user || !['ADMIN', 'ALUMNI', 'FACULTY'].includes(user.role)) {
    router.push('/events'); return null;
  }

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      const data = await api.post('/api/events', {
        ...form,
        date: new Date(form.date).toISOString(),
        maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : undefined,
      });
      router.push(`/events/${data.event.id}`);
    } catch (err) {
      setError(err.message);
    } finally { setSubmitting(false); }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/events" className="text-sm text-brand-600 hover:underline">← Back to events</Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">Create Event</h1>
      <p className="text-gray-600 text-sm mb-6">Plan an alumni networking, webinar, or campus meetup</p>

      <form onSubmit={submit} className="bg-white border rounded-xl p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input value={form.title} onChange={e => update('title', e.target.value)} required
            placeholder="Alumni Networking Night 2026" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} required
            className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input type="datetime-local" value={form.date} onChange={e => update('date', e.target.value)} required
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mode</label>
            <select value={form.mode} onChange={e => update('mode', e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option>ONLINE</option><option>OFFLINE</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input value={form.location} onChange={e => update('location', e.target.value)}
              placeholder="Auditorium / Zoom link" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Capacity</label>
            <input type="number" min="1" value={form.maxCapacity} onChange={e => update('maxCapacity', e.target.value)}
              placeholder="e.g. 100" className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input value={form.coverImage} onChange={e => update('coverImage', e.target.value)}
            placeholder="https://..." className="w-full border rounded-lg px-3 py-2" />
        </div>

        <button disabled={submitting} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
          {submitting ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}
