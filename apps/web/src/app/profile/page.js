// apps/web/src/app/profile/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    setForm({
      name: user.name || '', phone: user.phone || '',
      batchYear: user.batchYear || '', department: user.department || '',
      currentCompany: user.currentCompany || '', jobTitle: user.jobTitle || '',
      location: user.location || '', linkedinUrl: user.linkedinUrl || '',
      bio: user.bio || '', skills: user.skills || '', interests: user.interests || '',
    });
  }, [user, authLoading, router]);

  if (authLoading || !form) return <p>Loading...</p>;

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleResume(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setMessage('');
    try {
      const form = new FormData();
      form.append('file', file);
      const data = await api.upload('/api/uploads/resume', form);
      const updated = await api.patch('/api/users/me', { resumeUrl: data.url });
      setUser(updated.user);
      setMessage('✅ Resume uploaded');
    } catch (err) {
      setMessage('❌ ' + err.message);
    } finally { setUploading(false); }
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true); setMessage('');
    try {
      const data = await api.patch('/api/users/me', form);
      setUser(data.user);
      setMessage('✅ Profile saved');
    } catch (err) {
      setMessage('❌ ' + err.message);
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-2xl font-bold text-brand-600">
          {user.name?.[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-gray-600">{user.email} • {user.role}</p>
        </div>
      </div>

      {message && <div className="mb-4 p-3 rounded-lg bg-gray-50 text-sm">{message}</div>}

      <form onSubmit={save} className="bg-white border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" value={form.name} onChange={v => update('name', v)} />
          <Field label="Phone" value={form.phone} onChange={v => update('phone', v)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Batch Year" value={form.batchYear} onChange={v => update('batchYear', v)} type="number" />
          <Field label="Department" value={form.department} onChange={v => update('department', v)} />
        </div>

        {user.role === 'ALUMNI' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Current Company" value={form.currentCompany} onChange={v => update('currentCompany', v)} />
              <Field label="Job Title" value={form.jobTitle} onChange={v => update('jobTitle', v)} />
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Location" value={form.location} onChange={v => update('location', v)} />
          <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={v => update('linkedinUrl', v)} type="url" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Resume</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 border border-dashed border-brand-400 bg-brand-50 text-brand-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-brand-100 text-sm font-medium">
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleResume} className="hidden" />
              {uploading ? 'Uploading...' : 'Upload resume'}
            </label>
            {user.resumeUrl && <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-brand-600 hover:underline">View current resume</a>}
          </div>
          <p className="text-xs text-gray-500 mt-1">PDF / DOC / DOCX, up to 5 MB</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={3}
            placeholder="Tell others about yourself..."
            className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Skills (comma-separated)" value={form.skills} onChange={v => update('skills', v)} placeholder="React, Python, DSA" />
          <Field label="Interests (comma-separated)" value={form.interests} onChange={v => update('interests', v)} placeholder="AI, Product, Startups" />
        </div>
        <p className="text-xs text-gray-500 -mt-2">Used by AI Smart Matching to recommend alumni</p>

        <button disabled={saving} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2" />
    </div>
  );
}
