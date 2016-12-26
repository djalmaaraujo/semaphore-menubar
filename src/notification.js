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
        let projects = Settings.get('projects');

        if (!projects) {
          return;
        }

        let project = _.find(projects, (p) => {
          return (p.hasOwnProperty('hash_id') && (p.hash_id == data.project));
        });

        if (!project || !self.getProjectConfig(project.hash_id)) {
          return;
        }

        self.notify(data);
      }
    });
  }

  disconnect() {
    socket.disconnect();
  }

  getProjectConfig(hash_id) {
    return Settings.get('notifications.' + hash_id);
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

  buildTitle(data, status, project) {
    let projectName = (!!project && project.hasOwnProperty('name')) ? project.name : "";

    return `#${data.build_number} - ${projectName} (${status.toUpperCase()})`;
  }

  getIcon(status) {
    return path.join(__dirname, "../assets/images/statuses/icon-deploy-" + status + ".png");
  }

  getMajorIcon() {
    return path.join(__dirname, "../assets/images/semaphore-gear.png");
  }

  notify(data, project) {
    let status = this.getStatus(data);

    notifier.notify({
      title: this.buildTitle(data, status, project),
      progress: this.getProgress(status),
      type: this.getType(status),
      sound: this.getPlaySound(),
      icon: this.getIcon(status),
      contentImage: this.getMajorIcon(),
      message: data.message,
      priority: 1,
      open: data.build_url,
      wait: true
    });
  }
}

module.exports = Notifier;
