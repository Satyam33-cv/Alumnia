// apps/web/src/app/admin/page.js
// Admin dashboard landing (role-guarded)
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Users, Upload, BarChart3, BadgeCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) router.push('/');
  }, [user, loading, router]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-gray-600 text-sm mb-6">Manage the alumni platform</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/dashboard" className="bg-white border rounded-xl p-6 hover:border-brand-500 transition">
          <BarChart3 size={24} className="text-brand-600 mb-2" />
          <h3 className="font-semibold mb-1">Analytics Dashboard</h3>
          <p className="text-sm text-gray-600">Platform KPIs and activity</p>
        </Link>
        <Link href="/admin/users" className="bg-white border rounded-xl p-6 hover:border-brand-500 transition">
          <BadgeCheck size={24} className="text-brand-600 mb-2" />
          <h3 className="font-semibold mb-1">Verify Alumni</h3>
          <p className="text-sm text-gray-600">Approve alumni accounts</p>
        </Link>
        <Link href="/admin/stories" className="bg-white border rounded-xl p-6 hover:border-brand-500 transition">
          <FileText size={24} className="text-brand-600 mb-2" />
          <h3 className="font-semibold mb-1">Story Review</h3>
          <p className="text-sm text-gray-600">Approve / feature success stories</p>
        </Link>
        <Link href="/admin/import" className="bg-white border rounded-xl p-6 hover:border-brand-500 transition">
          <Upload size={24} className="text-brand-600 mb-2" />
          <h3 className="font-semibold mb-1">CSV Import</h3>
          <p className="text-sm text-gray-600">Bulk import alumni accounts</p>
        </Link>
      </div>
    </div>
  );
}
