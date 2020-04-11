const messages = []; // the storage unit for messages

module.exports.enqueue = (message) => {
  console.log(`Enqueing message: ${message}`);
  messages.push(message);
};

module.exports.dequeue = () => {
  // returns undefined if messages array is empty
  return messages.shift();
};

// module.exports.messages = function() {
//   this.messages = [];
// }

// module.exports.messages.prototype.enqueue = function(message) {};
// module.exports.messages.prototype.dequeue = function() {};