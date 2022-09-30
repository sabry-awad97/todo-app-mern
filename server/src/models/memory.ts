import { Todo, AbstractStore, TodoList } from './Todo';
import { nanoid } from 'nanoid';

const todos: Todo[] = [];

export default class InMemoryStore extends AbstractStore {
  createList(listName: string, todos: Todo[]): Promise<TodoList> {
    throw new Error('Method not implemented.');
  }
  readOneList(listName: string): Promise<TodoList> {
    throw new Error('Method not implemented.');
  }
  destroyOneTodo(listName: string, id: string): Promise<TodoList | null> {
    throw new Error('Method not implemented.');
  }
  readOneTodo(listName: string, id: string): Promise<Todo | null> {
    throw new Error('Method not implemented.');
  }
  createOneTodo(listName: string, todoTitle: string): Promise<TodoList> {
    throw new Error('Method not implemented.');
  }

  async close(): Promise<void> {}
}
