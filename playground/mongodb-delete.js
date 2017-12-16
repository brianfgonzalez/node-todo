// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

var obj = new ObjectID()
console.log(obj)



MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) return console.log(err)
  console.log('Connected to MongoDB server');
  var db = client.db('TodoApp')

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Something to do'}).then((result) => {
  //   console.log(result)
  // }, (err) => console.log(err))
  // deleteOne

  // findOneAndDelete
  db.collection('Todos').findOneAndDelete({text: 'Something to do'}).then((result) => {
    console.log(`Deleted the entry entered by "${result.value.name}"`)
  }, (err) => console.log(err))

  client.close()

})
