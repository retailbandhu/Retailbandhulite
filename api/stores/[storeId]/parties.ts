import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, schema } from '../../_db';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const storeId = parseInt(req.query.storeId as string);
  
  if (isNaN(storeId)) {
    return res.status(400).json({ error: 'Invalid store ID' });
  }

  try {
    if (req.method === 'GET') {
      const parties = await db.select().from(schema.parties).where(eq(schema.parties.storeId, storeId));
      return res.status(200).json(parties);
    }

    if (req.method === 'POST') {
      const { name, phone, type } = req.body;
      const [party] = await db.insert(schema.parties).values({
        storeId,
        name,
        phone,
        type,
      }).returning();
      return res.status(201).json(party);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Parties API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
