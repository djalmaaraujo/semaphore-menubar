/* jshint node: true */
/* esversion: 6 */

"use strict";

const Notifier = require("./notification");
const EVENT_FETCHED = "fetched";

class Semaphore {
  constructor() {
    this.notifier = new Notifier();
  }

  dispatch(event, data) {
    this.notifier.notify(data);
    this.sendEventToWindow(event, data);
  }

  sendEventToWindow(event, data) {
    event.sender.send(EVENT_FETCHED, {
      status: data.status.toLowerCase()
    });
  }
}

module.exports = Semaphore;
