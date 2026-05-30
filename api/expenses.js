import { kv } from '@vercel/kv';
const KEY = 'expenses';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') {
    const data = await kv.get(KEY);
    return res.status(200).json(data || []);
  }
  if (req.method === 'POST') {
    const expense = req.body;
    const current = (await kv.get(KEY)) || [];
    await kv.set(KEY, [expense, ...current]);
    return res.status(200).json([expense, ...current]);
  }
  if (req.method === 'DELETE') {
    const { id } = req.query;
    const current = (await kv.get(KEY)) || [];
    const updated = current.filter(e => String(e.id) !== String(id));
    await kv.set(KEY, updated);
    return res.status(200).json(updated);
  }
}
