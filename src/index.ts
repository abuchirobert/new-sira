import express, { Application, Request, Response, NextFunction } from 'express';
import { AppConfig } from './config/global.config';
import CustomError from './errors/CustomError';
import globalError from './errors/global.error';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello, Welcome To Sira Project, A Project that Helps students to Report All the Incidents in the School, Enjoy the App...');
});

app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new CustomError(`Oops...., It seems like the Route ${req.originalUrl} You are looking for does not Exist`, 404);
    next(error);
});

app.use(globalError);

app.listen(AppConfig.server.port, () => console.log(`App Listening on Port ${AppConfig.server.port}`));
