// apps/web/src/lib/api.js
// Centralized API client
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const headers = isForm ? { ...options.headers } : { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  get:  (path)        => request(path, { method: 'GET' }),
  post: (path, body)  => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:(path, body)  => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  del:  (path)        => request(path, { method: 'DELETE' }),
  // Multipart upload (FormData) — no Content-Type so the browser sets the boundary
  upload: (path, formData) => request(path, { method: 'POST', body: formData, headers: {} }),
};
