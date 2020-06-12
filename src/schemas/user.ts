import { Schema, model } from 'mongoose'


export const userSchema: Schema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: false}
})

export const userModel = model('user', userSchema)