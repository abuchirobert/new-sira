import mongoose from 'mongoose';
import { AppConfig } from './global.config';

const connectDB = async () => {
    if (!AppConfig.db.url) {
        console.log('MONGO_URL environment variable is not set');
        process.exit(1);
    }

    try {
        const con = await mongoose.connect(AppConfig.db.url);
        // console.log(`Connected: ${con.connection.host} : ${con.connection.name}`);

        mongoose.connection.on('disconnect', () => {
            console.error('MongoDB Connection Lost');
            process.exit(1);
        });
    } catch (error: any | unknown) {
        console.error(error.message);
        process.exit(1);
    }
};

export default connectDB;
