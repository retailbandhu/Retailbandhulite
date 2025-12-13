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
      const bills = await db.select().from(schema.bills).where(eq(schema.bills.storeId, storeId));
      return res.status(200).json(bills);
    }

    if (req.method === 'POST') {
      const { customerId, billNumber, items, subtotal, tax, discount, total, paymentMethod, gstEnabled, notes } = req.body;
      const [bill] = await db.insert(schema.bills).values({
        storeId,
        customerId,
        billNumber,
        items,
        subtotal: subtotal.toString(),
        tax: tax?.toString() || "0",
        discount: discount?.toString() || "0",
        total: total.toString(),
        paymentMethod,
        gstEnabled,
        notes,
      }).returning();
      return res.status(201).json(bill);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Bills API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
