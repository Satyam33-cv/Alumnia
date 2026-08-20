// apps/web/src/app/jobs/[id]/page.js
// Job detail with referral request modal
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Building2, Calendar, Eye, Users } from 'lucide-react';
import { api } from '../../../lib/api';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get(`/api/jobs/${id}`).then(d => setJob(d.job)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div>
      <Link href="/jobs" className="text-sm text-brand-600 hover:underline">← Back to jobs</Link>

      <div className="bg-white border rounded-xl p-8 mt-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-2">
              <span className="flex items-center gap-1"><Building2 size={16} /> {job.company}</span>
              <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
              {job.jobType && <span className="bg-gray-100 px-2 py-0.5 rounded text-sm">{job.jobType}</span>}
              {job.experienceLevel && <span className="bg-gray-100 px-2 py-0.5 rounded text-sm">{job.experienceLevel}</span>}
            </div>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-brand-700">
            Request Referral
          </button>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4 pt-4 border-t">
          <span className="flex items-center gap-1"><Eye size={14} /> {job.viewsCount} views</span>
          <span className="flex items-center gap-1"><Users size={14} /> {job._count?.referrals || 0} requests</span>
          {job.deadline && <span className="flex items-center gap-1"><Calendar size={14} /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Requirements</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
          </div>
        )}

        {job.skills && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.split(',').map(s => (
                <span key={s} className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm">{s.trim()}</span>
              ))}
            </div>
          </div>
        )}

        {(job.salaryMin || job.salaryMax) && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Salary</h2>
            <p>{job.currency} {job.salaryMin?.toLocaleString()}{job.salaryMax ? ` – ${job.salaryMax.toLocaleString()}` : ''}</p>
          </div>
        )}

        {job.postedBy && (
          <div className="mt-6 pt-6 border-t">
            <h2 className="font-semibold mb-2">Posted by</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-semibold text-brand-600">
                {job.postedBy.name?.[0]}
              </div>
              <div>
                <p className="font-medium">{job.postedBy.name}</p>
                <p className="text-sm text-gray-600">
                  {job.postedBy.jobTitle} at {job.postedBy.currentCompany}
                  {job.postedBy.batchYear ? ` • Batch of ${job.postedBy.batchYear}` : ''}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && <ReferralModal job={job} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function ReferralModal({ job, onClose }) {
  const router = useRouter();
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [studentNote, setStudentNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(''); setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const data = await api.upload('/api/uploads/resume', form);
      setResumeUrl(data.url);
      setResumeName(data.filename);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/api/referrals', { jobId: job.id, resumeUrl, coverLetter, studentNote });
      onClose();
      router.push('/referrals/me');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-1">Request Referral</h2>
        <p className="text-sm text-gray-600 mb-4">For: {job.title} at {job.company}</p>

        <form onSubmit={submit} className="space-y-3">
          {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-1">Resume</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 border border-dashed border-brand-400 bg-brand-50 text-brand-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-brand-100 text-sm font-medium">
                <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFile} className="hidden" />
                {uploading ? 'Uploading...' : 'Upload file'}
              </label>
              {resumeName && <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-brand-600 hover:underline">{resumeName}</a>}
            </div>
            <input value={resumeUrl} onChange={e => setResumeUrl(e.target.value)}
              placeholder="...or paste a link (Google Drive / Dropbox)"
              className="w-full border rounded-lg px-3 py-2 mt-2 text-sm" />
            <p className="text-xs text-gray-500 mt-1">PDF / DOC / DOCX, up to 5 MB</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cover Letter (optional)</label>
            <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={3}
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Note to alumni</label>
            <textarea value={studentNote} onChange={e => setStudentNote(e.target.value)} rows={2}
              placeholder="Why are you a good fit?"
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button>
            <button disabled={loading || uploading} className="flex-1 bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
