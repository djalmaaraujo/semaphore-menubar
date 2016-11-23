/* jshint node: true */
/* esversion: 6 */

"use strict";

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
  NOTIFICATION_TYPES: NOTIFICATION_TYPES
};

class Settings {
  constructor(database) {
    this.database = database;
  }

  get(setting) {
    return this.database[setting];
  }
}

module.exports = new Settings(SETTINGS);
