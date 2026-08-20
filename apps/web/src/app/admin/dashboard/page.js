// apps/web/src/app/admin/dashboard/page.js
// Admin analytics dashboard
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Briefcase, MessageCircle, Trophy, Calendar, Megaphone, Brain, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState({ users: [], referrals: [] });
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    api.get('/api/admin/stats')
      .then(d => { setStats(d.stats); setRecent({ users: d.recentUsers, referrals: d.recentReferrals }); })
      .catch(console.error);
  }, [user]);

  async function syncEmbeddings() {
    setSyncing(true); setSyncMsg('');
    try {
      const data = await api.post('/api/matching/sync');
      setSyncMsg(`✅ ${data.updated} profiles embedded (${data.skipped} skipped)`);
    } catch (err) {
      setSyncMsg('❌ ' + err.message);
    } finally {
      setSyncing(false);
    }
  }

  if (loading || !user) return <p>Loading...</p>;
  if (!stats) return <p>Loading analytics...</p>;

  const byRole = stats.users.byRole || {};
  const refByStatus = stats.referrals.byStatus || {};
  const refTotal = stats.referrals.total || 0;

  return (
    <div>
      <Link href="/admin" className="text-sm text-brand-600 hover:underline">← Admin</Link>
      <div className="flex items-center justify-between mt-2 mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-3">
          {syncMsg && <span className="text-sm text-gray-600">{syncMsg}</span>}
          <button onClick={syncEmbeddings} disabled={syncing}
            className="flex items-center gap-2 text-sm border border-brand-200 bg-brand-50 text-brand-700 px-3 py-2 rounded-lg hover:bg-brand-100 disabled:opacity-50">
            <Brain size={16} /> <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync AI embeddings'}
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <Kpi icon={<Users />} label="Users" value={stats.users.total} sub={`${stats.users.verified} verified`} color="bg-brand-50 text-brand-600" />
        <Kpi icon={<Briefcase />} label="Jobs" value={stats.jobs.total} sub={`${stats.jobs.open} open`} color="bg-indigo-50 text-indigo-600" />
        <Kpi icon={<MessageCircle />} label="Referrals" value={stats.referrals.total} color="bg-emerald-50 text-emerald-600" />
        <Kpi icon={<Trophy />} label="Stories" value={stats.stories.approved} sub={`${stats.stories.pending} pending`} color="bg-amber-50 text-amber-600" />
        <Kpi icon={<Calendar />} label="Events" value={stats.events.total} sub={`${stats.events.upcoming} upcoming`} color="bg-rose-50 text-rose-600" />
        <Kpi icon={<Megaphone />} label="Announcements" value={stats.announcements} color="bg-cyan-50 text-cyan-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Users by role */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Users by Role</h2>
          <BarRow label="Alumni" value={byRole.ALUMNI || 0} max={stats.users.total} color="bg-brand-500" />
          <BarRow label="Students" value={byRole.STUDENT || 0} max={stats.users.total} color="bg-indigo-500" />
          <BarRow label="Faculty" value={byRole.FACULTY || 0} max={stats.users.total} color="bg-amber-500" />
          <BarRow label="Admins" value={byRole.ADMIN || 0} max={stats.users.total} color="bg-gray-700" />
        </div>

        {/* Referrals by status */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Referrals by Status</h2>
          {Object.entries(refByStatus).map(([status, count]) => (
            <BarRow key={status} label={status} value={count} max={refTotal} color="bg-emerald-500" showTotal />
          ))}
          {refTotal === 0 && <p className="text-sm text-gray-500">No referrals yet</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Recent Sign-ups</h2>
          {recent.users.length === 0 ? (
            <p className="text-sm text-gray-500">No users yet</p>
          ) : (
            <div className="space-y-3">
              {recent.users.map(u => (
                <div key={u.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email} • {u.role}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {u.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent referrals */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Recent Referral Activity</h2>
          {recent.referrals.length === 0 ? (
            <p className="text-sm text-gray-500">No referral activity yet</p>
          ) : (
            <div className="space-y-3">
              {recent.referrals.map(r => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{r.requestedBy?.name} → {r.job?.title}</p>
                    <p className="text-xs text-gray-500">{r.job?.company} • {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${color}`}>{icon}</div>
      <p className="text-2xl font-bold">{value ?? 0}</p>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function BarRow({ label, value, max, color, showTotal }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="font-medium capitalize">{label.replace('_', ' ').toLowerCase()}</span>
        <span className="text-gray-500">{showTotal ? `${value} (${pct}%)` : value}</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
