import api from "./requests";
import fakeApi from "../stumps/requests";

const fakeData = true;

export default fakeData ? fakeApi : api;