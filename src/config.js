import axios from "axios";

// Api config

export const api = () => {
  return axios.create({
    baseURL: "https://test.api.lod-misis.ru",
    withCredentials: false,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
};
