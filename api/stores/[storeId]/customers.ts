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
      const customers = await db.select().from(schema.customers).where(eq(schema.customers.storeId, storeId));
      return res.status(200).json(customers);
    }

    if (req.method === 'POST') {
      const { name, phone, email, address } = req.body;
      const [customer] = await db.insert(schema.customers).values({
        storeId,
        name,
        phone,
        email,
        address,
      }).returning();
      return res.status(201).json(customer);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Customers API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
