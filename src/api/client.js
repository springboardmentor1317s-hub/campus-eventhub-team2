// src/api/client.js
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, opts = {}) {
  const headers = opts.headers || {};
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...opts, headers });
  const contentType = res.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    const err = new Error(payload?.error || payload?.message || res.statusText);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

export function post(path, body) {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
}
export function get(path) {
  return request(path, { method: 'GET' });
}