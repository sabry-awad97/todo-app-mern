export class Todo {
  constructor(public title: string) {}
}

export abstract class AbstractStore {
  abstract create(title: string): Promise<Todo>;
  abstract readAll(): Promise<Todo[]>;
  abstract close(): Promise<void>;
}
