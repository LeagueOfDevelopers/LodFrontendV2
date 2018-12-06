import axios from "axios";

// Api config

export const api = () => {
  return axios.create({
    baseURL: "./",
    withCredentials: false,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
};
