const mongoose = require('mongoose')
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Unique email address is required'],
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.toJSON = function () {
  var user = this
  var userObject = user.toObject()

  return _.pick(userObject, ['_id', 'email'])
}

// instance methods (do not use arrow functions because we need to use a this keyword)
UserSchema.methods.generateAuthToken = function () {
  var user = this
  var access = 'auth'
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString()

  user.tokens.push({access, token})

  return user.save().then(() => {
    return token
  })
}

UserSchema.methods.removeToken = function (token) {
  var User = this
  return User.update({
    $pull: {
      tokens: {token}
    }
  })
}

// model methods
UserSchema.statics.findByToken = function (token) {
  var User = this
  var decoded

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (e) {
    return Promise.reject()
  }

  // by returning this promise, I can chain off of findByToken in my server.js
  return User.findOne({
    _id: decoded._id,
    // to query NESTED property, use the property.subproperty context
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.statics.findByCredentials = function (email, password) {
  return User.findOne({email: email}).then((user) => {
    if (!user) return Promise.reject('User is not found')
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (!res) reject('Password is incorrect')
        resolve(user)
      })
    })

  })
}

UserSchema.pre('save', function (next) {
  var user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

var User = mongoose.model('User', UserSchema)

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'})

module.exports = {User}
