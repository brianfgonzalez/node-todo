// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

var obj = new ObjectID()
console.log(obj)



MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) return console.log(err)
  console.log('Connected to MongoDB server');
  var db = client.db('TodoApp')

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) return console.log(err)
  //   // console.log(JSON.stringify(result.ops, undefined, 2))
  //   client.close()
  // })

  // db.collection('Users').insertOne({
  //   name: 'Brian Gonzalez',
  //   age: 36,
  //   location: '7629 Black Hawk Ln.'
  // }, (err, result) => {
  //   if (err) return console.log(err)
  //   // console.log(JSON.stringify(result.ops, undefined, 2))
  //   console.log(result.ops[0]._id.getTimestamp())
  // })

  // var items = db.collection('Todos').find({})
  // console.log(items)
  client.close()

})
