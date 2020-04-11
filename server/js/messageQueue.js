let Messages = function() {
  this.messages = [];
}

Messages.prototype.enqueue = function(message) {
  // console.log(`Enqueing message: ${message}`);
  this.messages.push(message);
  // console.log(this.messages);
}

Messages.prototype.dequeue = function() {
  return this.messages.shift();
}

module.exports = Messages;