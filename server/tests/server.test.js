const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [{
  text:  'First test todo'
}, {
  text: 'Second test todo'
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
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
