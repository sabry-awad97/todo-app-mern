import DBG from 'debug';
import { AbstractStore } from './Todo';
const debug = DBG('todos:todos-store');
const error = DBG('todos:error-store');

let _Store: AbstractStore;

export async function useModel(model: string) {
  try {
    const Module = await import(`./${model}.ts`);
    const StoreClass = Module.default;
    debug(StoreClass.name);
    _Store = new StoreClass();
    return _Store;
  } catch (err) {
    error(err);
    throw new Error(`No recognized Store in ${model} because ${err}`);
  }
}

export { _Store as Store };
