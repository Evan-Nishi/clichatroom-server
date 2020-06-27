import { MONGO_URL } from './utils/env'
import { connect, model } from 'mongoose'
import { validateEmail } from './middlewares/validator'

import userSchema from './schemas/user'
import messageSchema from './schemas/message'
import chatroomSchema from './schemas/chatroom'

import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const app: express.Application = express()

app.set('trust proxy', true)
app.use(helmet)
app.use(express.json())

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
})

const User = model('User', userSchema)
const Message = model('Message', messageSchema)
const Chatroom = model('Chatroom', chatroomSchema)

connect(MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true})
    .catch((error) => console.log(error))

app.get('/', function(req, res) {
    res.send('whoa I alive') 
})

app.post('/new_user', (req, res) => {
    if(!validateEmail(req.body.email) && req.body.email != undefined){
        res.send('invalid email')
    }
    let user = new User({
        username: req.body.name,
        email: req.body.name,
        password: req.body.password
    })
    user.save() // handle errors later
    res.sendStatus(201);
})

app.post('/new_chatroom', (req, res) => {
    let chatroom = new Chatroom({
        messages:[],
        joinpass: req.body.joinpass,
        members: req.body.userId
    })
    chatroom.save() // handle errors later
    res.sendStatus(201);
})

app.listen(3000, function() {
    console.log('listening on port 3000')
})


/*import Hasher from './middlewares/hash'

Hasher('hi', 10, (err, hash) => {
    if(err) {
        throw err
    } else {
        console.log(hash)
    }
})
*/