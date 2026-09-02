# WebSocket Real-Time Updates Integration Guide
## College Placement Portal - Socket.IO Implementation

---

## ✅ IMPLEMENTATION SUMMARY

Real-time WebSocket functionality has been successfully added to your College Placement Portal using Socket.IO. This document provides a complete overview of all changes, packages installed, and how to test and deploy.

---

## 📦 PACKAGES INSTALLED

### Backend
- **socket.io** (v4.x) - WebSocket server library

```bash
npm install socket.io
```

### Frontend
- **socket.io-client** (v4.x) - WebSocket client library

```bash
npm install socket.io-client
```

---

## 📋 FILES CHANGED & CREATED

### Backend Changes:

#### **NEW FILE**: `backend/src/sockets/socket.js`
- Initializes Socket.IO server
- Handles client connections/disconnections
- Implements JWT authentication for socket connections
- Manages authenticated user rooms (student:userId, company:userId)
- Exports `initializeSocket()` and `getIO()` functions

#### **MODIFIED**: `backend/src/server.js`
- Changed from `app.listen()` to HTTP server with Socket.IO attached
- Uses `http.createServer(app)` instead of direct Express listen
- Calls `initializeSocket(httpServer)` to enable WebSocket support
- Maintains backward compatibility with all existing features

#### **MODIFIED**: `backend/src/controllers/job.controller.js`
- Imports `getIO` from socket module
- **createJob()**: Emits `job:created` event to all connected clients
- **updateJob()**: Emits `job:updated` event to all connected clients
- **deleteJob()**: Emits `job:deleted` event to all connected clients
- Payloads include job details (ID, title, company, location, timestamps)

#### **MODIFIED**: `backend/src/controllers/application.controller.js`
- Imports `getIO` from socket module and `Job` model
- **applyForJob()**: Emits `application:created` event to company's private room
- **updateApplicationStatus()**: Emits `application:statusUpdated` event to student's private room
- Ensures private information stays within appropriate rooms

#### **NEW FILE**: `backend/.env.example`
- Reference for required environment variables
- Documents JWT_SECRET, MONGODB_URI, CORS_ORIGIN setup

### Frontend Changes:

#### **NEW FILE**: `college-placement-frontend/src/socket/socket.js`
- Socket.IO client initialization and management
- Derives server URL from `VITE_API_BASE_URL` environment variable
- Handles JWT token authentication
- Provides exported functions for subscribing to events:
  - `onJobCreated(callback)`
  - `onJobUpdated(callback)`
  - `onJobDeleted(callback)`
  - `onApplicationCreated(callback)`
  - `onApplicationStatusUpdated(callback)`
- Handles reconnection with exponential backoff
- Cleanup and connection management utilities

#### **NEW FILE**: `college-placement-frontend/src/components/LiveUpdatesSection.jsx`
- React component displaying real-time placement updates
- Subscribes to all WebSocket events
- Shows latest 10 updates with time stamps
- Auto-formats time relative to current time ("2 minutes ago")
- Responsive Tailwind styling matching existing design
- Handles no-updates state gracefully
- Automatic cleanup of listeners on component unmount

#### **MODIFIED**: `college-placement-frontend/src/pages/HomePage.jsx`
- Imports `LiveUpdatesSection` component
- Imports `initializeSocket` from socket module
- Uses `useEffect` to initialize Socket.IO on component mount
- Embeds `<LiveUpdatesSection />` right after Hero section
- Maintains all existing functionality and styling

#### **NEW FILE**: `college-placement-frontend/.env.example`
- Reference for frontend environment variables
- Shows development and production API URL examples
- Documents automatic Socket.IO URL derivation

---

## 🔌 WEBSOCKET EVENTS REFERENCE

### Job Events (Broadcast to All Connected Clients)

#### `job:created`
Fired when a company creates a new job.

**Payload:**
```json
{
  "jobId": "ObjectId",
  "title": "Software Developer",
  "company": "TCS",
  "location": "Bangalore",
  "createdAt": "2024-01-15T10:30:00Z",
  "fullJob": { /* complete job object */ }
}
```

