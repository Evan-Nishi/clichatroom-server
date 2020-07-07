import { MONGO_URL } from './utils/env'
import { connect } from 'mongoose'
import { validateEmail, verifyEmail } from './utils/validate'
import { limiter, createLimiter } from './utils/rateLimiter'
import { randomBytes } from 'crypto'

import User from './schemas/user'
import Chatroom from './schemas/chatroom'

import express from 'express'
import helmet from 'helmet'

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

/**
 * Create a new user
 * 
 * @name new_user
 * @route {POST} - /new_user
 * @authentication - this route doesn't require anything but is rate limited
 * @bodyparam {String} email - the user's email
 * @bodyparam {String} username - the new user's name
 * @bodyparam {String} password - the new password
 */

app.post('/new_user', createLimiter, (req, res) => {
    User.findOne({email: req.body.email, username: req.body.username}, (err, user) => {
        if(user){
            res.sendStatus(400)
            res.send('email or username already in use!')
            //oh god this code is terrible
        } else {
            let newUser = new User({
                username: req.body.name,
                email: req.body.name,
                password: req.body.password
            })
        
            if(!validateEmail(req.body.email) && req.body.email != undefined) {
                res.send('invalid email')
            }
        
            newUser.save((error) => {
                console.log(error) 
            }) // handle errors later
            res.sendStatus(201)
        }

    })

})

/**
 * sends a verification email
 * 
 * @name verify_email
 * @route {POST} - /verify_email
 * @authentication - this route doesn't require anything but is rate limited
 * @bodyparam {String} email - the user's email
 * @bodyparam {String} username - the new user's name
 */

app.post('/verify_email', createLimiter, (req, res) => {
    let pin: string
    randomBytes(3, async (err, buffer) => {
        if(err) {
            console.log(err)
            res.send(err)
        } else {
            pin = parseInt(buffer.toString('hex'), 16).toString().substr(0,6)
            await verifyEmail(req.body.email, req.body.username, pin)
            res.send('email verified')
        }
    })
})

/**
 * creates a new chatroom
 * 
 * @name new_chatroom
 * @route {POST} - /new_chatroom
 * @authentication - this route requires the user to be logged into a session
 * @bodyparam {String} joinpass - 
 * @bodyparam {String} username - the new user's name
 */

app.post('/new_chatroom', createLimiter, (req, res) => {
    let chatroom = new Chatroom({
        messages:[],
        joinpass: req.body.joinpass,
        members: req.body.userId
    })
    chatroom.save() // handle errors later
    res.sendStatus(201)
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})