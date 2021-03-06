require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8888;
const auth  = require('./modules/auth.js');
const cors = require('cors')
const Match = require("./models/matchModel");

 

const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
      origins: ["https://spotinder.netlify.app", "http://localhost:3000"],
      methods: ["GET", "POST"]
    }
    });

const { usersRouter } = require('./routers/usersRouter');
const { spotifyRouter } = require('./routers/spotifyRouter');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('frontend'));

app.use('/users', [auth.verifyToken], usersRouter);
app.use('/spotify', spotifyRouter);
app.post('/login', auth.signin);
app.post('/signup', auth.signup);

app.all('*', (req, res) => {
    res.json({ status: false, message: 'Route not found' });
});

io.on('connection', function(socket) {
    const id = socket.handshake.query.id;
    console.log('A user connected: ' + id);

    socket.on('join-room', function(data) {
        socket.join(data.room);
        console.log('User joined room: ' + data.room);
    });

    socket.on('leave-room', function(data) {
        socket.leave(data.room);
        console.log('User left room: ' + data.room);
    });

    socket.on('send-message', function(data) {
        Match.findOneAndUpdate(
            { _id: data.room },
            { $push: { messages: data.message } },
            { new: true },
            (err, match) => {
                if (err) {
                    console.log(err);
                }
            }
        );             
        socket.to(data.room).emit('receive-message', {sender: id, data: data.message, room: data.room});
    });

    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });

 });


http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});