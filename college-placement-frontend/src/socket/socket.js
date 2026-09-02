import { io } from "socket.io-client";
import { readStoredAuth } from "./axios";

let socket = null;

/**
 * Initialize Socket.IO connection
 * Derives the socket URL from the API base URL
 */
export const initializeSocket = () => {
  if (socket) return socket;

  const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  
  // Remove /api from the URL if present and derive the base server URL
  const serverURL = apiBaseURL.replace(/\/api\/?$/, "");

  // Get JWT token for authenticated connections
  const auth = readStoredAuth();
  const token = auth?.token || null;

  socket = io(serverURL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    auth: {
      token
    }
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

/**
 * Get the existing socket instance
 */
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

/**
 * Close socket connection
 */
export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Subscribe to job events
 */
export const onJobCreated = (callback) => {
  const sock = getSocket();
  sock.on("job:created", callback);
  return () => sock.off("job:created", callback);
};

export const onJobUpdated = (callback) => {
  const sock = getSocket();
  sock.on("job:updated", callback);
  return () => sock.off("job:updated", callback);
};

export const onJobDeleted = (callback) => {
  const sock = getSocket();
  sock.on("job:deleted", callback);
  return () => sock.off("job:deleted", callback);
};

/**
 * Subscribe to application events
 */
export const onApplicationCreated = (callback) => {
  const sock = getSocket();
  sock.on("application:created", callback);
  return () => sock.off("application:created", callback);
};

export const onApplicationStatusUpdated = (callback) => {
  const sock = getSocket();
  sock.on("application:statusUpdated", callback);
  return () => sock.off("application:statusUpdated", callback);
};
