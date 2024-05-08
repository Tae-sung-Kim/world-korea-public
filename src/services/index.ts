import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

type APIResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

const instance: AxiosInstance = axios.create({
  timeout: 10000, // 요청 타임아웃 설정 (단위: 밀리초)
});

const methods = {
  get: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> => {
    try {
      const response = await instance.get<APIResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> => {
    try {
      const response = await instance.post<APIResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  put: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> => {
    try {
      const response = await instance.put<APIResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> => {
    try {
      const response = await instance.delete<APIResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default methods;
