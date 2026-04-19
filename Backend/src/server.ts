import app from './app';
import { registerAllListeners } from './events';
import { startAllJobs } from './jobs';

const PORT = process.env.PORT || 3000;

function startServer() {
    try {
        registerAllListeners();
        startAllJobs();
        app.listen(PORT, () => {
            console.log(`Server running at: http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('Error during server startup:', error);
    }
}

startServer();