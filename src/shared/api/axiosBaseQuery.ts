import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { type AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axiosInstance";
import { getApiErrorMessage } from "./getApiErrorMessage";

interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
}

interface AxiosBaseQueryError {
  status?: number;
  message: string;
}

// Мост между RTK Query и нашим axiosInstance.
// Токен и обработка 401 уже внутри axiosInstance, тут их не дублируем.
export function axiosBaseQuery(): BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  AxiosBaseQueryError
> {
  return async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await axiosInstance({ url, method, data, params, headers });
      // 204 No Content (например, фильтр без совпадений) -> пустое тело, отдаём null
      const body = result.status === 204 || result.data === "" ? null : result.data;
      return { data: body };
    } catch (error) {
      return {
        error: {
          status: axios.isAxiosError(error) ? error.response?.status : undefined,
          message: getApiErrorMessage(error),
        },
      };
    }
  };
}
