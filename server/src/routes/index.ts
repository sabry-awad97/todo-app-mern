import express, { Request, Response } from 'express';
import { Store as todos } from '../models/store';

import { Todo } from '../models/Todo';

const router = express.Router();

router
  .route('/')
  .get(async (req: Request, res: Response<Todo[]>) => {
    const items = await todos.readAll();
    return res.json(items);
  })
  .post(async (req: Request<{}, {}, Todo>, res: Response<Todo>) => {
    const { title } = req.body;
    const todo = await todos.create(title);
    return res.json(todo);
  });

export default router;
