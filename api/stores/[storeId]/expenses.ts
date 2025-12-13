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
      const expenses = await db.select().from(schema.expenses).where(eq(schema.expenses.storeId, storeId));
      return res.status(200).json(expenses);
    }

    if (req.method === 'POST') {
      const { category, amount, description, paymentMethod, partyName } = req.body;
      const [expense] = await db.insert(schema.expenses).values({
        storeId,
        category,
        amount: amount.toString(),
        description,
        paymentMethod,
        partyName,
      }).returning();
      return res.status(201).json(expense);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Expenses API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
