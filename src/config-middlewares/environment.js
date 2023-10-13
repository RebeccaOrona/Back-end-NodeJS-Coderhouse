import dotenv from 'dotenv';

dotenv.config()

const env = {
    port: process.env.PORT,
    mongoUrl: process.env.mongoUrl,
    baseUrl: process.env.baseUrl,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL,
    sessionSecret: process.env.SESSION_SECRET,
    environment: process.env.NODE_ENV,
    email_service: process.env.email_service,
    email_port: process.env.email_port,
    email_user: process.env.email_user,
    email_pass: process.env.email_pass
}

export default env;

