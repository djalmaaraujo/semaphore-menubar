/* jshint node: true */
/* esversion: 6 */

"use strict";

const EVENT_GET_PROJECTS = "getProjects";
const EVENT_GET_PROJECTS_ERROR = `${EVENT_GET_PROJECTS}:error`;
const EVENT_GET_PROJECTS_LIST = `${EVENT_GET_PROJECTS}:list`;
const INVALID_TOKEN_MESSAGE = "Invalid token, please try again";

const {ipcMain} = require("electron");
const request = require("superagent");
const _ = require("lodash");
const Settings = require("./settings");

class Projects {
  constructor() {
    this.bindGetProjects();
  }

  bindGetProjects() {
    let self = this;

    ipcMain.on(EVENT_GET_PROJECTS, (event) => {
      self.fetch(event);
    });
  }

  handleError(event) {
    Settings.delete("userToken");
    Settings.delete("projects");

    event.sender.send(EVENT_GET_PROJECTS_ERROR, INVALID_TOKEN_MESSAGE);
  }

  handleSuccess(event, projects) {
    Settings.set("projects", projects);

    event.sender.send(EVENT_GET_PROJECTS_LIST, projects);
  }

  fetch(event) {
    let self = this;

    request
      .get(Settings.get("apiUrl") + "projects")
      .query({auth_token: Settings.get("userToken")})
      .set({ Accept: "application/json" })
      .end((err, res) => {
        if (err) {
          return self.handleError(event);
        }

        if (_.isArray(res.body)) {
          return self.handleSuccess(event, res.body);
        }
    });
  }
}

module.exports = Projects;
