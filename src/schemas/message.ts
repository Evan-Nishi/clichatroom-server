import { Schema, Document, model } from 'mongoose'
import { IUser } from './user'
import { IChatroom } from './chatroom'

export interface IMessage extends Document {
    timeStamp: Date
    body: string
    sentByID: IUser['_id']
    chatRoomId: IChatroom['_id']
}

export const messageSchema: Schema = new Schema({
    timeStamp: {type: Date, required: false},
    body: {type: String, required: true},
    sentByID: {type: Schema.Types.ObjectId, required: true},
    chatRoomId: {type: Schema.Types.ObjectId, required: true}
})

const Message = model<IMessage>('Message', messageSchema)
export default Message