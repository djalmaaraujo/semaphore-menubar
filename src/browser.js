/* globals _, Vue, require */
"use strict";

const shell = require('electron').shell;
const _ = require('lodash');
const request = require('superagent');
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
    appState: "loading",
    searchQuery: undefined,
    userToken: undefined,
    openMenu: false,
    projects: []
  },

  methods: {
    getProjects() {
      let self = this;

      request
        .get(Settings.get('apiUrl') + 'projects')
        .query({auth_token: Settings.getToken()})
        .set({ Accept: 'application/json' })
        .end(function(err, res) {
          if (_.isArray(res.body)) {
            Settings.set('projects', _.cloneDeep(res.body));

            self.projects = _.cloneDeep(res.body);
            self.appState = "list";
          }
      });
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

    openProjectUrl (url) {
      shell.openExternal(url);
    },

    toggleMenu() {
      this.openMenu = !this.openMenu;
    }
  },

  mounted () {
    if (Settings.getToken()) {
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
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        });
      }

      return data;
    }
  }
});
