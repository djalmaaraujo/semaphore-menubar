/* globals require */
/* esversion: 6 */

"use strict";

const {ipcMain} = require("electron");
const menubar = require("menubar");
const Settings = require("./src/settings");
const socket = require("socket.io-client")(Settings.get("sockerServer"));
const Semaphore = require("./src/semaphore-app");
const ElectronConfig = require("./src/electron");
const mb = menubar(ElectronConfig);

const EVENT_FETCH = "fetch";
const EVENT_EXIT = "exit";
const EVENT_SERVER_BUILD = "build";

mb.on("ready", () => {
  let app = new Semaphore();

  mb.showWindow();

  // Exit Signal
  ipcMain.on(EVENT_EXIT, () => {
    mb.app.exit();
  });

  if (Settings.get('receiveNotifications') === false) {
    return;
  }

  ipcMain.on(EVENT_FETCH, (event) => {
    socket.on(EVENT_SERVER_BUILD, function(data) {
      app.dispatch(event, data);
    });
  });
});
