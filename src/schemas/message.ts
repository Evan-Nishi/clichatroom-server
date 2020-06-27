import { Schema } from 'mongoose'

const messageSchema: Schema = new Schema({
    timeStamp: {type: Date, required: false},
    body: {type: String, required: true},
    sentByID: {type: String, required: true},
    chatRoomId: {type: String, required: true}
})

export default messageSchema