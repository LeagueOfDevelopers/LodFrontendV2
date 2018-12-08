import api from "./requests";
import fakeApi from "../stubs/requests";

const fakeData = true;

export default fakeData ? fakeApi : api;