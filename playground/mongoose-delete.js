const {ObjectID} = require('mongoDB')
const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// var todoid = '6a3847cc73fb4b4560ff6be0'
// var userid = '5a38535665ce180d087ed105'
// if (!ObjectID.isValid(userid)) return console.log('id is not valid')

// Todo.remove({}).then((result) => {
//   console.log(result)
// })

// Returns the document
// Todo.findOneAndRemove
// Todo.FindByIdAndRemove

Todo.findOneAndRemove({text: 'Second test todo'}).then((todo) => {
  if (!todo) return console.log('todo not found')
  console.log(todo)
}, (error) => {
  console.log(error)
})

// Todo.findById('5a38613afd79da4b38ee9d6f').then((todo) => {
//   if (!todo) return console.log('todo not found')
//   console.log('Todo by id', todo)
// })
