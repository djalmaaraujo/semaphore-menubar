/* globals require */
/* esversion: 6 */

"use strict";

const menubar = require("menubar");
const Semaphore = require("./src/semaphore-app");
const ElectronConfig = require("./src/electron");
const mb = menubar(ElectronConfig);

mb.on("ready", () => {
  new Semaphore(mb);
});
