import { MONGO_URL } from './utils/env'
import { connect } from 'mongoose'

//a bit ugly but it'll do for now
import express = require('express')
//import socket = require('socket.io')
//import http = require('http')
import helmet = require('helmet')

const app: express.Application = express()
app.use(helmet)

//let server = new http.Server(app)

connect(MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true})
    .catch((error) => console.log(error))

app.get('/', function(req, res) {
    res.send('whoa I alive') 
})

app.listen(3000, function() {
    console.log('listening on port 3000')
})