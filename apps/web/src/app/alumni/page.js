// apps/web/src/app/alumni/page.js
// Alumni directory with search & filters
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, Building2 } from 'lucide-react';
import { api } from '../../lib/api';

export default function AlumniDirectoryPage() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', batchYear: '', department: '', company: '', location: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page });
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const data = await api.get(`/api/users/alumni?${params}`);
      setPeople(data.alumni);
      setTotal(data.pagination.total);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [page]);

  function update(k, v) { setFilters(f => ({ ...f, [k]: v })); }

  function onSearch(e) {
    e.preventDefault();
    setPage(1);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Alumni Directory</h1>
      <p className="text-gray-600 text-sm mb-6">Find and connect with fellow alumni</p>

      {/* Search & Filters */}
      <form onSubmit={onSearch} className="bg-white border rounded-xl p-4 mb-6 space-y-3">
        <div className="flex items-center gap-2 border rounded-lg px-3">
          <Search size={18} className="text-gray-400" />
          <input value={filters.search} onChange={e => update('search', e.target.value)}
            placeholder="Search by name, company, role..." className="flex-1 py-2 outline-none" />
          <button className="bg-gray-900 text-white px-4 py-1.5 rounded text-sm">Search</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <input value={filters.batchYear} onChange={e => update('batchYear', e.target.value)}
            placeholder="Batch year" type="number" className="border rounded-lg px-3 py-2 text-sm" />
          <input value={filters.department} onChange={e => update('department', e.target.value)}
            placeholder="Department" className="border rounded-lg px-3 py-2 text-sm" />
          <input value={filters.company} onChange={e => update('company', e.target.value)}
            placeholder="Company" className="border rounded-lg px-3 py-2 text-sm" />
          <input value={filters.location} onChange={e => update('location', e.target.value)}
            placeholder="Location" className="border rounded-lg px-3 py-2 text-sm" />
        </div>
      </form>

      <p className="text-sm text-gray-600 mb-4">{total} {total === 1 ? 'person' : 'people'} found</p>

      {loading ? (
        <p>Loading...</p>
      ) : people.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          No matches. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map(p => <PersonCard key={p.id} person={p} />)}
        </div>
      )}
    </div>
  );
}

function PersonCard({ person }) {
  return (
    <Link href={`/alumni/${person.id}`} className="bg-white border rounded-xl p-5 hover:border-brand-500 hover:shadow-sm transition">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-lg font-bold text-brand-600">
          {person.name?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{person.name}</h3>
          <p className="text-xs text-gray-500 truncate">
            {person.batchYear && `Batch ${person.batchYear}`}
            {person.department && ` • ${person.department}`}
          </p>
        </div>
        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{person.role}</span>
      </div>

      {(person.jobTitle || person.currentCompany) && (
        <p className="text-sm text-gray-700 flex items-center gap-1.5">
          <Building2 size={14} className="text-gray-400" />
          {person.jobTitle}{person.jobTitle && person.currentCompany && ' at '}{person.currentCompany}
        </p>
      )}
      {person.location && (
        <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
          <MapPin size={14} className="text-gray-400" />
          {person.location}
        </p>
      )}
      {person.bio && (
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{person.bio}</p>
      )}
    </Link>
  );
}