#### `job:updated`
Fired when a company updates an existing job.

**Payload:**
```json
{
  "jobId": "ObjectId",
  "title": "Senior Software Developer",
  "company": "TCS",
  "location": "Bangalore",
  "updatedAt": "2024-01-15T11:30:00Z",
  "fullJob": { /* complete updated job object */ }
}
```

#### `job:deleted`
Fired when a company deletes a job posting.

**Payload:**
```json
{
  "jobId": "ObjectId",
  "title": "Software Developer",
  "company": "TCS",
  "deletedAt": "2024-01-15T12:30:00Z"
}
```

### Application Events (Sent to Private Rooms)

#### `application:created`
Fired when a student applies for a job. Sent to `company:{companyId}` room only.

**Payload:**
```json
{
  "applicationId": "ObjectId",
  "jobId": "ObjectId",
  "jobTitle": "Software Developer",
  "studentName": "John Doe",
  "studentEmail": "john@example.com",
  "appliedAt": "2024-01-15T09:00:00Z",
  "status": "APPLIED"
}
```

#### `application:statusUpdated`
Fired when a company updates an application status. Sent to `student:{studentId}` room only.

**Payload:**
```json
{
  "applicationId": "ObjectId",
  "jobId": "ObjectId",
  "jobTitle": "Software Developer",
  "status": "SHORTLISTED",
  "updatedAt": "2024-01-15T14:00:00Z",
  "message": "Your application status has been updated to SHORTLISTED"
}
```

---

## 🔐 AUTHENTICATION & PRIVATE ROOMS

### How Private Rooms Work:

1. **Client Connection**: When a user opens the app, the Socket.IO client connects with their JWT token:
   ```javascript
   auth: {
     token: localStorage.getItem('cpp_auth').token
   }
   ```

2. **Server Validation**: Socket.IO middleware verifies the token and identifies the user:
   - Decodes JWT to get `studentId` or `companyId`
   - Fetches user from database
   - Sets `socket.userId` and `socket.userRole`

3. **Room Joining**: Authenticated users automatically join their private room:
   - Students join: `student:{studentId}`
   - Companies join: `company:{companyId}`

4. **Event Broadcasting**:
   - Public events (jobs): `io.emit()` - reaches all clients
   - Private events (applications): `io.to(roomId).emit()` - reaches only the specific user

### Security:
- ✅ JWT token required for authenticated connections
- ✅ Server validates user before adding to rooms
- ✅ Private student/company data stays in private rooms
- ✅ Users can only receive their own application notifications
- ✅ Public job updates accessible to all users
- ✅ No sensitive information exposed in events

---

## 🌐 FRONTEND CONNECTION WORKFLOW

### Socket.IO Client Setup:

1. **URL Derivation**:
   ```javascript
   // Uses VITE_API_BASE_URL environment variable
   const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
   const serverURL = apiBaseURL.replace(/\/api\/?$/, "");
   ```

2. **Authentication**:
   ```javascript
   const auth = readStoredAuth(); // Gets JWT from localStorage
   socket = io(serverURL, {
     reconnection: true,
     reconnectionDelay: 1000,
     auth: { token: auth?.token }
   });
   ```

3. **Event Listeners**:
   ```javascript
   // In LiveUpdatesSection component
   useEffect(() => {
     const unsubscribe = onJobCreated((data) => {
       addUpdate({
         type: "job",
         message: `${data.company} posted a new ${data.title} position`
       });
     });
     return () => unsubscribe(); // Cleanup on unmount
   }, []);
   ```

### Live Updates UI:
- Displays latest 10 updates
- Auto-updates when WebSocket events arrive
- No page refresh needed
- Shows relative time ("2 minutes ago")
- Clean, responsive design matching your Tailwind theme

---

## 🚀 LOCAL TESTING STEPS

### Prerequisites:
- Node.js and npm installed
- MongoDB running locally or connection string configured
- Both backend and frontend running

### Step 1: Configure Environment

