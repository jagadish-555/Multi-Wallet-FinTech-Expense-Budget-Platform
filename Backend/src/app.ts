import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { globalLimiter } from './middlewares/rateLimiter.middleware';



class App {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.config();
        this.registerRoutes();
    }

    private config(): void {
        this.app.use(helmet());
        this.app.use(cors({
            origin: env.CLIENT_URL,
            credentials: true,
        }));
        this.app.use(globalLimiter);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private registerRoutes():void {
        const router = express.Router();
        router.get('/',(req,res)=>{
            res.status(200).send('Hello, World!');
        });
        this.app.use("/api",router)
        this.app.use((req, res) => {
            res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
        });
        this.app.use(errorMiddleware);
    }

}




export default new App().app;

