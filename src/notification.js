/* jshint node: true */
/* esversion: 6 */

"use strict";

const path = require("path");
const notifier = require("node-notifier");
const Settings = require("./settings");

let project = {
  name: "BVPlus"
};

class Notifier {
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
    return `#${data.build_number} - ${project.name} (${status.toUpperCase()})`;
  }

  getIcon(status) {
    return path.join(__dirname, "../assets/images/statuses/icon-deploy-" + status + ".png");
  }
}

module.exports = Notifier;