**Backend** (`backend/.env`):
```
PORT=5000
JWT_SECRET=your_development_secret_key
MONGODB_URI=mongodb://localhost:27017/college-placement-portal
```

**Frontend** (`college-placement-frontend/.env.local`):
```
VITE_API_BASE_URL=http://localhost:5000
```

### Step 2: Start Backend
```bash
cd backend
npm install
npm run dev
```
Expected output:
```
Server is running on port 5000
Socket client connected: <socket-id>
```

### Step 3: Start Frontend
```bash
cd college-placement-frontend
npm install
npm run dev
```
Expected output:
```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 4: Test Job Events

1. Open Home page in browser (http://localhost:5173)
   - You should see "Live Placement Updates" section
   - Initially shows empty state message

2. Open Company Dashboard in another browser tab or incognito window

3. Create a new job from Company Dashboard
   - Fill in job details and submit
   - Check Home page immediately
   - **EXPECTED**: New update appears in "Live Placement Updates" without page refresh

4. Update an existing job
   - Modify job details and submit
   - Check Home page
   - **EXPECTED**: Update event appears with company name and job title

5. Delete a job
   - Delete a job from company dashboard
   - Check Home page
   - **EXPECTED**: Job deleted event appears

### Step 5: Test Application Events

1. Login as Student in one tab

2. Login as Company in another tab

3. **Test Application Creation**:
   - As Student: Apply for a job
   - Switch to Company tab
   - **EXPECTED**: Company sees "New Application" notification (if on Home page or monitoring console)
   - Navigate to view applicants - new applicant appears

4. **Test Status Update**:
   - As Company: Update application status to "SHORTLISTED"
   - Switch to Student tab and go to "My Applications"
   - **EXPECTED**: Status updates immediately (if WebSocket working)
   - If on Home page: Student sees "Application Status" update

### Step 6: Test Real-Time Multiple Users

1. Open Home page in 3+ browser windows
2. Create/update/delete jobs from company dashboard
3. **EXPECTED**: All windows show updates simultaneously without refresh

### Step 7: Test Reconnection

1. Open Home page
2. Disconnect network (DevTools Network throttle or unplug network)
3. Perform action in another window (create job)
4. Reconnect network
5. **EXPECTED**: After reconnection, socket reconnects and continues receiving updates

### Step 8: Open Browser Console

Monitor console for debug messages:
```
Socket connected: <socket-id>
Socket disconnected
Socket connection error: <error>
```

---

## 🌍 PRODUCTION/RENDER DEPLOYMENT

### Backend Deployment (Render):

1. **No changes needed to code** - Socket.IO works automatically with your existing Render deployment

2. **Environment Variables** - Ensure these are set in Render dashboard:
   ```
   PORT=5000
   JWT_SECRET=<your-production-secret>
   MONGODB_URI=<your-mongodb-uri>
   ```

3. **CORS Configuration** - Socket.IO is pre-configured for CORS:
   ```javascript
   cors: {
     origin: "*",
     methods: ["GET", "POST"],
     credentials: true
   }
   ```

4. **Render URL**: 
   ```
   https://college-placement-backend-bwyu.onrender.com
   ```

### Frontend Deployment:

1. **Update Environment Variable** - In your deployment/Vercel settings:
   ```
   VITE_API_BASE_URL=https://college-placement-backend-bwyu.onrender.com
   ```

2. **Socket.IO URL** will automatically become:
   ```
   https://college-placement-backend-bwyu.onrender.com
   ```

3. **No build changes needed** - Vite will use the production environment variable

### Testing Production:

1. Deploy backend to Render (if not already done)
2. Deploy frontend to Vercel/Netlify with production API URL
3. Open live production site
4. Follow local testing steps 4-8 above
5. Verify real-time updates work across multiple users

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: Socket Connection Fails
**Symptom**: Console shows "Socket connection error" or no connection
**Solutions**:
- Verify `VITE_API_BASE_URL` matches backend URL (without trailing slash)
- Check backend is running and Socket.IO is initialized
- Verify CORS is not blocking (check Network tab in DevTools)
- Ensure JWT token exists if server requires auth

### Issue 2: Events Not Appearing in Live Updates
**Symptom**: Events broadcast but don't show in UI
**Solutions**:
- Verify Socket.IO events are being emitted (check backend console)
- Check that LiveUpdatesSection component is mounted on Home page
- Verify event listener subscriptions in LiveUpdatesSection.jsx
- Check browser console for JavaScript errors
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue 3: Private Room Events Not Received
**Symptom**: Application status updates don't reach student, or new applications don't reach company
**Solutions**:
- Verify user is authenticated (token in localStorage)
- Check JWT token hasn't expired
- Verify user ID matches in room name (student:userId, company:companyId)
- Ensure backend is using correct room names when emitting
- Check application belongs to correct company/student

### Issue 4: Socket Reconnects Too Often
**Symptom**: Console shows frequent "Socket disconnected" and "Socket connected"
**Solutions**:
- Check network stability
- Verify server response times aren't too slow
- Check backend for errors in logs
- Increase reconnectionDelay in socket.js if needed
- Verify MongoDB connection is stable

### Issue 5: Socket Doesn't Reconnect After Network Disconnect
**Symptom**: Goes offline, network returns, but socket doesn't reconnect
**Solutions**:
- Manually refresh page (socket.js will reinitialize)
- Check reconnectionAttempts value (currently 5 attempts)
- Verify auth token is still valid after reconnection
- Check browser console for specific error messages

### Issue 6: Wrong Events on Wrong Users
**Symptom**: Student gets company notifications or vice versa
**Solutions**:
- Verify room names in socket.js (should be `student:${studentId}` etc.)
- Check that user role is correctly identified (student vs company)
- Verify JWT token correctly encodes studentId or companyId
- Check application controller uses correct room in `io.to()`

### Issue 7: Frontend Can't Find Socket Module
**Symptom**: "Cannot find module" or build fails
**Solutions**:
```bash
# Verify socket.io-client is installed
npm install socket.io-client

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

