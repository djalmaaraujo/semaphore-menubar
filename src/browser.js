/* globals Vue, require */
"use strict";

const shell = require('electron').shell;
const PROJECTS = require("./src/projects");
const Settings = require("./src/settings");

// Context Menu Settings
const notificationMenu = require("./src/components/settings-menu").notificationMenu;
const exitMenu = require("./src/components/settings-menu").exitMenu;

// Settings Menu
Vue.component('settings-menu-toggle-notification', notificationMenu);
Vue.component('settings-menu-exit', exitMenu);

// Main
new Vue({
  el: "#app",
  data: {
    formToken: undefined,
    appState: (Settings.getToken()) ? "loading" : "setup",
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
      }, 3000);
    },

    saveToken () {
      Settings.setToken(this.formToken);

      this.userToken = this.formToken;
      this.appState =  "loading";
      this.getProjects();
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
