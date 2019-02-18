import { api } from "./config";
import { getComponentsInRowNumber } from "../helpers";

export default {
  async getRandomProjects() {
    try {
      const res = await api().get(`/projects/random/${getComponentsInRowNumber()}`);
      return res.data.projects;
    }
    catch (err) {
      return false;
    }
  },

  async getRandomDevelopers() {
    try {
      const res = await api().get(`/developers/random/${getComponentsInRowNumber()}`);
      return res.data.developers;
    }
    catch (err) {
      return false;
    }
  },

  requestProjects(amount, categories) {
    return api()
      .get(`/projects/${amount}/${getComponentsInRowNumber()}?&categories=${categories}`)
      .then(res => res.data.Data);
  },


  async getDevelopers(count, offset) {
    try {
      const res = await api().get(`/developers?count=${count}&offset=${offset}`);
      return res.data;
    }
    catch (err) {
      return false;
    }
  },

  sendNewDeveloperWithCredentials(newDeveloper) {
    return api()
      .post(`developers`, newDeveloper);
  },

  sendNewDeveloperWithoutCredentials(newDeveloper) {
    return api()
      .post(`signup/github?frontend_callback=localhost:8080/signup`, newDeveloper);
  },

  requestDeveloperPortfolio(id) {
    return api()
      .get(`developers/${id}`);
  },

  requestNotifications(currentPage) {
    return api()
      .get(`event/${currentPage + 1}`);
  },

  putReadNotifications(notifications) {
    return api()
      .put(`event/read`, notifications);
  },

  requestDeveloperProfile(id) {
    return api()
      .get(`developers/${id}`);
  },

  putDeveloperProfile(id) {
    return api()
      .put(`developers/${id}`);
  },

  requestNotificationSettings(id) {
    return api()
      .get(`developers/notificationsettings/${id}`);
  },

  putNotificationSettings(id, settings) {
    return api()
      .put(`developers/notificationsettings/${id}`, settings);
  },

  putNewPassword(requestDetails) {
    return api()
      .put(`password`, requestDetails);
  },

  sendContactMessage(contactMessage) {
    return api()
      .post(`/contact`, contactMessage);
  },

  authorizeUser(credentials) {
    return api()
      .post('login', credentials);
  }
}