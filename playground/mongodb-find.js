// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

var obj = new ObjectID()
console.log(obj)



MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) return console.log(err)
  console.log('Connected to MongoDB server');
  var db = client.db('TodoApp')

  // db.collection('Todos').find({completed: true}).toArray().then((docs) => {
  //   console.log('Todos')
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => console.log('Unable to fetch todos',err))

  // db.collection('Todos').find({
  //     _id: new ObjectID('5a3495eea693ec41389490e5')
  //   }).toArray().then((docs) => {
  //   console.log('Todos')
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => console.log('Unable to fetch todos',err))

  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count ${count}`)
  }, (err) => console.log('Unable to fetch todos count',err))

  client.close()

})
