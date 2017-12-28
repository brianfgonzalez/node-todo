var mongoose = require('mongoose')
// http://mongoosejs.com/docs/guide.html

// Use bluebird
// mongoose.Promise = require('bluebird')
//var options = { promiseLibrary: require('bluebird') }
var options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  promiseLibrary: require('mpromise')
};
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', options)

module.exports = {mongoose}
