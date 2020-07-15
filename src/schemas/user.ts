import { Schema, Document, model } from 'mongoose'
import bcrypt from 'bcrypt'
import Hasher from '../middlewares/hash'

export interface IUser extends Document {
    username: string
    password: string
    email: string
    isVerfified: boolean
    pin: string
}

export const userSchema: Schema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    pin: {type: String}
})

//not using arrow functions because we use this
userSchema.pre('save', function(this: IUser, next: any) {
    if(!this.isModified()){
        return next()
    }
    Hasher(this.password, 10, (err, hash) => {
        if(err) {
            console.log(err)
        } else {
            this.password = hash
            next()
        }
    })
})

userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}
const User = model<IUser>('User', userSchema)
export default User

/*import Hasher from './middlewares/hash'

Hasher('hi', 10, (err, hash) => {
    if(err) {
        throw err
    } else {
        console.log(hash)
    }
})
*/