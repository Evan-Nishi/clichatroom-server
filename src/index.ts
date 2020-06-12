import { MONGO_URL } from './utils/env'
import { connect } from 'mongoose'

connect(MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true})
    .catch((error) => console.log(error))
