

class Store {
  constructor() {
    this.history = {};
  }
  addMessage(msg, room) {
    if (!Object.prototype.hasOwnProperty.call(this.history, room)) {
      this.history[room] = [];
    }
    this.addmessage(msg, room);
  }

  addmessage(msg, room) {
    const roomHistory = this.history[room];
    if (roomHistory.length >= 128) {
      while (roomHistory.length > 127) {
        roomHistory.pop();
      }
    }
    roomHistory.unshift(msg);
  }
  getHistory(room) {
    const roomHistory = this.history[room];
    return roomHistory || [];
  }
}
module.exports = Store;
