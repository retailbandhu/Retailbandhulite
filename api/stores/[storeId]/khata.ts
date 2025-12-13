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
      const entries = await db.select().from(schema.khataEntries).where(eq(schema.khataEntries.storeId, storeId));
      return res.status(200).json(entries);
    }

    if (req.method === 'POST') {
      const { customerId, customerName, amount, type, description, billId } = req.body;
      const [entry] = await db.insert(schema.khataEntries).values({
        storeId,
        customerId,
        customerName,
        amount: amount.toString(),
        type,
        description,
        billId,
      }).returning();
      return res.status(201).json(entry);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Khata API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
