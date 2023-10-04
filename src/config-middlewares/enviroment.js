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
    sessionSecret: process.env.SESSION_SECRET

}

export default env;

