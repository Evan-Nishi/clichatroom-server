import { MONGO_URL } from './utils/env'
import { connect } from 'mongoose'
import { validateEmail, sendVerificationEmail } from './utils/validate'
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
    .catch((error) => {throw(error)})

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
                throw(error)
            })

            res.sendStatus(201)
        }
    })
})

/**
 * sends a verification email
 * 
 * @name send_verify_email
 * @route {POST} - /send_verify_email
 * @authentication - route doesn't require anything but is rate limited extra
 * @bodyparam - userId - the users ID
 */

app.post('/send_verify_email', createLimiter, async (req, res) => {
    let pin: string
    let user = await User.findById(req.body.userId)
    if(!user.isVerfified){
        randomBytes(3, async (err, buffer) => {
            if(err) {
                res.sendStatus(500)
                throw(err)
            } else {
                pin = parseInt(buffer.toString('hex'), 16).toString().substr(0,6)
                await sendVerificationEmail(req.body.email, req.body.username, pin)
                user.pin = pin
                user.save()
                    .catch((err) => {throw err})
                res.sendStatus(200)
            }
        })
    } else {
        res.send('user already verified')
    }
})

/**
 * recieves and checks PIN for email verification
 * 
 * @name verify_email
 * @route {POST} - /verify_email
 * @authentication - no authentication required
 * @bodyparam {String} - userId - the user's ID
 */
app.post('/verify_email', createLimiter, async (req, res) => {
    let user = await User.findById(req.body.userId)
    if(req.body.PIN == user.pin){
        res.sendStatus(200)
        user.isVerfified = true
        user.pin = undefined
        user.save()
            .catch((error) => {throw error})
    } else {
        res.status(400)
        res.send('invalid PIN')
    }
})

/**
 * creates a new chatroom
 * 
 * @name new_chatroom
 * @route {POST} - /new_chatroom
 * @authentication - this route requires the user to be logged into a session
 * @bodyparam {String} joinpass - the joinpassword for the chatroom
 * @bodyparam {String} userId - the user's ID
 */

app.post('/new_chatroom', createLimiter, async (req, res) => {
    let user = await User.findById(req.body.userId)
    
    let chatroom = new Chatroom({
        messages:[],
        joinpass: req.body.joinpass,
        members: req.body.userId
    })

    if(user.isVerfified){
        chatroom.save()
            .catch((error) => {throw error})
        res.sendStatus(201)
    } else {
        res.status(401)
        res.send('account not verfied')
    }
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})