// apps/web/src/app/stories/page.js
// Success stories / Spotlight Wall (approved only)
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Plus } from 'lucide-react';
import { api } from '../../lib/api';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/stories')
      .then(d => setStories(d.stories))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Success Stories</h1>
        <Link href="/stories/new" className="flex items-center gap-1 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700">
          <Plus size={16} /> Share Your Story
        </Link>
      </div>
      <p className="text-gray-600 text-sm mb-6">Inspiring journeys from our alumni</p>

      {loading ? (
        <p>Loading...</p>
      ) : stories.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          No stories yet. Be the first to share your journey!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map(s => (
            <div key={s.id} className="bg-white border rounded-xl p-6 hover:border-brand-500 transition">
              {s.isFeatured && (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full mb-3">
                  <Star size={12} /> Featured
                </span>
              )}
              <h3 className="font-semibold text-lg leading-snug">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-3 line-clamp-3">{s.story}</p>

              <div className="flex items-center gap-3 pt-3 border-t">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center font-semibold text-brand-600 text-xs">
                  {s.alumni?.name?.[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.alumni?.name}</p>
                  <p className="text-xs text-gray-500">
                    {s.role} at {s.company}
                    {s.alumni?.department && ` • ${s.alumni.department}`}
                    {s.batchYear && ` • Batch ${s.batchYear}`}
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
