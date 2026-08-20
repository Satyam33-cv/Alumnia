// apps/web/src/app/admin/users/page.js
// Admin: browse users + verify alumni
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, BadgeCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ role: 'ALUMNI', verified: 'false', search: '' });
  const [busy, setBusy] = useState(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) router.push('/');
  }, [user, loading, router]);

  async function load() {
    setFetching(true);
    try {
      const params = new URLSearchParams({ page });
      Object.entries(filters).forEach(([k, v]) => { if (v && v !== 'ALL') params.set(k, v); });
      const d = await api.get(`/api/admin/users?${params}`);
      setUsers(d.users);
      setTotal(d.pagination.total);
    } catch (err) {
      console.error(err);
    } finally { setFetching(false); }
  }

  useEffect(() => { if (user?.role === 'ADMIN') load(); }, [page, filters, user]);

  async function toggleVerify(u) {
    setBusy(u.id);
    try {
      const d = await api.patch(`/api/admin/users/${u.id}/verify`, { verified: !u.isVerified });
      setUsers(list => list.map(x => x.id === u.id ? { ...x, isVerified: d.user.isVerified } : x));
    } catch (err) {
      alert(err.message);
    } finally { setBusy(null); }
  }

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div>
      <Link href="/admin" className="text-sm text-brand-600 hover:underline">← Admin</Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">User Management</h1>
      <p className="text-gray-600 text-sm mb-6">Verify alumni accounts so their info is trusted by students</p>

      <div className="bg-white border rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 border rounded-lg px-3">
          <Search size={18} className="text-gray-400" />
          <input value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            placeholder="Search by name, email, company..." className="flex-1 py-2 outline-none text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <select value={filters.role} onChange={e => setFilters(f => ({ ...f, role: e.target.value, page: 1 }))}
            className="border rounded-lg px-3 py-2 text-sm">
            <option value="ALUMNI">Alumni</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admins</option>
            <option value="ALL">All roles</option>
          </select>
          <select value={filters.verified} onChange={e => setFilters(f => ({ ...f, verified: e.target.value, page: 1 }))}
            className="border rounded-lg px-3 py-2 text-sm">
            <option value="false">Unverified only</option>
            <option value="true">Verified only</option>
            <option value="ALL">All</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{total} {total === 1 ? 'user' : 'users'} found</p>

      {fetching ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          {filters.verified === 'false' && filters.role === 'ALUMNI'
            ? '🎉 All alumni are verified!'
            : 'No users match these filters'}
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3 hidden md:table-cell">Batch / Dept</th>
                <th className="px-4 py-3 hidden md:table-cell">Company</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                    {u.batchYear ? `${u.batchYear} ` : ''}{u.department || '—'}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                    {u.currentCompany || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {u.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleVerify(u)} disabled={busy === u.id}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium border disabled:opacity-50 ${
                        u.isVerified
                          ? 'border-gray-200 text-gray-600 hover:bg-gray-100'
                          : 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                      }`}>
                      <span className="inline-flex items-center gap-1"><BadgeCheck size={13} /> {u.isVerified ? 'Unverify' : 'Verify'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
            <span className="text-gray-500">Page {page} of {Math.max(1, Math.ceil(total / 25))}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-40">Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 25)}
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
