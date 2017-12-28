var express = require('express')
var bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {ObjectID} = require('mongodb')

var app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    var todo = new Todo({
      text: req.body.text
    })
    todo.save().then((doc) => {
      res.send(doc)
    }, (e) => {
      res.status(400).send(e)
    })
})

app.post('/users', (req, res) => {
    var user = new User({
      email: req.body.email
    })
    user.save().then((doc) => {
      res.send(doc)
    }, (e) => {
      res.status(400).send(e)
    })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }).catch((e) => res.status(400).send(e))
})

app.get('/todos/:todoid', (req, res) => {
  var id = req.params.todoid

  if (!ObjectID.isValid(id)) res.status(400).send('Todo id is not valid')
  Todo.findById(id).then((todo) => {
    if (!todo) return res.status(400).send('Todo is not found in mangoDB')
    res.send({todo})
  }).catch((e) => res.status(400).send(e))
})

app.get('/users/:userid', (req, res) => {
  var id = req.params.userid

  if (!ObjectID.isValid(id)) return res.status(400).send('User id is not valid')
  User.findById(id).then((user) => {
    if (!user) return res.status(400).send('User is not found in mangoDB')
    res.send({user})
  }, (e) => {
    res.status(400).send(e)
  })
})

app.delete('/todos/:todoid', (req, res) => {
  var id = req.params.todoid

  if (!ObjectID.isValid(id)) res.status(400).send(`Passed todo id "${id}" is not valid`)
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) return res.status(404).send('Todo is not found in mongoDB')
    res.send({todo})
  }).catch((e) => res.status(400).send(e))
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {app}

// var newUser = new User({
//   email: 'briangonzalez@gmail.com'
// })
// newUser.save().then((doc) => {
//   console.log('Saved user', JSON.stringify(doc, undefined, 2))
// }, (e) => console.log('Unable to save user', e))
