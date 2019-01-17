import axios from "axios";
import config from "../config";

const {baseApiUrl} = config;

export const api = () => {
  return axios.create({
    baseURL: baseApiUrl,
    withCredentials: false,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
};