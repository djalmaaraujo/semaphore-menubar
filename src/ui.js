/* globals Vue, require */
"use strict";

const ipcRenderer = require("electron").ipcRenderer;
const STORAGE_TOKEN_NAME = "semaphoreUserToken";
const PROJECTS = require("./src/projects");

const getToken = function () {
  let token = localStorage.getItem(STORAGE_TOKEN_NAME);

  return ((token !== null) && (token !== "")) ? token : undefined;
};

new Vue({
  el: "#app",
  data: {
    formToken: undefined,
    appState: (getToken()) ? "loading" : "setup",
    userToken: undefined,
    projects: []
  },

  methods: {
    getProjects() {
      setTimeout(() => {
        this.projects = PROJECTS;
        this.appState = "list";

      }, 3000);
    },

    saveToken () {
      this.userToken = this.formToken;
      this.appState =  "loading";
      this.getProjects();

      localStorage.setItem(STORAGE_TOKEN_NAME, this.formToken);
    }
  },

  mounted () {
    if (this.appState === "loading")
      this.getProjects();
  }
});

// Connect to Socket
ipcRenderer.send("fetch", true);
