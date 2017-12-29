require('./config/config')
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')

var app = express()
const port = process.env.PORT

app.use(bodyParser.json())


//res.sendStatus(200); // equivalent to res.status(200).send('OK')
// res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
// res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
// res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')

app.post('/todos', (req, res) => {
    var todo = new Todo({
      text: req.body.text
    })
    todo.save().then((doc) => {
      res.status(200).send(doc)
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

  if (!ObjectID.isValid(id)) return res.status(404).send(`Passed todo id "${id}" is not valid`)
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) return res.status(404).send('Todo is not found in mongoDB')
    res.send({todo})
  }).catch((e) => res.status(400).send(e))
})

app.patch('/todos/:todoid', (req, res) => {
  var id = req.params.todoid
  // pulls off only the properties we want
  var body = _.pick(req.body, ['text', 'completed'])
  if (!ObjectID.isValid(id)) return res.status(404).send(`Passed todo id "${id}" is not valid`)

  if (_.isBoolean(body.completed) && body.completed) {
    // is boolean and is true
    body.completedAt = new Date().getTime()
  } else {
    // is not a boolean or not true
    body.completed = false
    body.completedAt = null
    // setting value to null removes it from the mongoDB
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) return res.sendStatus(404)
    res.status(200).send({todo})
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
