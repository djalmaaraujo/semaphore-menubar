/* jshint node: true */
/* esversion: 6 */

"use strict";

const STORAGE_TOKEN_NAME = "semaphoreUserToken";
const STATUES_PROGRESS = {
  passed: 100,
  failed: 0,
  stopped: 0,
  pending: 50
};

const NOTIFICATION_TYPES = {
  passed: "info",
  failed: "error",
  stopped: "warn",
  pending: "info"
};

const SETTINGS = {
  playSounds: true,
  soundName: "Blow",
  sockerServer: "https://semaphorewatcherserver.herokuapp.com/",
  whereIsMyTokenUrl: "https://semaphoreci.com/users/edit",
  newProjectUrl: "https://semaphoreci.com/new",
  receiveNotifications: true,
  STATUES_PROGRESS: STATUES_PROGRESS,
  NOTIFICATION_TYPES: NOTIFICATION_TYPES,
  window: {
    preloadWindow: true,
    debug: true,
    width: 420,
    height: 520,
    showDockIcon: false
  }
};

class Settings {
  constructor(database) {
    this.database = database;
  }

  get(setting) {
    return this.database[setting];
  }

  set(setting, value) {
    this.database[setting] = value;
  }

  getToken() {
    let token = localStorage.getItem(STORAGE_TOKEN_NAME);

    return ((token !== null) && (token !== "")) ? token : undefined;
  }

  setToken(token) {
    localStorage.setItem(STORAGE_TOKEN_NAME, token);
  }
}

module.exports = new Settings(SETTINGS);
