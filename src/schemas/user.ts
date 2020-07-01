import { Schema } from 'mongoose'
import Hasher from '../middlewares/hash'

const userSchema: Schema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    isVerified: {type: Boolean, default: false}
})

//cannot use arrow operator for callback due to this being needed
userSchema.pre('save', function(next) {
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
export default userSchema

/*import Hasher from './middlewares/hash'

Hasher('hi', 10, (err, hash) => {
    if(err) {
        throw err
    } else {
        console.log(hash)
    }
})
*/