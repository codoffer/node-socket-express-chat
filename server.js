const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { info } = require('console')
const formatMessage = require('./lib/messages')
const {
  userJoin,
  getCurrentUser,
  leaveUser,
  getRoomUsers
} = require('./lib/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

const chatBotName = 'Codoffer'

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)

    socket.emit(
      'message',
      formatMessage(chatBotName, 'Welcome to codoffer chat.')
    )

    //Boradcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(chatBotName, `${user.username} has joined the chat.`)
      )

    //Send user and room information
    io.to(user.room).emit('roomInfo', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })

  // Listen for chatMessage
  socket.on('chatMessage', message => {
    const user = getCurrentUser(socket.id)

    io.to(user.room).emit('message', formatMessage(user.username, message))
  })

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = leaveUser(socket.id)
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(chatBotName, `${user.username} has left the chat room.`)
      )

      //Send user and room information
      io.to(user.room).emit('roomInfo', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }
  })
})

const PORT = 3000 || process.env.PORT
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
