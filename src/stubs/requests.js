import { allDevelopers, developers, projects } from "./data";
import { getRandomDevelopers, getRandomProjects} from "./helpers";
import {getComponentsInRowNumber} from "../helpers";
import {api} from "../config";

export default {
  async requestRandomDevelopers() {
    return getRandomDevelopers(getComponentsInRowNumber());
  },

  async requestDevelopers() {
    return allDevelopers;
  },

  async requestRandomProjects() {
    return getRandomProjects(getComponentsInRowNumber());
  },

  async requestProjects() {
    return projects;
  },

  async sendNewDeveloperWithCredentials(newDeveloper) {

  },

  async sendNewDeveloperWithoutCredentials(newDeveloper) {

  },

  async requestDeveloperPortfolio(id) {

  },

  async requestNotifications() {

  },

  async putReadNotifications(notifications) {

  },

  async requestDeveloperProfile(id) {

  },

  async putDeveloperProfile (id) {

  },

  async requestNotificationSettings(id) {

  },

  async putNotificationSettings(id, settings) {

  },

  async putNewPassword(requestDetails) {

  },

  async sendContactMessage(contactMessage) {

  },

  async authorizeUser() {
  }
}