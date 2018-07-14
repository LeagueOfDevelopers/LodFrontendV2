import axios from "axios";

export default () => {
  return axios.create({
    baseURL: "http://localhost:50054",
    withCredentials: false,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
};
