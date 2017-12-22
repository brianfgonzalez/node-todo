var mongoose = require('mongoose')
// http://mongoosejs.com/docs/guide.html

// Use bluebird
mongoose.Promise = require('bluebird')
//var options = { promiseLibrary: require('bluebird') }
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp')

module.exports = {mongoose}
