// apps/web/src/app/referrals/me/page.js
// Dashboard showing sent and received referrals
'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

const STATUS_STYLES = {
  PENDING:   'bg-yellow-100 text-yellow-800',
  ACCEPTED:  'bg-blue-100 text-blue-800',
  REJECTED:  'bg-red-100 text-red-800',
  REFERRED:  'bg-indigo-100 text-indigo-800',
  HIRED:     'bg-green-100 text-green-800',
  NOT_HIRED: 'bg-gray-100 text-gray-800',
  WITHDRAWN: 'bg-gray-100 text-gray-500',
};

export default function MyReferralsPage() {
  const [tab, setTab] = useState('sent');
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/referrals/me/sent'),
      api.get('/api/referrals/me/received'),
    ]).then(([s, r]) => {
      setSent(s.referrals);
      setReceived(r.referrals);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const list = tab === 'sent' ? sent : received;
  const emptyMsg = tab === 'sent' ? "You haven't requested any referrals yet." : "No one has requested a referral from you yet.";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">My Referrals</h1>
      <p className="text-gray-600 text-sm mb-6">Track your referral requests</p>

      <div className="flex gap-2 mb-6 border-b">
        <button onClick={() => setTab('sent')}
          className={`px-4 py-2 font-medium ${tab === 'sent' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-gray-600'}`}>
          Sent ({sent.length})
        </button>
        <button onClick={() => setTab('received')}
          className={`px-4 py-2 font-medium ${tab === 'received' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-gray-600'}`}>
          Received ({received.length})
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">{emptyMsg}</div>
      ) : (
        <div className="space-y-3">
          {list.map(r => (
            <div key={r.id} className="bg-white border rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{r.job.title}</h3>
                  <p className="text-sm text-gray-600">{r.job.company}</p>
                  {tab === 'sent' ? (
                    <p className="text-xs text-gray-500 mt-1">Referred by: {r.referredBy.name} • {r.referredBy.currentCompany}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">From: {r.requestedBy.name} {r.requestedBy.batchYear ? `(${r.requestedBy.batchYear} • ${r.requestedBy.department})` : ''}</p>
                  )}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status]}`}>
                  {r.status}
                </span>
              </div>
              {tab === 'received' && (
                <ReceivedActions referral={r} onUpdate={setReceived} list={received} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReceivedActions({ referral, list, onUpdate }) {
  const [loading, setLoading] = useState(false);
  if (!['PENDING', 'ACCEPTED'].includes(referral.status)) return null;

  async function update(status, extra = {}) {
    setLoading(true);
    try {
      const data = await api.patch(`/api/referrals/${referral.id}/status`, { status, ...extra });
      onUpdate(list.map(r => r.id === referral.id ? { ...r, ...data.referral } : r));
    } catch (err) {
      alert(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="mt-3 pt-3 border-t flex gap-2">
      {referral.status === 'PENDING' && (
        <>
          <button onClick={() => update('ACCEPTED')} disabled={loading}
            className="bg-green-600 text-white text-sm px-3 py-1.5 rounded hover:bg-green-700">Accept</button>
          <button onClick={() => { const reason = prompt('Reason for rejection (optional):'); update('REJECTED', { rejectionReason: reason }); }} disabled={loading}
            className="bg-red-100 text-red-700 text-sm px-3 py-1.5 rounded hover:bg-red-200">Reject</button>
        </>
      )}
      {referral.status === 'ACCEPTED' && (
        <button onClick={() => update('REFERRED')} disabled={loading}
          className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded hover:bg-indigo-700">
          Mark as Referred ✓
        </button>
      )}
    </div>
  );
}
