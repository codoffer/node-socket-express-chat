const users = []

// Join user to chat
function userJoin (id, username, room) {
  const user = { id, username, room }

  users.push(user)

  return user
}

// Get current user
function getCurrentUser (id) {
  return users.find(user => user.id === id)
}

// User leave chat room
function leaveUser (id) {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers (roomname) {
  return users.filter(user => user.room === roomname)
}

module.exports = {
  userJoin,
  getCurrentUser,
  leaveUser,
  getRoomUsers
}
