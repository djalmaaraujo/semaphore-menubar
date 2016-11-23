/* globals require */
/* esversion: 6 */

"use strict";

const menubar = require("menubar");
const ElectronConfig = require("./src/settings").get('window');
const mb = menubar(ElectronConfig);
const Semaphore = require("./src/semaphore-app");

mb.on("ready", () => {
  new Semaphore(mb);
});
