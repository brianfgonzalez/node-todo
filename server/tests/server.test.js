const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongoDB')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')

const todos = [{
  _id: new ObjectID(),
  text:  'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}]

const users = [{
  _id: new ObjectID(),
  email:  'firstEmail@aol.com'
}, {
  _id: new ObjectID(),
  email: 'secondEmail@gmail.com'
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
})

beforeEach((done) => {
  User.remove({}).then(() => {
    return User.insertMany(users)
  }).then(() => done())
})

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
