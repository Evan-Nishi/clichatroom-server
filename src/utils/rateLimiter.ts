import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit ({
    windowMs: 15 * 60 * 1000,
    max: 250
})

export const createLimiter = rateLimit ({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many create requests from this IP, please try again after an hour'
})