const BASE_URL = import.meta.env.DEV ? 'http://localhost:3000' : '/';

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: BASE_URL,
});

interface Todo {
  title: string;
  id: string;
}

export interface TodoList {
  name: string;
  todos: Todo[];
}

export const getTodoList = async (listName: string) => {
  const reponse = await axiosClient.get<TodoList>(`${listName}`);
  return reponse.data;
};

export const createTodo = (listName: string, todoTitle: string) =>
  axiosClient.post<Todo[]>(`/${listName}`, { title: todoTitle });

export const deleteTodo = async (listName: string, id: string) => {
  await axiosClient.delete(`/${listName}/${id}`);
};
