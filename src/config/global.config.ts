import { configDotenv } from 'dotenv';

if (process.env.NODE_ENV !== 'production') configDotenv();

const AppConfig: any = {
    db: {
        url: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSKEY}@cluster0.iec4oco.mongodb.net/Sira`
    },

    server: {
        port: process.env.PORT || 3000
    },

    secret: {
        jwt: process.env.JWT_SECRET,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
};

export { AppConfig };
