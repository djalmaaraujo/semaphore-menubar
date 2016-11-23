/* globals Vue, require */
"use strict";

const ipcRenderer = require("electron").ipcRenderer;
const shell = require('electron').shell;
const STORAGE_TOKEN_NAME = "semaphoreUserToken";
const PROJECTS = require("./src/projects");
const Settings = require("./src/settings");
const notificationMenu = require("./src/components/settings-menu").notificationMenu;
const exitMenu = require("./src/components/settings-menu").exitMenu;

const getToken = () => {
  let token = localStorage.getItem(STORAGE_TOKEN_NAME);

  return ((token !== null) && (token !== "")) ? token : undefined;
};

// Settings Menu
Vue.component('settings-menu-toggle-notification', notificationMenu);
Vue.component('settings-menu-exit', exitMenu);

// Main
new Vue({
  el: "#app",
  data: {
    formToken: undefined,
    appState: (getToken()) ? "loading" : "setup",
    searchQuery: undefined,
    userToken: undefined,
    openMenu: false,
    projects: []
  },

  methods: {
    getProjects() {
      setTimeout(() => {
        this.projects = PROJECTS;
        this.appState = "list";
      }, 2000);
    },

    saveToken () {
      this.userToken = this.formToken;
      this.appState =  "loading";
      this.getProjects();

      localStorage.setItem(STORAGE_TOKEN_NAME, this.formToken);
    },

    openTokenUrl () {
      shell.openExternal(Settings.get('whereIsMyTokenUrl'));
    },

    openNewProjectUrl () {
      shell.openExternal(Settings.get('newProjectUrl'));
    },

    toggleMenu() {
      this.openMenu = !this.openMenu;
    }
  },

  mounted () {
    if (this.appState === "loading")
      this.getProjects();
  },

  computed: {
    filteredProjects () {
      let data = this.projects;
      let query = this.searchQuery;

      if (query) {
        data = data.filter((row) => {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        });
      }

      return data;
    }
  }
});

// Connect to Socket
ipcRenderer.send("fetch", true);
