import express from 'express';
import http from 'http';
import cors  from 'cors';
import bodyParser  from 'body-parser';
import dotenv  from 'dotenv';
import loginroutes  from './routes/register.js'
import referralRoutes from './routes/referral.js'; 
import purchaseRoutes from './routes/purchase.js';
import earningRoutes from './routes/earning.js';
import chartRoutes from './routes/chart.js';
import { Server } from 'socket.io'; 



dotenv.config();

const app = express();
const PORT = 5000;


app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.send('Event Management API is running');
});


app.use('/api', loginroutes);
app.use('/api/user',referralRoutes );
app.use('/api/visualisation', chartRoutes);
app.use('/api/pr',(req, res, next) =>{
    req.io=io;
    req.userSockets = userSockets;
    next();
},purchaseRoutes );
app.use('/api/earning', earningRoutes);

const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register', (user_id) => {
    userSockets.set(user_id, socket.id);
    console.log(`User ${user_id} registered for real-time updates`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    [...userSockets.entries()].forEach(([uid, sid]) => {
      if (sid === socket.id) userSockets.delete(uid);
    });
  });
});


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
