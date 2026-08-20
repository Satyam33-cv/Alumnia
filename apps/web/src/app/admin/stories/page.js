// apps/web/src/app/admin/stories/page.js
// Admin: pending success stories review + approve / feature
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Check, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

export default function AdminStoriesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [tab, setTab] = useState('pending');
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    api.get('/api/stories/pending').then(d => setPending(d.stories)).catch(console.error);
    api.get('/api/stories').then(d => setApproved(d.stories)).catch(console.error);
  }, [user]);

  if (loading || !user) return <p>Loading...</p>;

  async function approve(story, feature = false) {
    setBusy(story.id); setError('');
    try {
      await api.post(`/api/stories/${story.id}/approve`, { isFeatured: feature });
      setPending(list => list.filter(s => s.id !== story.id));
      const approvedList = await api.get('/api/stories');
      setApproved(approvedList.stories);
    } catch (err) {
      setError(err.message);
    } finally { setBusy(null); }
  }

  async function reject(story) {
    setBusy(story.id); setError('');
    try {
      await api.del(`/api/stories/${story.id}`);
      setPending(list => list.filter(s => s.id !== story.id));
    } catch (err) {
      setError(err.message);
    } finally { setBusy(null); }
  }

  const list = tab === 'pending' ? pending : approved;

  return (
    <div>
      <Link href="/admin" className="text-sm text-brand-600 hover:underline">← Admin</Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">Story Review</h1>
      <p className="text-gray-600 text-sm mb-6">Approve and feature alumni success stories</p>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

      <div className="flex gap-2 mb-6 border-b">
        <button onClick={() => setTab('pending')}
          className={`px-4 py-2 font-medium ${tab === 'pending' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-gray-600'}`}>
          Pending ({pending.length})
        </button>
        <button onClick={() => setTab('approved')}
          className={`px-4 py-2 font-medium ${tab === 'approved' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-gray-600'}`}>
          Approved ({approved.length})
        </button>
      </div>

      {list.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          {tab === 'pending' ? 'No stories awaiting review' : 'No approved stories yet'}
        </div>
      ) : (
        <div className="space-y-4">
          {list.map(s => (
            <div key={s.id} className="bg-white border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold flex items-center gap-2">
                    {s.title}
                    {s.isFeatured && <Star size={14} className="text-amber-500" />}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {s.role} at {s.company}
                    {s.batchYear && ` • Batch ${s.batchYear}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">by {s.alumni?.name}</p>
                </div>
                {tab === 'pending' && (
                  <div className="flex gap-2 flex-none">
                    <button onClick={() => approve(s, true)} disabled={busy === s.id}
                      className="flex items-center gap-1 bg-amber-500 text-white text-sm px-3 py-1.5 rounded hover:bg-amber-600 disabled:opacity-50">
                      <Star size={14} /> Approve &amp; Feature
                    </button>
                    <button onClick={() => approve(s)} disabled={busy === s.id}
                      className="flex items-center gap-1 bg-green-600 text-white text-sm px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-50">
                      <Check size={14} /> Approve
                    </button>
                    <button onClick={() => reject(s)} disabled={busy === s.id}
                      className="flex items-center gap-1 bg-red-100 text-red-700 text-sm px-3 py-1.5 rounded hover:bg-red-200 disabled:opacity-50">
                      <X size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-3 whitespace-pre-line line-clamp-3">{s.story}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
