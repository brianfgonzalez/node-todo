const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongoDB')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

describe('TODOS', () => {
  beforeEach(populateTodos)
  describe('POST /todos', () => {
    it('should create a new todo', (done) => {
      var text = 'Test todo test'

      request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
          expect(res.body.text).toBe(text)
          //expect(typeof res.body.text).toBe('string')
        })
        .end((err, res) => {
          if (err) return done(err)
          Todo.find().then((todos) => {
            expect(todos.length).toBe(3)
            expect(todos[2].text).toBe(text)
            done()
          }).catch((err) => done(err))
        })
    })

    it('should not create todo with invalid body data', (done) => {
      request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
          if (err) return done(err)
          Todo.find().then((todos) => {
            expect(todos).toHaveLength(2)
            done()
          }).catch((err) => done(err))
        })
    })
  })

  describe('GET /todos', () => {
    it('should pull two seeded todos from local Todo mongoDB', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos).toHaveLength(2)
          expect(res.body.todos[0].text).toEqual(todos[0].text)
          expect(res.body.todos[1].text).toEqual(todos[1].text)
        })
        .end(done)
    })
  })

  describe('GET /todo/:id', () => {
    it('should return a todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    })
  })
  describe('DELETE /todos/:id', () => {
    it('should remove a specified todo', (done) => {
      var id = todos[0]._id.toHexString()
      request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe('First test todo')
        })
        .end((err, res) => {
          if (err) return done(err)
          Todo.findById(id).then((todo) => {
            expect(todo).toBeNull()
            done()
          }).catch((err) => done(err))
        })
    })
    it('should return 404 because todo was not found', (done) => {
      request(app)
        .delete(`/todos/${new ObjectID()}`)
        .expect(404)
        .end(done)
    })
    it('should return 404 because todo id was not valid', (done) => {
      request(app)
        .delete('/todos/notAValidId')
        .expect(404)
        .end(done)
    })
  })

  describe('UPDATE /todos/:id', () => {
    it('should update an existing todo and set it to completed', (done) => {
      var id = todos[0]._id.toHexString()
      var text = 'New text content'
      request(app)
        .patch(`/todos/${id}`)
        .send({
          text,
          completed: true
        })
        .expect(200)
        .expect((res) => {
          expect(typeof res.body.todo.completedAt).toBe('number')
        })
        .end((err, res) => {
          if (err) return done(err)
          Todo.findById(id).then((todo) => {
            expect(todo.text).toBe(text)
            expect(todo.completed).toBe(true)
            done()
          }).catch((err) => done(err))
        })
    })
    it('should set completed to false and clear completedAt', (done) => {
      var id = todos[0]._id.toHexString()
      request(app)
        .patch(`/todos/${id}`)
        .send({completed: false})
        .expect(200)
        .end((err, res) => {
          Todo.findById(id).then((todo) => {
            expect(todo.completedAt).toBeNull()
            done()
          }).catch((err) => done(err))
        })
    })
  })
})

describe('USERS', () => {
  beforeEach(populateUsers)

  describe('POST /users', () => {
    it('should create a user', (done) => {
      var email = 'example@example.com'
      var password = 'password1'
      request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          // in order to grab the x-auth property, you need to use
          // [] instead of dot notation, becuase the - breaks dot notation?
          expect(res.headers['x-auth']).toBeDefined()
          expect(res.body._id).toBeDefined()
          expect(res.body.email).toBe(email)
        })
        .end((err) => {
          if (err) return done(err)

          User.findOne({email}).then((user) => {
            expect(user).toBeDefined()
            expect(user.password).not.toBe(password)
            done()
          }).catch((e) => done(e))
        })
    })

    it('should return validation errors if request is invalid', (done) => {
      request(app)
        .post('/users')
        .send({
          email: 'examaple@msn',
          password: 'password1'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('is not a valid email')
          //expect(res.body.errors.email.message).toContain('is already taken.')
        })
        .end(done)
    })

    it('should not create user if email is taken', (done) => {
      request(app)
        .post('/users')
        .send({
          email: users[0].email,
          password: 'password1'
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('is already taken.')
          //expect(res.body.errors.email.message).toContain('is already taken.')
        })
        .end(done)
    })
  })

  describe('GET /users/:id', () => {
    it('should return a user doc', (done) => {
      request(app)
        .get(`/users/${users[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.user.email).toBe(users[0].email)
        })
        .end(done)
    })
  })

  describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
      request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(users[0]._id.toHexString())
          expect(res.body.email).toBe(users[0].email)
        })
        .end(done)
    })

    it('should return 401 is not authorized with no x-auth header', (done) => {
      request(app)
        .get('/users/me')
        .expect(401)
        .end(done)
    })

    it('should return 401 is not authorized with invalid x-auth header', (done) => {
      request(app)
        .get('/users/me')
        .set('x-auth', 'InvalidAuthHeader')
        .expect(401)
        .end(done)
    })
  })

  describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeDefined()
        })
        .end((err, res) => {
          if (err) return done(err)

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens[1].token).toBe(res.headers['x-auth'])
            done()
          }).catch((e) => done(e))
        })
    })

    it('should reject invalid login', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: 'notAUser@example.com',
          password: 'notAPassword'
        })
        .expect(401)
        .expect((res) => {
          expect(res.headers['x-auth']).not.toBeDefined()
        })
        .end((err, res) => {
          if (err) return done(err)

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(1)
            done()
          }).catch((e) => done(e))
        })
    })

  })
})
//  case sensitive: variableABC = variableABC.replace(/B/g, "D");
//  case insensitive: variableABC = variableABC.replace(/B/gi, "D");
