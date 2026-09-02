const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");
const connectDatabase = require("./config/database");
const { initializeSocket } = require("./sockets/socket");

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDatabase();

        // Create HTTP server and attach Socket.IO
        const httpServer = http.createServer(app);
        initializeSocket(httpServer);

        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start server");
    }
};

startServer();