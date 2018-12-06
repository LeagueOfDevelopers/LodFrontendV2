import {api} from "../config";
import {getComponentsInRowNumber} from "../helpers";

export default {
  //developers
  requestRandomDevelopers: () => {
    return api()
      .get(`/developers/random/${getComponentsInRowNumber()}`)
      .then(res => res.data);
  },

  requestDevelopers: (page) => {
    return api()
      .get(`/developers?page=${page}`)
      .then(res => res.data.Data);
  },

  // projects
  requestRandomProjects: () => {
    return api()
      .get(`/projects/random/${getComponentsInRowNumber()}`)
      .then(res => res.data);
  },

  requestProjects: (amount, categories) => {
    return api()
      .get(`/projects/${amount}/${getComponentsInRowNumber()}?&categories=${categories}`)
      .then(res => res.data.Data);
  },

  // newDeveloper
  sendNewDeveloperWithCredentials: (newDeveloper) => {
    return api()
      .post(`developers`, newDeveloper);
  },

  sendNewDeveloperWithoutCredentials: (newDeveloper) => {
    return api()
      .post(`signup/github?frontend_callback=localhost:8080/signup`, newDeveloper);
  },

  // portfolio
  requestDeveloperPortfolio(id) {
    return api()
      .get(`developers/${id}`);
  },

  // notifications
  requestNotifications: currentPage => {
    return api()
      .get(`event/${currentPage + 1}`);
  },

  putReadNotifications: (notifications) => {
    return api()
      .put(`event/read`, notifications);
  },

  // developerProfile
  requestDeveloperProfile: (id) => {
    return api()
      .get(`developers/${id}`);
  },

  putDeveloperProfile : (id) => {
    return api()
      .put(`developers/${getters.userId}`);
  },

  // developerNotificationSettings
  requestNotificationSettings: (id) => {
    return api()
      .get(`developers/notificationsettings/${id}`);
  },

  putNotificationSettings: (id, settings) => {
    return api()
      .put(`developers/notificationsettings/${id}`, settings);
  },

  // developerChangePassword
  putNewPassword: (requestDetails) => {
    return api()
      .put(`password`, requestDetails);
  },

  // contactMessage
  sendContactMessage: (contactMessage) => {
    return api()
      .post(`/contact`, contactMessage);
  }
}