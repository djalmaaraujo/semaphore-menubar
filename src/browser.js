/* globals Vue, require */

"use strict";

const shell = require('electron').shell;
const _ = require('lodash');
const request = require('superagent');
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
    appState: false,
    setupMessage: undefined,
    searchQuery: undefined,
    openMenu: false,
    projects: []
  },

  methods: {
    getProjects() {
      let self = this;

      this.appState = false;

      if (Settings.has('projects')) {
        self.projects = _.cloneDeep(Settings.get('projects'));
        self.appState = "list";

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
          }

          if (_.isArray(res.body)) {
            Settings.set('projects', _.cloneDeep(res.body));

            self.setupMessage = undefined;
            self.projects = _.cloneDeep(res.body);
            self.appState = "list";
          }
      });
    },

    saveToken () {
      Settings.set('userToken', this.formToken);

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
    }
  },

  mounted () {
    if (Settings.has('userToken')) {
      this.getProjects();
    } else {
      this.appState = "setup";
    }
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
