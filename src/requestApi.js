import {getComponentsInRowNumber} from "./helpers";
import {fakeDevelopers, getRandomDevelopers} from "./caps/developers";
import {fakeProjects, getRandomProjects} from "./caps/projects";
import API from "./api";

const fakeData = true;

export const requestRandomDevelopers = () => {
  return fakeData ?
    new Promise((res, rej) => res(getRandomDevelopers(getComponentsInRowNumber()))) :
    API()
      .get(`/developers/random/${getComponentsInRowNumber()}`)
      .then(res => res.data);
};

export const requestDevelopers = (page) => {
  return fakeData ?
    new Promise((res, rej) => res(fakeDevelopers)) :
    API()
      .get(`/developers?page=${page}`)
      .then(res => res.data.Data)
};

export const requestRandomProjects = () => {
  return fakeData ?
    new Promise((res, rej) => res(getRandomProjects(getComponentsInRowNumber()))) :
    API()
      .get(`/projects/random/${getComponentsInRowNumber()}`)
      .then(res => res.data);
};

export const requestProjects = (amount, categories) => {
  return fakeData ?
    new Promise((res, rej) => res(fakeProjects)) :
    API()
      .get(`/projects/${amount}/${getComponentsInRowNumber()}?&categories=${categories}`)
      .then(res => res.data.Data);
};