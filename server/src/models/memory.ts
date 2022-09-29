import { Todo, AbstractStore } from './Todo';

const todos: Todo[] = [];

export default class InMemoryStore extends AbstractStore {
  async readAll(): Promise<Todo[]> {
    return todos;
  }

  async create(title: string): Promise<Todo> {
    const todo = new Todo(title);
    todos.push(todo);
    return todo;
  }

  async close(): Promise<void> {}
}
