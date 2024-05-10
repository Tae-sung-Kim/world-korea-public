// import authService from '@/services/authService';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const instance: AxiosInstance = axios.create({
  timeout: 10000, // 요청 타임아웃 설정 (단위: 밀리초)
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

instance.interceptors.request.use(
  async config => {
    // const session = await authService.getSession();
    // console.log('hi', session);
    return config;
  },
  error => {
    // 요청이 실패한 경우 에러 처리를 할 수 있습니다.
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

const methods = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await instance.get<T>(url, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await instance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  put: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await instance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await instance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default methods;
