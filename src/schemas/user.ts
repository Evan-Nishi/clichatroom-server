import { Schema } from 'mongoose'

const userSchema: Schema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: false}
})

/*userSchema.pre('save', {
    
})
*/
export default userSchema