---

## 📊 DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│                                                             │
│  HomePage.jsx                                              │
│  ├─ useEffect() → initializeSocket()                      │
│  └─ <LiveUpdatesSection />                                │
│        ├─ onJobCreated()                                  │
│        ├─ onJobUpdated()                                  │
│        ├─ onJobDeleted()                                  │
│        ├─ onApplicationCreated()                          │
│        └─ onApplicationStatusUpdated()                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ Socket.IO Events
                       │ (TCP/WebSocket)
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                    BACKEND (Node.js)                        │
│                                                             │
│  server.js (HTTP + Socket.IO Server)                       │
│  ├─ socket.js: Socket initialization & room management    │
│  │    ├─ Connection handler                               │
│  │    ├─ JWT verification                                 │
│  │    └─ Room joining (student:id, company:id)            │
│  │                                                         │
│  ├─ Controllers emit WebSocket events:                     │
│  │    ├─ job.controller.js                                │
│  │    │    ├─ createJob() → emit job:created              │
│  │    │    ├─ updateJob() → emit job:updated              │
│  │    │    └─ deleteJob() → emit job:deleted              │
│  │    │                                                    │
│  │    └─ application.controller.js                        │
│  │         ├─ applyForJob() → emit application:created    │
│  │         └─ updateApplicationStatus() →                 │
│  │              emit application:statusUpdated            │
│  │                                                         │
│  └─ REST APIs (still work as before):                      │
│        ├─ POST /api/jobs                                   │
│        ├─ PUT /api/jobs/:id                                │
│        ├─ DELETE /api/jobs/:id                             │
│        ├─ POST /api/jobs/:id/apply                         │
│        └─ PUT /api/applications/:id/status                 │
│                                                             │
│  MongoDB (Job & Application data persisted)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 FILE STRUCTURE REFERENCE

