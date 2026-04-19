import app from './app';
import { registerAllListeners } from './events';

const PORT = process.env.PORT || 3000;

function startServer() {
    try {
        registerAllListeners();
        app.listen(PORT, () => {
            console.log(`Server running at: http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('Error during server startup:', error);
    }
}

startServer();