var mongoose = require('mongoose')
// http://mongoosejs.com/docs/guide.html

var uri = 'mongodb://localhost:27017/TodoApp'

// Use bluebird
mongoose.Promise = require('bluebird')
//var options = { promiseLibrary: require('bluebird') }
mongoose.connect(uri)

module.exports = {mongoose}
