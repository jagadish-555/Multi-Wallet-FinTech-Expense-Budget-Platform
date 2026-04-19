import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { globalLimiter } from './middlewares/rateLimiter.middleware';
import routes from './routes';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.registerRoutes();
        this.registerErrorHandlers();
    }

    private config(): void {
        this.app.use(helmet());
        this.app.use(cors({
            origin: env.CLIENT_URL,
            credentials: true,
        }));
        this.app.use(globalLimiter);
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
    }

    private registerRoutes(): void {
        this.app.use('/api/v1', routes);
        this.app.use((req, res) => {
            res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
        });
    }

    private registerErrorHandlers(): void {
        this.app.use(errorMiddleware);
    }
}

export default new App().app;
