import express, { Request, Response } from 'express';

import items from '../models/items';
import workItems from '../models/workItems';

const router = express.Router();

router
  .route(/^\/(work)?$/)
  .get((req: Request, res: Response<{ title: string; items: string[] }>) => {
    const url = req.url;

    if (url === '/work') {
      return res.json({ title: 'Work List', items: workItems });
    }

    const today = new Date();
    const day = today.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    return res.json({ title: day, items: items });
  })
  .post(
    (req: Request<{}, {}, { newItem: string }>, res: Response<string[]>) => {
      const url = req.url;
      const { newItem } = req.body;

      if (url === '/work') {
        workItems.push(newItem);
        res.json(workItems);
      } else {
        items.push(newItem);
        res.json(items);
      }
    }
  );

export default router;
