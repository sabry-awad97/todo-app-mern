const BASE_URL = import.meta.env.DEV ? 'http://localhost:3000' : '/';

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: BASE_URL,
});

export interface Todo {
  title: string;
}

export const getAll = async () => {
  const reponse = await axiosClient.get<Todo[]>('/');
  return reponse.data;
};

export const createTodo = (title: string) =>
  axiosClient.post<Todo[]>('/', { title });
