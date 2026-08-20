// apps/web/src/components/NotificationBell.js
// Notification bell with unread badge + dropdown
'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck } from 'lucide-react';
import { api } from '../lib/api';

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    refreshUnread();
    const interval = setInterval(refreshUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function refreshUnread() {
    try {
      const d = await api.get('/api/notifications/unread-count');
      setUnread(d.count);
    } catch (_) { /* ignore */ }
  }

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      try {
        const d = await api.get('/api/notifications?limit=12');
        setNotifications(d.notifications);
        setUnread(d.unreadCount);
      } catch (_) {
      } finally { setLoading(false); }
    }
  }

  async function openNotification(n) {
    try {
      if (!n.isRead) {
        await api.patch(`/api/notifications/${n.id}/read`);
        setNotifications(list => list.map(x => x.id === n.id ? { ...x, isRead: true } : x));
        setUnread(u => Math.max(0, u - 1));
      }
    } catch (_) { /* ignore */ }
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  async function markAllRead() {
    try {
      await api.patch('/api/notifications/read-all');
      setNotifications(list => list.map(x => ({ ...x, isRead: true })));
      setUnread(0);
    } catch (_) { /* ignore */ }
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={toggle} className="relative p-2 hover:text-brand-600" aria-label="Notifications">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-2.5 border-b">
            <span className="font-semibold text-sm">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-brand-600 hover:underline">
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500 py-8 text-sm">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">No notifications yet</p>
            ) : (
              notifications.map(n => (
                <button key={n.id} onClick={() => openNotification(n)}
                  className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 ${n.isRead ? 'opacity-70' : 'bg-brand-50/40'}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg leading-none">{n.title?.[0]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-brand-500 mt-1 flex-none" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
