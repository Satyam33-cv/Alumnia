// apps/web/src/app/jobs/page.js
// Browse all open jobs
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Building2, Plus } from 'lucide-react';
import { api } from '../../lib/api';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (location) params.set('location', location);
      const data = await api.get(`/api/jobs?${params}`);
      setJobs(data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Open Positions</h1>
          <p className="text-gray-600 text-sm">Jobs posted by alumni at their companies</p>
        </div>
        <Link href="/jobs/post" className="bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-700">
          <Plus size={18} /> Post a Job
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 border rounded-lg px-3">
          <Search size={18} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
            placeholder="Search title, company, skills..."
            className="flex-1 py-2 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 border rounded-lg px-3 md:w-64">
          <MapPin size={18} className="text-gray-400" />
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
            placeholder="Location"
            className="flex-1 py-2 outline-none"
          />
        </div>
        <button onClick={load} className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800">
          Search
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-gray-500">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <p className="text-gray-500">No jobs found. Be the first to post!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job.id}`} className="bg-white border rounded-xl p-5 hover:border-brand-500 hover:shadow-sm transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{job.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
            <span className="flex items-center gap-1"><Building2 size={14} /> {job.company}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
            {job.jobType && <span className="bg-gray-100 px-2 py-0.5 rounded">{job.jobType}</span>}
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-gray-500">
        <span>Posted by {job.postedBy?.name} {job.postedBy?.batchYear ? `(${job.postedBy.batchYear})` : ''}</span>
        <span>{job._count?.referrals || 0} referrals • {job.viewsCount} views</span>
      </div>
    </Link>
  );
}
