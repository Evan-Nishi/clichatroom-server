import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit ({
    windowMs: 15 * 60 * 1000,
    max: 100
})

export const createLimiter = rateLimit ({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many accounts created from this IP, please try again after an hour'
})