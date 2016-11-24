/* globals Vue, require */

"use strict";

const SEMAPHORE_TOKEN_CHARS = 20;
const SEMAPHORE_TOKEN_TIMEOUT = 1000;
const REFRESH_PROJECTS_TIMEOUT = 60000;

const shell = require('electron').shell;
const _ = require('lodash');
const request = require('superagent');
const Settings = require("./src/settings");
const {clipboard} = require('electron');
const isOnline = require('is-online');

// Context Menu Settings
const notificationMenu = require("./src/components/settings-menu").notificationMenu;
const exitMenu = require("./src/components/settings-menu").exitMenu;
const logoutMenu = require("./src/components/settings-menu").logoutMenu;

// Settings Menu
Vue.component('settings-menu-toggle-notification', notificationMenu);
Vue.component('settings-menu-logout', logoutMenu);
Vue.component('settings-menu-exit', exitMenu);

// Main
new Vue({
  el: "#app",
  data: {
    formToken: undefined,
    appState: false,
    setupMessage: undefined,
    searchQuery: undefined,
    openMenu: false,
    projects: []
  },

  methods: {
    getProjects() {
      this.appState = false;

      if (Settings.has('projects')) {
        this.projects = _.cloneDeep(Settings.get('projects'));
        this.appState = "list";
      } else {
        this.refreshProjects();
      }
    },

    saveToken (e) {
      e.preventDefault();
      Settings.set('userToken', this.formToken);
      this.stopClipboard();

      this.getProjects();
    },

    openTokenUrl () {
      shell.openExternal(Settings.get('whereIsMyTokenUrl'));
    },

    openProjectUrl (url) {
      shell.openExternal(url);
    },

    toggleMenu() {
      this.openMenu = !this.openMenu;
    },

    startClipboard() {
      let self = this;

      this.clipBoardCheck = setInterval(() => {
        let text = clipboard.readText();

        if (text.length == SEMAPHORE_TOKEN_CHARS) {
          self.formToken = clipboard.readText();
        }
      }, SEMAPHORE_TOKEN_TIMEOUT);
    },

    stopClipboard() {
      clearInterval(this.clipBoardCheck);
    },

    refreshProjects() {
      let self = this;

      isOnline(function(err, online) {
        if (!online) {
          return;
        }

        request
          .get(Settings.get('apiUrl') + 'projects')
          .query({auth_token: Settings.get('userToken')})
          .set({ Accept: 'application/json' })
          .end((err, res) => {
            if (err) {
              Settings.delete('userToken');
              Settings.delete('projects');

              self.appState = "setup";
              self.setupMessage = "Invalid token, please try again";
              clearInterval(self.refreshProjectsInterval);
            }

            if (_.isArray(res.body)) {
              Settings.set('projects', _.cloneDeep(res.body));

              self.setupMessage = undefined;
              self.projects = _.cloneDeep(res.body);
              self.appState = "list";
            }
        });
      });
    }
  },

  mounted () {
    let self = this;

    if (Settings.has('userToken')) {
      this.getProjects();
    } else {
      this.appState = "setup";
    }

    this.startClipboard();

    this.refreshProjectsInterval = setInterval(() => {
      self.refreshProjects();
    }, REFRESH_PROJECTS_TIMEOUT);
  },

  computed: {
    filteredProjects () {
      let data = this.projects;
      let query = this.searchQuery;

      if (query) {
        data = data.filter((row) => {
          return Object.keys(row).some((key) => {
            return String(row[key]).toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        });
      }

      return data;
    }
  }
});
