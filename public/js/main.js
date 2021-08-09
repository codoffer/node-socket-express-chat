const objChatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

const domRoomName = document.getElementById('room-name')
const domRoomUsers = document.getElementById('users')

// Get username and room from URL

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

const socket = io()

// Join chatroom
socket.emit('joinRoom', { username, room })

// Get room information
socket.on('roomInfo', ({ room, users }) => {
  displayRoomInfo(room)
  displayRoomUsers(users)
})

socket.on('message', message => {
  console.log(message)
  renderMessages(message)

  // Scroll Down the message to the bottom
  chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message Submit

objChatForm.addEventListener('submit', event => {
  event.preventDefault()

  // Grab Message
  const message = event.target.elements.msg.value

  // Emit message to server
  socket.emit('chatMessage', message)

  //Clear message input
  event.target.elements.msg.value = ''
})

function renderMessages (message) {
  const messageDiv = document.createElement('div')
  messageDiv.classList.add('message')
  messageDiv.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.messageText}</p>`
  chatMessages.appendChild(messageDiv)
}

function displayRoomInfo (room) {
  domRoomName.innerText = room
}

function displayRoomUsers (users) {
  domRoomUsers.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}
