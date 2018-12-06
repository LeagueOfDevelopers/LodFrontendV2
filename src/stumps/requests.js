import { developers, projects } from "./data";
import {getRandomDevelopers, getRandomProjects} from "./helpers";
import {getComponentsInRowNumber} from "../helpers";
import {api} from "../config";

export default {
  // developers
  requestRandomDevelopers: () => {
    return new Promise(res => res(getRandomDevelopers(getComponentsInRowNumber())));
  },

  requestDevelopers: () => {
    return new Promise(res => res(developers));
  },

  // projects
  requestRandomProjects: () => {
    return new Promise(res => res(getRandomProjects(getComponentsInRowNumber())));
  },

  requestProjects: () => {
    return new Promise(res => res(projects));
  },

  // newDeveloper
  sendNewDeveloperWithCredentials: (newDeveloper) => {
    return new Promise(res => res());
  },

  sendNewDeveloperWithoutCredentials: (newDeveloper) => {
    return new Promise(res => res());
  },

  // portfolio
  requestDeveloperPortfolio(id) {
    return new Promise(res => res());
  },

  // notifications
  requestNotifications: currentPage => {
    return new Promise(res => res());
  },

  putReadNotifications: (notifications) => {
    return new Promise(res => res());
  },

  // developerProfile
  requestDeveloperProfile: (id) => {
    return new Promise(res => res());
  },

  putDeveloperProfile : (id) => {
    return new Promise(res => res());
  },

  // developerNotificationSettings
  requestNotificationSettings: (id) => {
    return new Promise(res => res());
  },

  putNotificationSettings: (id, settings) => {
    return new Promise(res => res());
  },

  // developerChangePassword
  putNewPassword: (requestDetails) => {
    return new Promise(res => res());
  },

  // contactMessage
  sendContactMessage: (contactMessage) => {
    return new Promise(res => res());
  }
}