/* globals module, require */
"use strict";

const Settings = require("../settings");

const notificationMenu = {
  data() {
    return {
      notificationStatus: false
    };
  },
  template: `<a class="settingsMenu__item" href="#" v-on:click="toggleNotification">{{ menuState }}</a>`,
  methods: {
    toggleNotification() {
      this.notificationStatus = !this.notificationStatus;
      Settings.set('receiveNotifications', this.notificationStatus);
    }
  },

  computed: {
    menuState() {
      return (this.notificationStatus === true) ? "Disable Notifications" : "Enable Notifications";
    }
  }
};

module.exports = {
  notificationMenu: notificationMenu
};
