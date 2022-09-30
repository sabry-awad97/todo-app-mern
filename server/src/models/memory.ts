import { Todo, AbstractStore } from './Todo';
import { nanoid } from 'nanoid';

const todos: Todo[] = [];

export default class InMemoryStore extends AbstractStore {
  destroy(id: string): Promise<Todo> {
    throw new Error('Method not implemented.');
  }

  async readAll(): Promise<Todo[]> {
    return todos;
  }

  async create(title: string): Promise<Todo> {
    const todo = new Todo(title, nanoid());
    todos.push(todo);
    return todo;
  }

  async close(): Promise<void> {}
}
