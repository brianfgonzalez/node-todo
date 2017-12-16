// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

// var obj = new ObjectID()
// console.log(obj)

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) return console.log(err)
  console.log('Connected to MongoDB server')
  var db = client.db('TodoApp')

  // http://mongodb.github.io/node-mongodb-native/2.2/api/index.html
  // db.collection('Todos').findOneAndUpdate({
  //   _id: ObjectID("5a3495f575d5d53da47d3b18")
  // },{
  //   //https://docs.mongodb.com/manual/reference/operator/update/
  //   $set: {
  //     completed: true
  //   }
  // },{
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result)
  // }, (err) => console.log('Unable to update todo document.',err))

  db.collection('Users').findOneAndUpdate({
    _id: ObjectID("5a349dd7c237f00e804e8b95")
  },{
    //https://docs.mongodb.com/manual/reference/operator/update/
    $inc: {
      age: 1
    },
    $set: {
      name: 'Amy Gonzalez'
    }
  },{
    returnOriginal: false
  }).then((result) => {
    console.log(result)
  }, (err) => console.log('Unable to update user document.',err))

  client.close()

})
