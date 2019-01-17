import api from "./requests";
import fakeApi from "../stubs/requests";

const fakeData = localStorage.fakeData === "true" || false;

export default fakeData ? fakeApi : api;