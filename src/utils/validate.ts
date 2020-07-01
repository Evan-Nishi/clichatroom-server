import { EMAIL, EMAIL_PASS } from '../utils/env'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: EMAIL_PASS
    }
})
/**
 * Email validation regex
 * @param {string} email - email to be validated
 * @returns {boolean} - true if str is a valid email, false if otherwise
*/
export function validateEmail( email: string ) {
    const re: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}
/** 
 * Verfy email function
 * @param {string} sendTo - email to send verification to
 * @param {string} userName - the account's username
 * @param {string} pin - the one time verification pin 
*/
export function verifyEmail( sendTo: string, userName: string, pin: string ) {
    const mailConfig = {
        from: EMAIL,
        to: sendTo,
        subject: 'Clichatroom: Verify Your Account',
        html: `<p>You have created an account on Clichatroom's default server with this address.  Here is your verification PIN for ${userName}: <b>${pin}</b></p>`
    }
    transporter.sendMail(mailConfig, (error, info) => {
        if(error) {
            console.log(error)
        } else {
            console.log(info.response)
        }
    })
}