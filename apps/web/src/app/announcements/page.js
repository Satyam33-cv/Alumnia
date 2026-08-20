// apps/web/src/app/announcements/page.js
// Announcements list (faculty / admin)
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/announcements')
      .then(d => setAnnouncements(d.announcements))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const canPost = user && ['FACULTY', 'ADMIN'].includes(user.role);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Announcements</h1>
        {canPost && (
          <Link href="/announcements/new" className="flex items-center gap-1 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700">
            <Plus size={16} /> Post Announcement
          </Link>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-6">Important notices from faculty and administration</p>

      {loading ? (
        <p>Loading...</p>
      ) : announcements.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          No announcements yet
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(a => (
            <div key={a.id} className="bg-white border rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 flex-none">
                  <Megaphone size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="text-gray-700 text-sm mt-1 whitespace-pre-line">{a.body}</p>
                  <p className="text-xs text-gray-500 mt-3">
                    Posted by {a.createdBy?.name}{a.createdBy?.department ? ` • ${a.createdBy.department}` : ''}
                    {' '}· {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
