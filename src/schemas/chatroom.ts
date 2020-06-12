import { Schema, model } from 'mongoose'
import { messageSchema } from './message'

export const chatroomSchema: Schema = new Schema({
    messages: {type: [messageSchema], required: false},
    name: {type: String, required: true},
    members: {type:[]}
})

export const chatroomModel = model('chatroom', chatroomSchema)