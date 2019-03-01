import { allDevelopers, developers, projects } from "./data";
import { getRandomDevelopers, getRandomProjects } from "./helpers";
import { getComponentsInRowNumber } from "../helpers";
import { api } from "../config";

export default {
  async getRandomProjects() {
    return getRandomProjects(getComponentsInRowNumber());
  },

  async getRandomDevelopers() {
    return getRandomDevelopers(getComponentsInRowNumber());
  },

  async getFilteredDevelopers(count, offset, searchValue) {
    const matchedDevelopers = allDevelopers.filter(developer => {
      const { firstname, lastname } = developer;
      return !!~`${firstname} ${lastname}`.toLowerCase().indexOf(searchValue);
    });

    return this.getDevelopers(count, offset, matchedDevelopers);
  },

  async requestProjects() {
    return projects;
  },

  async getDevelopers(count, offset, developers = allDevelopers) {
    const allDevelopersCount = developers.length;

    if (offset > allDevelopersCount)
      return { develpers: [], allDevelopersCount }

    const developersAvaialable = developers.slice(offset, allDevelopersCount);

    if (count > developersAvaialable)
      return { developers: developersAvaialable, allDevelopersCount }

    return { developers: developersAvaialable.slice(0, count), allDevelopersCount };
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

  async putDeveloperProfile(id) {

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