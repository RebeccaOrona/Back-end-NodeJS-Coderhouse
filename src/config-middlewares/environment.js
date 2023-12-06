import dotenv from 'dotenv';

dotenv.config()

const env = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACK_URL: process.env.CALLBACK_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    environment: process.env.NODE_ENV,
    email_service: process.env.email_service,
    email_port: process.env.email_port,
    email_user: process.env.email_user,
    email_pass: process.env.email_pass
}

export default env;

