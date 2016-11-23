/* jshint node: true */
/* esversion: 6 */

"use strict";

const EVENT_EXIT = "exit";

const {ipcMain} = require("electron");
const Notifier = require("./notification");

class Semaphore {
  constructor(mb) {
    this.mb = mb;
    this.bindQuit();

    mb.showWindow();
    new Notifier();
  }

  bindQuit() {
    ipcMain.on(EVENT_EXIT, () => {
      this.mb.app.exit();
    });
  }
}

module.exports = Semaphore;
