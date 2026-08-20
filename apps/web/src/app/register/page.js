// apps/web/src/app/register/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'STUDENT',
    batchYear: '', department: '',
    currentCompany: '', jobTitle: '',
    phone: '', linkedinUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function nextStep(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Name, email and password are required');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setStep(2);
  }

  async function submit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = { ...form };
      delete payload.confirmPassword;
      if (!payload.batchYear) delete payload.batchYear;
      await register(payload);
      router.push('/profile');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Create your account</h1>
      <p className="text-gray-600 text-sm mb-6">Join your college's alumni network</p>

      <div className="bg-white border rounded-xl p-6">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}

        {step === 1 && (
          <form onSubmit={nextStep} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">I am a *</label>
              <div className="grid grid-cols-3 gap-2">
                {['STUDENT', 'ALUMNI', 'FACULTY'].map(r => (
                  <button key={r} type="button" onClick={() => update('role', r)}
                    className={`py-2 rounded-lg text-sm font-medium border ${
                      form.role === r ? 'bg-brand-600 text-white border-brand-600' : 'bg-white hover:bg-gray-50'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} required
                className="w-full border rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required
                className="w-full border rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)} required
                className="w-full border rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required
                className="w-full border rounded-lg px-3 py-2" />
            </div>

            <button className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700">
              Continue
            </button>

            <p className="text-sm text-center text-gray-600">
              Already have an account? <Link href="/login" className="text-brand-600 font-medium">Sign in</Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-gray-600">Tell us a bit more (you can edit later)</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Batch Year</label>
                <input type="number" value={form.batchYear} onChange={e => update('batchYear', e.target.value)}
                  placeholder="2024" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input value={form.department} onChange={e => update('department', e.target.value)}
                  placeholder="CSE" className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>

            {form.role === 'ALUMNI' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Company</label>
                  <input value={form.currentCompany} onChange={e => update('currentCompany', e.target.value)}
                    placeholder="Google" className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Job Title</label>
                  <input value={form.jobTitle} onChange={e => update('jobTitle', e.target.value)}
                    placeholder="Software Engineer" className="w-full border rounded-lg px-3 py-2" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input value={form.phone} onChange={e => update('phone', e.target.value)}
                className="w-full border rounded-lg px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
              <input type="url" value={form.linkedinUrl} onChange={e => update('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/in/..." className="w-full border rounded-lg px-3 py-2" />
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="flex-1 border py-2.5 rounded-lg hover:bg-gray-50">
                Back
              </button>
              <button disabled={loading} className="flex-1 bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
