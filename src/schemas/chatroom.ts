import { Schema, Document, model } from 'mongoose'
import { messageSchema, IMessage } from './message'
import { IUser } from './user'

export interface IChatroom extends Document {
    messages: IMessage
    name: string
    members: IUser['_id']
    joinPass: string
}

export const chatroomSchema: Schema = new Schema({
    messages: {type: [messageSchema], required: false},
    name: {type: String, required: true},
    members: {type:[Schema.Types.ObjectId]},
    joinPass: {type: String, required: false}
})

const Chatroom = model<IChatroom>('Chatroom', chatroomSchema)
export default Chatroom