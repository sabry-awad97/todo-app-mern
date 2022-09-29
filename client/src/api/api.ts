const BASE_URL = import.meta.env.DEV ? 'http://localhost:3000' : '/';

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: BASE_URL,
});

interface Data {
  title: string;
  items: string[];
}

export const getAll = async (url: string) => {
  const reponse = await axiosClient.get<Data>(url);
  return reponse.data;
};

export const createTodo = (url: string, todo: string) =>
  axiosClient.post<Data>(url, { newItem: todo });
