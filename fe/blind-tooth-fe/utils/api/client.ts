import axios from "axios";

const baseUrl =
  "https://qd25mzh8u1.execute-api.eu-west-1.amazonaws.com/default/restApi/";

const Calls = {
  post: <T extends object>(endpoint: string, body: T) => {
    return axios.post<T>(`${baseUrl}${endpoint}`, body);
  },
  get: <T extends object>(endpoint: string, body: any) => {
    // console.log(`${baseUrl}${endpoint}`);
    return axios.get<T>(`${baseUrl}${endpoint}`, { params: { ...body } });
  },
};

export default Calls;
