export class Todo {
  constructor(public title: string) {}

  get JSON() {
    return JSON.stringify({
      title: this.title,
    });
  }

  static fromJSON(json: string) {
    const data = JSON.parse(json);

    if (
      typeof data !== 'object' ||
      !data.hasOwnProperty('title') ||
      typeof data.title !== 'string'
    ) {
      throw new Error(`Not a Todo: ${json}`);
    }

    return new this(data.title);
  }
}

export abstract class AbstractStore {
  abstract create(title: string): Promise<Todo>;
  abstract readAll(): Promise<Todo[]>;
  abstract close(): Promise<void>;
}
