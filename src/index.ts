import express, { Application, Request, Response, NextFunction } from 'express';
import { AppConfig } from './config/global.config';
import CustomError from './errors/CustomError';
import globalError from './errors/global.error';
import router from './routes';
import connectDB from './config/db.config';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Connect to MongoDB
connectDB();

const app: Application = express();

// Define allowed origins
const allowedOrigins = [
    AppConfig.cors.url,
    // Add your production frontend URL when deployed
    'https://project-sira.vercel.app',
];

// Basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, curl, etc)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Access-Control-Allow-Headers', 'Access-Control-Request-Headers', 'Access-Control-Allow-Origin'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 204
    })
);

// Additional security headers middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Debug logging
console.log(`Cors url: ${AppConfig.cors.url}`);
console.log('Allowed origins:', allowedOrigins);

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello, Welcome To Sira Project, A Project that Helps students to Report All the Incidents in the School, Enjoy the App...');
});

// API routes
app.use('/api/v1', router);

// 404 handler
app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const error = new CustomError(`Oops...., It seems like the Route ${req.method} ${req.originalUrl} You are looking for does not Exist`, 404);
    next(error);
});

// Global error handler
app.use(globalError);

// Start server
app.listen(AppConfig.server.port, () => console.log(`App Listening on http://localhost:${AppConfig.server.port}`));

export default app;
