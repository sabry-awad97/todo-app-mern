export class Todo {
  constructor(public id: string, public title: string) {}
}

export class TodoList {
  constructor(public id: string, public name: string, public todos: Todo[]) {
    this.todos = todos.map(todo => new Todo(todo.id, todo.title));
  }
}

export abstract class AbstractStore {
  abstract close(): Promise<void>;

  abstract createList(listName: string, todos: Todo[]): Promise<TodoList>;
  abstract readOneList(listName: string): Promise<TodoList>;

  abstract destroyOneTodo(
    listName: string,
    id: string
  ): Promise<TodoList | null>;

  abstract readOneTodo(listName: string, id: string): Promise<Todo | null>;

  abstract createOneTodo(
    listName: string,
    todoTitle: string
  ): Promise<TodoList>;
}
