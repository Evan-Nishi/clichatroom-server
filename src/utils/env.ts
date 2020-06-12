import { resolve } from 'path'
import { config } from 'dotenv'

switch(process.env.NODE_ENV){
    case 'test':
        config({ path: resolve(__dirname, '../../.env.test') })
    case 'prod':
        config({ path: resolve(__dirname, '../../.env.prod') })
    default:
        config({ path: resolve(__dirname, '../../.env.test') })
}


export const MONGO_URL = process.env.MONGO_URL