import express from 'express';
import bodyParser from 'body-parser';



class App {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.config();
        this.registerRoutes();
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private registerRoutes():void {
        const router = express.Router();
        router.get('/',(req,res)=>{
            res.status(200).send('Hello, World!');
        })
        this.app.use("/api",router)
    }

}




export default new App().app;

