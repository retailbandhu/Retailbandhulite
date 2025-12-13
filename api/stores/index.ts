import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, schema } from '../_db';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const stores = await db.select().from(schema.stores);
      return res.status(200).json(stores);
    }

    if (req.method === 'POST') {
      const { name, owner, address, phone, logo, billColor, gstin, userId } = req.body;
      const [store] = await db.insert(schema.stores).values({
        name,
        owner,
        address,
        phone,
        logo,
        billColor,
        gstin,
        userId,
      }).returning();
      return res.status(201).json(store);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Store API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
