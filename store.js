'use strict';

class Store {
  
  constructor (size) {
    this.history = {};
  }
  addMessage (msg, room) {
      if (!this.history.hasOwnProperty(room)) {
        this.history[room] = [];
      }
    this._addMessage(msg, room);
  }

  _addMessage (msg, room) {
      const roomHistory = this.history[room]
        if (roomHistory.length >= 128) {
            while (roomHistory.length > 127) {
                roomHistory.pop();
            }
        }
        roomHistory.unshift(msg)
  }
  getHistory (room) {
    const roomHistory = this.history[room];
    return roomHistory || {};
  }

}
module.exports = Store;