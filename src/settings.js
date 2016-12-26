/* jshint node: true */
/* esversion: 6 */

"use strict";

// Storage for:
//
// receiveNotifications: true,
// playSounds: true,
// userToken: SDJASDJH
// projects: []
// projectsUpdatedAt: new Date()
//

const Config = require('electron-config');
const cfg = new Config();

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
  soundName: "Blow",
  sockerServer: "https://semaphorewatcherserver.herokuapp.com/",
  apiUrl: "https://semaphoreci.com/api/v1/",
  whereIsMyTokenUrl: "https://semaphoreci.com/users/edit",
  STATUES_PROGRESS: STATUES_PROGRESS,
  NOTIFICATION_TYPES: NOTIFICATION_TYPES,
  window: {
    width: 420,
    height: 520,
    resizable: true,
    movable: true,
    minimizable: true,
    maximizable: true,
    title: "Semaphore Menubar",
    fullscreen: false,
    fullscreenable: false,
    backgroundColor: '#f2f2e9',
    zoomToPageWidth: false,
    showDockIcon: false
  }
};

class Settings {
  constructor(database) {
    this.database = database;
  }

  get(setting) {
    if (this.database.hasOwnProperty(setting) === true) {
      return this.database[setting];
    } else {
      return cfg.get(setting);
    }
  }

  set(setting, value) {
    if (this.database.hasOwnProperty(setting) === true) {
      this.database[setting] = value;
    } else {
      cfg.set(setting, value);
    }
  }

  all() {
    return cfg.store;
  }

  has(setting) {
    return cfg.has(setting);
  }

  delete(setting) {
    return cfg.delete(setting);
  }

  clear() {
    return cfg.clear();
  }
}

module.exports = new Settings(SETTINGS);
