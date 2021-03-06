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

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.post('/todos', authenticate, (req, res) => {
    //console.log(req.user)
    var todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
    })
    todo.save().then((doc) => {
      res.status(200).send(doc)
    }, (e) => {
      res.status(400).send(e)
    })
})

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos})
  }).catch((e) => res.status(400).send(e))
})

app.get('/todos/:todoid', authenticate, (req, res) => {
  var id = req.params.todoid

  if (!ObjectID.isValid(id)) return res.status(404).send('Todo id is not valid')
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) return res.status(404).send('Todo is not found in mangoDB')
    res.send({todo})
  }).catch((e) => res.status(400).send(e))
})

app.delete('/todos/:todoid', authenticate, (req, res) => {
  var id = req.params.todoid

  if (!ObjectID.isValid(id)) return res.status(404).send(`Passed todo id "${id}" is not valid`)
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) return res.status(404).send('Todo is not found in mongoDB')
    res.send({todo})
  }).catch((e) => res.status(400).send(e))
})

app.patch('/todos/:todoid', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
    },
    {$set: body},{new: true}
  ).then((todo) => {
    if (!todo) return res.sendStatus(404)
    res.status(200).send({todo})
  }).catch((e) => res.status(400).send(e))
})

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

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user)
    })
  }).catch((e) => res.status(401).send(e))
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

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.sendStatus(200)
  }, (e) => {
    res.status(400).send(e)
  })
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
