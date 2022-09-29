import DBG from 'debug';
import mongoose, { model, Model, Schema } from 'mongoose';

import { AbstractStore } from './Todo';
import { Todo as TodoClass } from './Todo';

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

interface ITodoDoc extends TodoClass, Document {}

interface ITodoModel extends Model<TodoClass> {}

const TodoSchema = new Schema<TodoClass, ITodoModel>({
  title: String,
});

const Todo = model<ITodoDoc, ITodoModel>('Todo', TodoSchema);

export default class MongooseStore extends AbstractStore {
  async create(title: string): Promise<TodoClass> {
    await connectDB();
    const todo = new Todo({ title });
    const savedTodo = await todo.save();
    return savedTodo;
  }

  async readAll(): Promise<TodoClass[]> {
    await connectDB();
    const todos = await Todo.find({});
    return todos;
  }

  async close(): Promise<void> {
    client = false;
    await database.disconnect();
  }
}
