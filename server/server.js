require('./config/config')
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')
const bcrypt = require('bcryptjs')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {authenticate} = require('./middleware/authenticate')

var app = express()
const port = process.env.PORT

app.use(bodyParser.json())

//res.sendStatus(200); // equivalent to res.status(200).send('OK')
// res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
// res.sendStatus(401); // equivalent to res.status(401).send('Unauthorized')
// res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
// res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')

// create todo
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

// who am i
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

// login with user using hashed password
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user)
    })
  }).catch((e) => res.status(401).send(e))
})

// get all todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }).catch((e) => res.status(400).send(e))
})

// get todo by id
app.get('/todos/:todoid', (req, res) => {
  var id = req.params.todoid

  if (!ObjectID.isValid(id)) res.status(400).send('Todo id is not valid')
  Todo.findById(id).then((todo) => {
    if (!todo) return res.status(400).send('Todo is not found in mangoDB')
    res.send({todo})
  }).catch((e) => res.status(400).send(e))
})

// get user by id
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

// delete user token for currently logged in user
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.sendStatus(200)
  }, (e) => {
    res.status(400).send(e)
  })
})

// delete todo
app.delete('/todos/:todoid', (req, res) => {
  var id = req.params.todoid

  if (!ObjectID.isValid(id)) return res.status(404).send(`Passed todo id "${id}" is not valid`)
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) return res.status(404).send('Todo is not found in mongoDB')
    res.send({todo})
  }).catch((e) => res.status(400).send(e))
})

// update todo
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

// post /users
app.post('/users', (req, res) => {
  var user = new User(_.pick(req.body, ['email', 'password']))

  // User = model method (i.e User.findByToken)
  // user = instance method (i.e. user.generateAuthToken)

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user)
    // x- headers are custom ones
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
