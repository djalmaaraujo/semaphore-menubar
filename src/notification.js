/* jshint node: true */
/* esversion: 6 */

"use strict";

const EVENT_SERVER_BUILD = "build";

const path = require("path");
const _ = require("lodash");
const notifier = require("node-notifier");
const Settings = require("./settings");

const socket = require("socket.io-client")(Settings.get("sockerServer"));

class Notifier {
  constructor() {
    if (Settings.has('receiveNotifications') === false) {
      Settings.set('receiveNotifications', true);
    }

    if (Settings.get('receiveNotifications') !== true) {
      return;
    }

    this.connect();
  }

  connect() {
    let self = this;

    socket.on(EVENT_SERVER_BUILD, (data) => {
      if (Settings.get('receiveNotifications') === true) {
        self.notify(data);
      }
    });
  }

  disconnect() {
    socket.disconnect();
  }

  getStatus(data) {
    return data.status.toLowerCase();
  }

  getPlaySound() {
    return Settings.get("playSounds") ? Settings.get("soundName") : false;
  }

  getType(status) {
    return Settings.get('NOTIFICATION_TYPES')[status];
  }

  getProgress(status) {
    return Settings.get('STATUES_PROGRESS')[status];
  }

  buildTitle(data, status) {
    let projects = Settings.get('projects');
    let project = _.find(projects, (p) => {
      return (p.hasOwnProperty('hash_id') && (p.hash_id == data.project));
    });

    let projectName = (!!project && project.hasOwnProperty('name')) ? project.name : "";

    return `#${data.build_number} - ${projectName} (${status.toUpperCase()})`;
  }

  getIcon(status) {
    return path.join(__dirname, "../assets/images/statuses/icon-deploy-" + status + ".png");
  }

  notify(data) {
    let status = this.getStatus(data);

    notifier.notify({
      title: this.buildTitle(data, status),
      progress: this.getProgress(status),
      type: this.getType(status),
      sound: this.getPlaySound(),
      icon: this.getIcon(status),
      message: data.message,
      priority: 1
    });
  }
}

module.exports = Notifier;
