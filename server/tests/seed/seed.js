const {ObjectID} = require('mongoDB')
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')
const jwt = require('jsonwebtoken')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const todos = [{
  _id: new ObjectID(),
  text:  'First test todo for userOne',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'First test todo for userTwo',
  _creator: userTwoId
}, {
  _id: new ObjectID(),
  text: 'Second test todo for userTwo',
  _creator: userTwoId
}]
const users = [{
  _id: userOneId,
  email:  'firstEmail@aol.com',
  password: 'password1',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'secondEmail@gmail.com',
  password: 'password1',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
}

// Does not hash our password
// const populateUsers = (done) => {
//   User.remove({}).then(() => {
//     return User.insertMany(users)
//   }).then(() => done())
// }

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save()
    var userTwo = new User(users[1]).save()

    // Promise.all returns when all promises are returned
    return Promise.all([userOne, userTwo])
  }).then(() => done())
}

module.exports = {todos, populateTodos, users, populateUsers}
