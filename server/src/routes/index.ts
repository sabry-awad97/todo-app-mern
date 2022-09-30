import express, { Request, Response } from 'express';
import { Store as lists } from '../models/store';
import { Todo, TodoList } from '../models/Todo';

const router = express.Router();

router
  .route('/:listName')
  .get(async (req: Request<{ listName: string }>, res) => {
    const customListName = req.params.listName.toLowerCase();
    const found = await lists.readOneList(customListName);
    return res.json(found);
  })
  .post(
    async (
      req: Request<{ listName: string }, {}, { title: string }>,
      res: Response<TodoList>
    ) => {
      const listName = req.params.listName.toLowerCase();
      const { title } = req.body;
      const todoList = await lists.createOneTodo(listName, title);
      return res.json(todoList);
    }
  );

router
  .route('/:listName/:id')
  .get(
    async (
      req: Request<{ listName: string; id: string }>,
      res: Response<Todo | null>
    ) => {
      const { listName, id } = req.params;
      const todo = await lists.readOneTodo(listName.toLowerCase(), id);
      return res.json(todo);
    }
  )
  .delete(
    async (
      req: Request<{ listName: string; id: string }>,
      res: Response<TodoList | null>
    ) => {
      const { listName, id } = req.params;
      const list = await lists.destroyOneTodo(listName.toLowerCase(), id);
      return res.json(list);
    }
  );

export default router;
