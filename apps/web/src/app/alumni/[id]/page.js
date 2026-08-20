// apps/web/src/app/alumni/[id]/page.js
// Individual alumni profile page
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Building2, Linkedin, Mail } from 'lucide-react';
import { api } from '../../../lib/api';

export default function AlumniProfilePage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/users/${id}`)
      .then(d => setPerson(d.user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!person) return <p>Profile not found.</p>;

  return (
    <div className="max-w-2xl">
      <Link href="/alumni" className="text-sm text-brand-600 hover:underline">← Back to directory</Link>

      <div className="bg-white border rounded-xl p-8 mt-4">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-3xl font-bold text-brand-600">
            {person.name?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{person.name}</h1>
            <p className="text-sm text-gray-600">
              {person.role}
              {person.batchYear && ` • Batch of ${person.batchYear}`}
              {person.department && ` • ${person.department}`}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {person.jobTitle && (
            <p className="flex items-center gap-2 text-gray-700">
              <Building2 size={16} className="text-gray-400" />
              <span><strong>{person.jobTitle}</strong> {person.currentCompany && `at ${person.currentCompany}`}</span>
            </p>
          )}
          {person.location && (
            <p className="flex items-center gap-2 text-gray-700">
              <MapPin size={16} className="text-gray-400" /> {person.location}
            </p>
          )}
          {person.linkedinUrl && (
            <a href={person.linkedinUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-brand-600 hover:underline">
              <Linkedin size={16} /> LinkedIn Profile
            </a>
          )}
        </div>

        {person.bio && (
          <div className="mt-6 pt-6 border-t">
            <h2 className="font-semibold mb-2">About</h2>
            <p className="text-gray-700 whitespace-pre-line">{person.bio}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <Link href="/jobs" className="text-brand-600 hover:underline text-sm">
            View jobs posted by this alumni →
          </Link>
        </div>
      </div>
    </div>
  );
}
