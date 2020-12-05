const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const clientIo = require('socket.io-client'); 
const {v4: uuidV4} = require('uuid');
const path = require('path')


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'/static')));

app.get('/', (req, res)=>{	
	res.render('index');
})

app.get('/generateRoom', (req, res)=>{
	res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res)=>{
	res.render('meeting', {roomId: req.params.room})
})

io.on('connection', socket =>{
	socket.on('join-room', (roomId, userId)=>{
		socket.join(roomId);
		socket.to(roomId).broadcast.emit('user-connected', userId);
		socket.on('disconnect', ()=>{
			socket.to(roomId).broadcast.emit('user-disconnected', userId);
		})
	})
})

server.listen(3000)