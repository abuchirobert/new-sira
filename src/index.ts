import express, { Application, Request, Response, NextFunction } from 'express';
import { AppConfig } from './config/global.config';
import CustomError from './errors/CustomError';
import globalError from './errors/global.error';
import router from './routes';
import connectDB from './config/db.config';
import cookieParser from 'cookie-parser';
import cors from 'cors';

connectDB();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: [AppConfig.cors.url],
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'PATCH'],
        allowedHeaders: ['Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'Access-Control-Allow-Headers',
            'Access-Control-Request-Headers',
            'Access-Control-Allow-Origin'
        ]
    })
);


console.log(`Cors url: ${AppConfig.cors.url}`)



app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello, Welcome To Sira Project, A Project that Helps students to Report All the Incidents in the School, Enjoy the App...');
});
app.use('/api/v1', router);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new CustomError(`Oops...., It seems like the Route ${req.method} ${req.originalUrl} You are looking for does not Exist`, 404);
    next(error);
});

app.use(globalError);

app.listen(AppConfig.server.port, () =>
    console.log(`App Listening on http://localhost:${AppConfig.server.port}`)
);
