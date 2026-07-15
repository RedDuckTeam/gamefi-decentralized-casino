import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL;

export const instance = axios.create({
  baseURL,
});

export const fetcher = (url: string) => instance.get(url);
