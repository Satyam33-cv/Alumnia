// apps/web/src/app/jobs/post/page.js
// Form for alumni to post a job
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', company: '', location: '', jobType: 'FULL_TIME',
    experienceLevel: 'ENTRY', description: '', requirements: '',
    skills: '', salaryMin: '', salaryMax: '', currency: 'INR',
    applyLink: '', deadline: '', referralSlots: 1,
  });

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await api.post('/api/jobs', {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        referralSlots: Number(form.referralSlots),
      });
      router.push(`/jobs/${data.job.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Post a Job</h1>
      <p className="text-gray-600 text-sm mb-6">Help students and fellow alumni by sharing an opening at your company</p>

      <form onSubmit={submit} className="bg-white border rounded-xl p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Job Title *" value={form.title} onChange={v => update('title', v)} required />
          <Field label="Company *" value={form.company} onChange={v => update('company', v)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Location *" value={form.location} onChange={v => update('location', v)} required />
          <div>
            <label className="block text-sm font-medium mb-1">Job Type</label>
            <select value={form.jobType} onChange={e => update('jobType', e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option>FULL_TIME</option><option>INTERNSHIP</option><option>CONTRACT</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} required
            className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Requirements</label>
          <textarea value={form.requirements} onChange={e => update('requirements', e.target.value)} rows={3}
            className="w-full border rounded-lg px-3 py-2" />
        </div>

        <Field label="Skills (comma-separated)" value={form.skills} onChange={v => update('skills', v)} placeholder="React, Node.js, AWS" />

        <div className="grid grid-cols-3 gap-4">
          <Field label="Salary Min" value={form.salaryMin} onChange={v => update('salaryMin', v)} type="number" />
          <Field label="Salary Max" value={form.salaryMax} onChange={v => update('salaryMax', v)} type="number" />
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select value={form.currency} onChange={e => update('currency', e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option>INR</option><option>USD</option><option>EUR</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="External Apply Link" value={form.applyLink} onChange={v => update('applyLink', v)} type="url" />
          <Field label="Application Deadline" value={form.deadline} onChange={v => update('deadline', v)} type="date" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Referral Slots</label>
          <input type="number" min="1" value={form.referralSlots} onChange={e => update('referralSlots', e.target.value)}
            className="w-full border rounded-lg px-3 py-2" />
          <p className="text-xs text-gray-500 mt-1">How many candidates you can refer for this role</p>
        </div>

        <button disabled={loading} className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2" />
    </div>
  );
}
