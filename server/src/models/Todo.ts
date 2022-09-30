export class Todo {
  constructor(public title: string, public id: string) {}
}

export abstract class AbstractStore {
  abstract create(title: string): Promise<Todo>;
  abstract readAll(): Promise<Todo[]>;
  abstract destroy(id: string): Promise<Todo | null>;
  abstract close(): Promise<void>;
}
