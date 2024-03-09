import axios, { AxiosRequestConfig } from "axios";

const baseUrl = "";

const Calls = {
  post: <T extends object>(endpoint: string, body: T) => {
    console.log(`${baseUrl}${endpoint}`);
    return axios.post<T>(`${baseUrl}${endpoint}`, body);
  },
  get: <T extends object>(endpoint: string, args: AxiosRequestConfig<T>) => {
    // console.log(`${baseUrl}${endpoint}`);
    return axios.get<T>(`${baseUrl}${endpoint}`, args);
  },
};

export default Calls;
