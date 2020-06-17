import { hash } from 'bcrypt'

// @param {string} pass - plaintext password
// @param {number} rounds - number of salt rounds
export default function Hasher(pass: string, rounds: number, callback: (error: Error, hash: string) => void){
    hash(pass, rounds,(error, hash) => {
        callback(error, hash)
    })
}