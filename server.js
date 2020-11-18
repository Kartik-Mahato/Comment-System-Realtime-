const express = require('express');
const app = express();

const port = process.env.PORT || 8000;

app.use(express.static('public'))

const dbConnect = require('./db')
dbConnect();
const Comment = require('./models/comment')
app.use(express.json())

// routes
app.post('/api/Comments', (req, res) => {
    var comment = new Comment({
        username: req.body.username,
        comment: req.body.comment
    })
    comment.save().then((response) => {
        res.send(response)
    })
})

const server = app.listen(port, () => {
    console.log(`Listening on port :${port}`);

})

let io = require('socket.io')(server)

io.on('connection', (socket) => {
    console.log(`new connection: ${socket.id}`);
    // receive emit
    socket.on('comment', (data) => {
        data.time = Date()
        socket.broadcast.emit('comment', data)

    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })
})
