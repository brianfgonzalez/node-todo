// const {SHA256} = require('crypto-js')
// var message = 'I am user number 3'
// var hash = SHA256(message).toString()
//
// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)
//
// var data = {
//   id: 4
// }
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// // salting a HASH means you add random generated text to the end of the hash
//
// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed')
// } else {
//   console.log('Data was changed, don\'t trust it')
// }

// JSON web token standard
//
// const jwt = require('jsonwebtoken')
//
// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data, '123abc')
// // jwt.io will show you the decoded token data
// // console.log(token)
// var decoded = jwt.verify(token, '123abc')
// console.log('decoded:',decoded)

const bcrypt = require('bcryptjs')

var password = '123abc!'

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash)
//   })
// })

var hashedPassword = '$2a$10$LfJuKVMXrU9EVMHN9OnJqO540OvWRr2L8NcVOAjJhenqMSdH/WGbW'

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res)
})
