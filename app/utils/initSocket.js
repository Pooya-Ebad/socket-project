const socketIo = require('socket.io')
function initialSocket(httpServer){
    const io = socketIo(httpServer, {
        cors : {
            origin : "*"
        }
    })
    return io
}

module.exports = {
    initialSocket
}