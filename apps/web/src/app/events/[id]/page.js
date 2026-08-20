// apps/web/src/app/events/[id]/page.js
// Event detail with attendee list + RSVP
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Users, Pencil } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const d = await api.get(`/api/events/${id}`);
      setEvent(d.event);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!event) return <p>Event not found.</p>;

  const past = new Date(event.date) < new Date();
  const canEdit = user && (event.createdBy?.id === user.id || user.role === 'ADMIN');

  async function toggleRsvp() {
    if (!user) { router.push('/login'); return; }
    setBusy(true);
    try {
      if (event.hasRsvp) {
        await api.del(`/api/events/${event.id}/rsvp`);
      } else {
        await api.post(`/api/events/${event.id}/rsvp`);
      }
      await load();
    } catch (err) {
      alert(err.message);
    } finally { setBusy(false); }
  }

  return (
    <div>
      <Link href="/events" className="text-sm text-brand-600 hover:underline">← Back to events</Link>

      <div className="bg-white border rounded-xl mt-4 overflow-hidden">
        {event.coverImage && (
          <img src={event.coverImage} alt={event.title} className="w-full h-48 object-cover" />
        )}

        <div className="p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-2 text-sm">
                <span className="flex items-center gap-1"><Calendar size={15} /> {new Date(event.date).toLocaleString()}</span>
                {event.location && <span className="flex items-center gap-1"><MapPin size={15} /> {event.location}</span>}
                <span className="bg-gray-100 px-2 py-0.5 rounded">{event.mode}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1.5">
                <Users size={15} className="text-gray-400" />
                {event._count?.rsvps} attending{event.maxCapacity ? ` / ${event.maxCapacity} capacity` : ''}
              </p>
            </div>
            {canEdit && (
              <Link href="#" onClick={e => e.preventDefault()} className="flex items-center gap-1 text-sm text-gray-500 border rounded-lg px-3 py-2 hover:bg-gray-50">
                <Pencil size={14} /> Edit
              </Link>
            )}
          </div>

          {!past && user && (
            <button onClick={toggleRsvp} disabled={busy}
              className={`mt-5 px-5 py-2.5 rounded-lg font-semibold ${
                event.hasRsvp
                  ? 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  : 'bg-brand-600 text-white hover:bg-brand-700'
              } disabled:opacity-50`}>
              {event.hasRsvp ? '✓ RSVP\'d — Click to cancel' : 'RSVP to this event'}
            </button>
          )}

          {event.description && (
            <div className="mt-6 pt-6 border-t">
              <h2 className="font-semibold mb-2">About this event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <h2 className="font-semibold mb-2">Organized by</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-semibold text-brand-600">
                {event.createdBy?.name?.[0]}
              </div>
              <div>
                <p className="font-medium">{event.createdBy?.name}</p>
                <p className="text-sm text-gray-600">
                  {event.createdBy?.jobTitle}{event.createdBy?.jobTitle && event.createdBy?.currentCompany ? ' at ' : ''}{event.createdBy?.currentCompany}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h2 className="font-semibold mb-3">Attendees ({event.rsvps?.length || 0})</h2>
            {event.rsvps?.length ? (
              <div className="flex flex-wrap gap-2">
                {event.rsvps.map(r => (
                  <span key={r.userId} className="inline-flex items-center gap-1.5 bg-gray-50 border rounded-full px-3 py-1 text-sm">
                    <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-600">
                      {r.user?.name?.[0]}
                    </div>
                    {r.user?.name}
                    {r.user?.batchYear && <span className="text-xs text-gray-500">({r.user.batchYear})</span>}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No attendees yet. Be the first to RSVP!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
