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
      const products = await db.select().from(schema.products).where(eq(schema.products.storeId, storeId));
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const { name, price, stock, category, image, barcode, hsnCode, gstRate, reorderLevel } = req.body;
      const [product] = await db.insert(schema.products).values({
        storeId,
        name,
        price: price.toString(),
        stock: stock || 0,
        category,
        image,
        barcode,
        hsnCode,
        gstRate: gstRate?.toString(),
        reorderLevel,
      }).returning();
      return res.status(201).json(product);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
