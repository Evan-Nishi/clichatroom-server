import { Schema } from 'mongoose'
import messageSchema from './message'

const chatroomSchema: Schema = new Schema({
    messages: {type: [messageSchema], required: false},
    name: {type: String, required: true},
    members: {type:[String]},
    joinPass: {type: String, required: false}
})

export default chatroomSchema