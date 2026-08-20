// apps/web/src/app/matching/page.js
// AI Smart Matching — "Top 5 Alumni for You" (student-facing)
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Building2, GraduationCap, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function MatchingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setLoading(true); setError('');
    try {
      const data = await api.get('/api/matching/top-alumni?limit=5');
      setAlumni(data.alumni);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'STUDENT') { router.push('/'); return; }
    load();
  }, [authLoading, user, router]);

  async function refresh() {
    setRefreshing(true); setError('');
    try {
      await api.post('/api/matching/sync-me');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  if (authLoading || (loading && !alumni)) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="text-brand-600" /> Top 5 Alumni for You</h1>
          <p className="text-gray-600 mt-1">AI-powered matches based on your profile, skills &amp; interests. Reach out for mentorship and referrals.</p>
        </div>
        <button onClick={refresh} disabled={refreshing}
          className="flex items-center gap-2 text-sm border px-3 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50">
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Re-match me
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2">Your profile embedding is updated automatically on re-match. Tip: fill skills/interests in your profile for better results.</p>

      {error && <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

      {alumni && alumni.length === 0 && !error && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6 text-sm">
          <b>No matches yet.</b> This can happen when alumni profiles haven't been embedded.
          Ask an admin to run <code className="bg-white px-1.5 py-0.5 rounded">Admin → Analytics → Sync embeddings</code>, or try again later.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {alumni?.map((a) => (
          <div key={a.id} className="bg-white border rounded-xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-600 shrink-0">
              {a.name?.[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg">{a.name}</h2>
                {a.isVerified && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">✓ Verified</span>}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                {a.jobTitle && <span className="flex items-center gap-1"><Building2 size={14} /> {a.jobTitle}{a.currentCompany ? ` @ ${a.currentCompany}` : ''}</span>}
                {a.department && <span className="flex items-center gap-1"><GraduationCap size={14} /> {a.department}{a.batchYear ? ` · ${a.batchYear}` : ''}</span>}
                {a.location && <span>{a.location}</span>}
              </div>
              {a.skills && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {a.skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 5).map(s => (
                    <span key={s} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-brand-600">{a.matchScore}%</div>
              <div className="text-xs text-gray-500">match</div>
              <Link href={`/alumni/${a.id}`}
                className="mt-2 inline-block text-sm bg-brand-600 text-white px-4 py-1.5 rounded-lg hover:bg-brand-700">
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
