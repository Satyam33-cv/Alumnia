// apps/web/src/app/events/page.js
// Events list with RSVP actions
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  async function load() {
    setLoading(true);
    try {
      const d = await api.get(`/api/events${tab === 'upcoming' ? '?upcoming=true' : ''}`);
      setEvents(d.events);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [tab]);

  const canCreate = user && ['ADMIN', 'ALUMNI', 'FACULTY'].includes(user.role);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Events</h1>
        {canCreate && (
          <Link href="/events/new" className="flex items-center gap-1 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700">
            <Plus size={16} /> Create Event
          </Link>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-6">Alumni networking and campus events</p>

      <div className="flex gap-2 mb-6 border-b">
        <button onClick={() => setTab('upcoming')}
          className={`px-4 py-2 font-medium ${tab === 'upcoming' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-gray-600'}`}>
          Upcoming
        </button>
        <button onClick={() => setTab('all')}
          className={`px-4 py-2 font-medium ${tab === 'all' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-gray-600'}`}>
          All
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          No events {tab === 'upcoming' ? 'scheduled yet' : 'found'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(ev => <EventCard key={ev.id} event={ev} />)}
        </div>
      )}
    </div>
  );
}

function EventCard({ event }) {
  const { user } = useAuth();
  const [rsvpd, setRsvpd] = useState(event.hasRsvp || false);
  const [count, setCount] = useState(event._count?.rsvps || 0);
  const [busy, setBusy] = useState(false);

  const past = new Date(event.date) < new Date();

  async function toggleRsvp(e) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      if (rsvpd) {
        await api.del(`/api/events/${event.id}/rsvp`);
        setRsvpd(false); setCount(c => c - 1);
      } else {
        await api.post(`/api/events/${event.id}/rsvp`);
        setRsvpd(true); setCount(c => c + 1);
      }
    } catch (err) {
      alert(err.message);
    } finally { setBusy(false); }
  }

  return (
    <Link href={`/events/${event.id}`} className="bg-white border rounded-xl p-5 hover:border-brand-500 transition block">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full text-xs font-semibold">
            {new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{event.mode}</span>
        </div>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Users size={13} /> {count}
        </span>
      </div>

      <h3 className="font-semibold mt-3">{event.title}</h3>
      {event.location && (
        <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
          <MapPin size={14} className="text-gray-400" /> {event.location}
        </p>
      )}
      {event.description && (
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{event.description}</p>
      )}

      {user && !past && (
        <button onClick={toggleRsvp} disabled={busy}
          className={`mt-4 w-full text-sm font-semibold py-2 rounded-lg border ${
            rsvpd ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-brand-600 text-white border-brand-600 hover:bg-brand-700'
          } disabled:opacity-50`}>
          {rsvpd ? '✓ RSVP\'d — Click to cancel' : 'RSVP'}
        </button>
      )}
      {past && <span className="mt-3 inline-block text-xs bg-gray-100 px-2 py-0.5 rounded">Event ended</span>}
    </Link>
  );
}