```
backend/
├── src/
│   ├── sockets/
│   │   └── socket.js                 [NEW - Socket.IO setup]
│   ├── controllers/
│   │   ├── job.controller.js         [MODIFIED - Job events]
│   │   └── application.controller.js [MODIFIED - App events]
│   ├── server.js                     [MODIFIED - HTTP + Socket.IO]
│   └── ...
├── .env.example                      [NEW - Environment template]
└── package.json                      [socket.io added]

college-placement-frontend/
├── src/
│   ├── socket/
│   │   └── socket.js                 [NEW - Socket.IO client]
│   ├── components/
│   │   └── LiveUpdatesSection.jsx    [NEW - Live updates UI]
│   ├── pages/
│   │   └── HomePage.jsx              [MODIFIED - Socket + updates]
│   ├── api/
│   │   └── axios.js                  [unchanged - still works]
│   └── ...
├── .env.example                      [NEW - Environment template]
└── package.json                      [socket.io-client added]
```

---

## ✨ FEATURES THAT CONTINUE TO WORK

All existing functionality remains unchanged:

### Student Features:
- ✅ Register
- ✅ Login
- ✅ View Profile
- ✅ Update Profile
- ✅ Upload Resume
- ✅ Browse Jobs
- ✅ Apply for Jobs (REST + now with WebSocket notification to company)
- ✅ View Applications
- ✅ Track Application Status

### Company Features:
- ✅ Register
- ✅ Login
- ✅ View Profile
- ✅ Update Profile
- ✅ Create Jobs (REST + now with WebSocket broadcast)
- ✅ View Jobs
- ✅ Update Jobs (REST + now with WebSocket broadcast)
- ✅ Delete Jobs (REST + now with WebSocket broadcast)
- ✅ View Applicants
- ✅ Update Application Status (REST + now with WebSocket notification to student)

### General Features:
- ✅ View Statistics
- ✅ Authentication (JWT)
- ✅ Authorization (student/company roles)
- ✅ Multer file uploads (resume)

---

## 🎯 NEXT STEPS (OPTIONAL ENHANCEMENTS)

If you want to enhance this further in the future:

1. **Sound Notifications**: Add audio alert when updates arrive
   ```javascript
   const sound = new Audio('/notification.mp3');
   sound.play();
   ```

2. **Browser Notifications**: Use Notification API for desktop alerts
   ```javascript
   if (Notification.permission === 'granted') {
     new Notification('New Job Posted', { body: data.message });
   }
   ```

3. **Activity Feed**: Create a dedicated activity page showing all events

4. **Real-time Counters**: Update job count, application count as they change

5. **Typing Indicators**: Show "Company is viewing applicants" type events

6. **Message Delivery Status**: Confirm WebSocket delivery (optional)

7. **Analytics**: Track which events users interact with

---

## 📞 SUPPORT & DEBUGGING

### Enable Debug Logging:

**Backend**:
```javascript
// In socket.js, add before io.on('connection'):
const socketDebug = require('debug')('socket.io');
io.on('connection', (socket) => {
  console.log(`[DEBUG] Socket ${socket.id} connected`);
});
```

**Frontend**:
```javascript
// In socket.js, add after socket initialization:
socket.on('*', (event, ...args) => {
  console.log('[DEBUG] Socket event:', event, args);
});
```

### Check Network Tab in DevTools:
1. Open DevTools (F12)
2. Go to "Network" tab
3. Filter: "WS" (shows WebSocket connections)
4. Look for your server URL with "/socket.io/?..." path
5. Should show status 101 Switching Protocols (successful upgrade)

### Check Console Messages:
```
✓ "Socket connected: <socket-id>"
✓ Events logged as they arrive
✓ No errors or warnings
```

---

## 🎉 YOU'RE ALL SET!

Your College Placement Portal now has complete real-time WebSocket functionality! 

- ✅ Jobs and applications broadcast instantly
- ✅ Students and companies get private notifications
- ✅ All existing REST APIs continue working
- ✅ Beautiful, responsive UI for live updates
- ✅ Secure authentication and private rooms
- ✅ Production-ready for Render deployment

For questions or issues, refer to the troubleshooting section above.

Happy coding! 🚀
