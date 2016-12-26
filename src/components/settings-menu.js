/* globals module, require */
"use strict";

const Settings = require("../settings");
const ipcRenderer = require("electron").ipcRenderer;

// Toggle Notification
const notificationMenu = {
  data() {
    return {
      notificationStatus: Settings.get('receiveNotifications')
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

// Toggle playSounds
const playSoundsMenu = {
  data() {
    return {
      playSoundsStatus: Settings.get('playSoundsStatus')
    };
  },
  template: `<a class="settingsMenu__item" href="#" v-on:click="playSounds">{{ menuState }}</a>`,
  methods: {
    playSounds() {
      this.playSoundsStatus = !this.playSoundsStatus;
      Settings.set('playSoundsStatus', this.playSoundsStatus);
    }
  },

  computed: {
    menuState() {
      return (this.playSoundsStatus === true) ? "Disable Sounds" : "Enable Sounds";
    }
  }
};

// Exit Menu
const exitMenu = {
  template: `<a class="settingsMenu__item" href="#" v-on:click="exit">Exit</a>`,
  methods: {
    exit() {
       ipcRenderer.send("exit", true);
    }
  }
};

// Exit Menu
const logoutMenu = {
  template: `<a class="settingsMenu__item" href="#" v-on:click="logout">Logout</a>`,
  methods: {
    logout() {
       Settings.delete('userToken');
       Settings.delete('projects');
       ipcRenderer.send("relaunch", true);
    }
  }
};

module.exports = {
  notificationMenu: notificationMenu,
  playSoundsMenu: playSoundsMenu,
  exitMenu: exitMenu,
  logoutMenu: logoutMenu
};
