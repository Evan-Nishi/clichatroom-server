import { MONGO_URL } from './utils/env'
import { connect } from 'mongoose'
//a bit ugly but it'll do for now
import express = require('express')
import helmet = require('helmet')
//import http = require('http')

const app: express.Application = express()
app.use(helmet)

connect(MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true})
    .catch((error) => console.log(error))

app.get('/', function(req, res) {
    res.send('whoa I alive') 
})

app.listen(3000, function() {
    console.log('listening on port 3000')
})
