import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const KEY = 'expenses';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const data = await redis.get(KEY);
    return res.status(200).json(data || []);
  }
  if (req.method === 'POST') {
    const expense = req.body;
    const current = (await redis.get(KEY)) || [];
    const updated = [expense, ...current];
    await redis.set(KEY, updated);
    return res.status(200).json(updated);
  }
  if (req.method === 'DELETE') {
    const { id } = req.query;
    const current = (await redis.get(KEY)) || [];
    const updated = current.filter(e => String(e.id) !== String(id));
    await redis.set(KEY, updated);
    return res.status(200).json(updated);
  }
}
