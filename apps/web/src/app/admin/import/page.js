// apps/web/src/app/admin/import/page.js
// Admin: bulk CSV import of alumni
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, Download, CheckCircle2, XCircle, SkipForward } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminImportPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) router.push('/');
  }, [user, loading, router]);

  if (loading || !user) return <p>Loading...</p>;

  async function submit(e) {
    e.preventDefault();
    if (!file) { setError('Please choose a CSV file'); return; }
    setError(''); setResult(null); setBusy(true);

    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/admin/import-csv`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Import failed: ${res.status}`);
      setResult(data.summary);
    } catch (err) {
      setError(err.message);
    } finally { setBusy(false); }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin" className="text-sm text-brand-600 hover:underline">← Admin</Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">Bulk Import Alumni</h1>
      <p className="text-gray-600 text-sm mb-6">Upload a CSV of alumni to create accounts in bulk</p>

      <form onSubmit={submit} className="bg-white border rounded-xl p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-brand-500 hover:bg-brand-50/30 transition">
          <Upload size={28} className="text-gray-400 mb-2" />
          <p className="text-sm font-medium">{file ? file.name : 'Choose a CSV file'}</p>
          <p className="text-xs text-gray-500 mt-1">{file ? `${(file.size / 1024).toFixed(1)} KB` : 'Max 5 MB'}</p>
          <input type="file" accept=".csv,text/csv" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
        </label>

        <button disabled={busy} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50">
          {busy ? 'Importing...' : 'Import Alumni'}
        </button>
      </form>

      <div className="mt-6 bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-2">CSV Format</h2>
        <p className="text-sm text-gray-600 mb-3">Required columns: <code className="bg-gray-100 px-1 rounded">name</code>, <code className="bg-gray-100 px-1 rounded">email</code>. Optional: <code className="bg-gray-100 px-1 rounded">batchYear</code>, <code className="bg-gray-100 px-1 rounded">department</code>, <code className="bg-gray-100 px-1 rounded">currentCompany</code>, <code className="bg-gray-100 px-1 rounded">jobTitle</code>, <code className="bg-gray-100 px-1 rounded">location</code>, <code className="bg-gray-100 px-1 rounded">phone</code>, <code className="bg-gray-100 px-1 rounded">linkedinUrl</code></p>
        <pre className="bg-gray-50 border rounded-lg p-3 text-xs overflow-x-auto whitespace-pre">
{`name,email,batchYear,department,currentCompany,jobTitle
Aarav Sharma,aarav@gmail.com,2018,CSE,Google,Software Engineer
Priya Patel,priya@yahoo.com,2019,ECE,Microsoft,Product Manager`}
        </pre>
        <button onClick={() => downloadTemplate()} className="mt-3 text-sm text-brand-600 hover:underline inline-flex items-center gap-1">
          <Download size={14} /> Download sample CSV
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-3">
          <div className="bg-white border rounded-xl p-5">
            <h2 className="font-semibold mb-3">Import Summary</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-green-50 rounded-lg py-3">
                <p className="text-2xl font-bold text-green-700">{result.imported}</p>
                <p className="text-xs text-green-800">Imported</p>
              </div>
              <div className="bg-yellow-50 rounded-lg py-3">
                <p className="text-2xl font-bold text-yellow-700">{result.skipped}</p>
                <p className="text-xs text-yellow-800">Skipped (duplicates)</p>
              </div>
              <div className="bg-red-50 rounded-lg py-3">
                <p className="text-2xl font-bold text-red-700">{result.failed}</p>
                <p className="text-xs text-red-800">Failed</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-50 text-amber-800 text-sm">
              <strong>Temp password for imported accounts:</strong> <code className="bg-white px-1.5 py-0.5 rounded">{result.tempPassword}</code>
              <p className="text-xs mt-1">Welcome emails (with activation link) will be sent automatically once SendGrid is configured in Phase 4.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function downloadTemplate() {
  const csv = 'name,email,batchYear,department,currentCompany,jobTitle,location,phone,linkedinUrl\n' +
    'Aarav Sharma,aarav@gmail.com,2018,CSE,Google,Software Engineer,Bengaluru,9876500001,https://linkedin.com/in/aarav\n' +
    'Priya Patel,priya@yahoo.com,2019,ECE,Microsoft,Product Manager,Hyderabad,9876500002,https://linkedin.com/in/priya\n';
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'alumni-import-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}
