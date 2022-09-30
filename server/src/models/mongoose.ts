import DBG from 'debug';
import mongoose, { Model, model, Schema, Types } from 'mongoose';

import { AbstractStore, Todo, TodoList } from './Todo';

const debug = DBG('todos:todos-mongooose');
const dbgError = DBG('todos:error-mongooose');

class Database {
  connection = mongoose.connection;

  constructor() {
    try {
      this.connection
        .once('open', () => debug('Database connection: open'))
        .on('close', () => debug('Database connection: close'))
        .on('disconnected', () => debug('Database connection: disconnected'))
        .on('reconnected', () => debug('Database connection: reconnected'))
        .on('fullsetup', () => debug('Database connection: fullsetup'))
        .on('all', () => debug('Database connection: all'))
        .on('error', error => error('MongoDB connection: error: ', error));
    } catch (err) {
      dbgError(err);
    }
  }

  async connect(uri: string) {
    try {
      await mongoose.connect(uri);
    } catch (err) {
      dbgError(err);
    }
  }

  async disconnect() {
    try {
      await this.connection.close();
    } catch (err) {
      dbgError(err);
    }
  }
}

const database = new Database();

process.on('SIGINT', async () => {
  await database.disconnect();
  process.exit(0);
});

let client = false;

const connectDB = async () => {
  if (!client && process.env.MONGO_URL) {
    await database.connect(process.env.MONGO_URL);
    client = true;
  }
};

interface IList {
  name: string;
  todos: Types.DocumentArray<Todo>;
}

interface IListDoc extends IList, Document {}

interface IListModel extends Model<IList> {}

const ListSchema = new Schema<IList, IListModel>({
  name: String,
  todos: [new Schema<Todo, Model<Todo>>({ title: String })],
});

const List = model<IListDoc, IListModel>('List', ListSchema);

export default class MongooseStore extends AbstractStore {
  async createOneTodo(listName: string, todoTitle: string): Promise<TodoList> {
    await connectDB();
    const list = await List.findOne({ name: listName });
    list?.todos.push({ title: todoTitle });
    const saved = await list!.save();
    return new TodoList(saved.id, saved.name, saved.todos);
  }

  async destroyOneTodo(listName: string, id: string): Promise<TodoList | null> {
    await connectDB();

    const list = await List.findOne({ name: listName });

    if (list) {
      const todos = list.todos.pull({ id: id });
      const saved = await list.save();
      return new TodoList(saved.id, saved.name, todos);
    }

    return null;
  }

  async createList(title: string, todos: Todo[]): Promise<TodoList> {
    await connectDB();

    const todoList = new List({ title, todos });
    const savedList = await todoList.save();
    return new TodoList(String(savedList.id), savedList.name, savedList.todos);
  }

  async readOneList(listName: string): Promise<TodoList> {
    await connectDB();
    let list = await List.findOne({ name: listName });
    if (!list) {
      list = await List.create({ name: listName, todos: [] });
    }
    return new TodoList(String(list.id), list.name, list.todos);
  }

  async readOneTodo(listName: string, id: string): Promise<Todo | null> {
    await connectDB();

    const list = await List.findOne({ name: listName });
    if (!list) return null;

    const todo = list.todos.find(todo => todo.id === id);
    if (!todo) return null;

    return new Todo(todo.id, todo.title);
  }

  async close(): Promise<void> {
    client = false;
    await database.disconnect();
  }
}
