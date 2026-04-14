import app from './app';

const PORT = process.env.PORT || 3000;


function startServer() {
    try{
        app.listen(PORT, ()=>{
            console.log(`Server running at: http://localhost:${PORT}/`)
        });
    } catch(error) {
        console.error("Error during server startup:", error)
    }
}

startServer;