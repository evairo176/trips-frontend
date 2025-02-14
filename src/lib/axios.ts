import axios, { AxiosRequestConfig } from 'axios';

// next
import { getSession } from 'next-auth/react';

const axiosServices = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3010/'
});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user.accessToken) {
      config.headers['Authorization'] = `Bearer ${session?.user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axiosServices.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response.status === 401 && !window.location.href.includes('/login')) {
//       window.location.pathname = '/login';
//     }
//     return Promise.reject((error.response && error.response.data) || 'Wrong Services');
//   }
// );

export default axiosServices;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (
  url: string,
  data: Record<string, any>,
  config: AxiosRequestConfig = {}
) => {
  try {
    const res = await axiosServices.post(url, data, config);

    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log({ error });
      throw new Error(error.response?.data?.message || 'Internal server error');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Something went wrong');
    }
  }
};

export const fetcherPut = async (
  url: string,
  data: Record<string, any>,
  config: AxiosRequestConfig = {}
) => {
  try {
    const res = await axiosServices.put(url, data, config);

    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log({ error });
      throw new Error(error.response?.data?.message || 'Internal server error');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Something went wrong');
    }
  }
};

export const fetcherDelete = async (
  url: string,
  config: AxiosRequestConfig = {}
) => {
  try {
    const res = await axiosServices.delete(url, config);

    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log({ error });
      throw new Error(error.response?.data?.message || 'Internal server error');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('Something went wrong');
    }
  }
};
