import axios from "axios";

export default () => {
  return axios.create({
    baseURL: "https://test.api.lod-misis.ru",
    withCredentials: false,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
};
