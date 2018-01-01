var env = process.env.NODE_ENV || 'development'
console.log('env ********', env)

if (env === 'development' || env === 'test') {
  var config = require('./config.json')
  // when you want to use a variable as a property, you need use bracket notation
  var envConfig = config[env]

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  })
}

// moved to external file
// if (env === 'development') {
//   process.env.PORT = 3000
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
// } else if (env === 'test') {
//   process.env.PORT = 3000
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
// }
