const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Company = require("../models/company.model");

// Store io instance globally so it can be used in controllers
let io = null;

const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Middleware to authenticate socket connections (optional for public updates)
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                
                // Try to fetch student first
                let user = await Student.findById(decoded.studentId).select("-password");
                if (user) {
                    socket.userId = decoded.studentId;
                    socket.userRole = "student";
                    socket.user = user;
                } else {
                    // Try company
                    user = await Company.findById(decoded.companyId).select("-password");
                    if (user) {
                        socket.userId = decoded.companyId;
                        socket.userRole = "company";
                        socket.user = user;
                    }
                }
            }
            
            next();
        } catch (error) {
            // Allow unauthenticated connections (for public updates)
            next();
        }
    });

    io.on("connection", (socket) => {
        console.log(`Socket client connected: ${socket.id}`);

        // If user is authenticated, join their private room
        if (socket.userId && socket.userRole) {
            const roomId = `${socket.userRole}:${socket.userId}`;
            socket.join(roomId);
            console.log(`User ${socket.userId} (${socket.userRole}) joined room: ${roomId}`);
        }

        socket.on("disconnect", () => {
            console.log(`Socket client disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO
};
