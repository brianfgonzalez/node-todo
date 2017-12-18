const {ObjectID} = require('mongoDB')
const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

var todoid = '6a3847cc73fb4b4560ff6be0'
var userid = '5a38535665ce180d087ed105'
if (!ObjectID.isValid(userid)) return console.log('id is not valid')

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// })
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo)
// })
//
// Todo.findById(id).then((todo) => {
//   if (!todo) return console.log('id not found')
//   console.log('Todo by id', todo)
// })
User.findById(userid).then((user) => {
  if (!user) return console.log('user id not found')
  console.log('User by id', user)
})
