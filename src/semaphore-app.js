/* jshint node: true */
/* esversion: 6 */

"use strict";

const EVENT_EXIT = "exit";
const EVENT_RELAUNCH = "relaunch";

const {ipcMain} = require("electron");
const Notifier = require("./notification");
const Settings = require("./settings");

class Semaphore {
  constructor(mb) {
    this.mb = mb;
    this.bindQuit();
    this.bindRelaunch();

    mb.showWindow();
    new Notifier();
  }

  bindQuit() {
    ipcMain.on(EVENT_EXIT, () => {
      this.mb.app.exit(0);
    });
  }

  bindRelaunch() {
    ipcMain.on(EVENT_RELAUNCH, () => {
      Settings.clear();
      this.mb.app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])});
      this.mb.app.exit(0);
    });
  }
}

module.exports = Semaphore;
