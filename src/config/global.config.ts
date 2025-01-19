import { configDotenv } from 'dotenv';

if (process.env.NODE_ENV !== 'production') configDotenv();

const AppConfig: any = {
    db: {
        url: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSKEY}@${process.env.MONGO_CLUSTER_LINK}`
    },

    server: {
        port: process.env.PORT || 3000
    },

    secret: {
        jwt: process.env.JWT_SECRET
    }
};

export { AppConfig };
