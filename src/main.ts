import { MONGO_URL } from './utils/env'
import { connect, model } from 'mongoose'
import { validateEmail } from './utils/validate'
import { limiter, createLimiter } from './utils/rateLimiter'

import userSchema from './schemas/user'
import chatroomSchema from './schemas/chatroom'
//import messageSchema from './schemas/message'

//import nodemailer from 'nodemailer'
import express from 'express'
import helmet from 'helmet'


const User = model('User', userSchema)
const Chatroom = model('Chatroom', chatroomSchema)
//const Message = model('Message', messageSchema)

const app = express()

app.set('trust proxy', true)
app.use(helmet)
app.use(express.json())
app.use(limiter)

connect(MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true})
    .catch((error) => console.log(error))

app.get('/', (req, res) => {
    res.send('whoa I alive')
})

app.post('/new_user', createLimiter, (req, res) => {
    let user = new User({
        username: req.body.name,
        email: req.body.name,
        password: req.body.password
    })

    if(!validateEmail(req.body.email) && req.body.email != undefined){
        res.send('invalid email')
    }

    user.save() // handle errors later
    res.sendStatus(201)
})

app.post('/new_chatroom', (req, res) => {
    let chatroom = new Chatroom({
        messages:[],
        joinpass: req.body.joinpass,
        members: req.body.userId
    })
    chatroom.save() // handle errors later
    res.sendStatus(201)
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