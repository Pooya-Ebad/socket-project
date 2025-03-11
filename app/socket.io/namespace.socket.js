const { ConversationModel } = require("../models/conversation");

module.exports = class NamespaceSocketHandler {
  #io;
  constructor(io) {
    this.#io = io;
  }
  initConnection() {
    this.#io.on("connection", async (socket) => {
      const namespaces = await ConversationModel.find(
        {},
        { title: 1, endpoint: 1 }
      ).sort({ _id: -1 });
      socket.emit("namespaceList", namespaces);
    });
  }
  async createNamespaceConnection() {
    const namespaces = await ConversationModel.find(
      {},
      { title: 1, endpoint: 1, rooms: 1 }
    ).sort({ _id: -1 });
    for (const namespace of namespaces) {
      this.#io.of(`/${namespace.endpoint}`).on("connection", async (socket) => {
        const conversation = await ConversationModel.findOne(
          { endpoint: namespace.endpoint },
          { rooms: 1 }
        ).sort({ _id: -1 });
        socket.emit("roomList", conversation.rooms);
        socket.on("joinRoom", async (roomName) => {
          const lastRoom = [...socket.rooms][1];
          if (lastRoom) {
            socket.leave(lastRoom);
          }
          socket.join(roomName);
          await this.getOnlineUsers(namespace.endpoint, roomName);
          const roomInfo = conversation.rooms.find(
            (item) => item.name == roomName
          );
          socket.emit("roomInfo", roomInfo);
          this.getNewMessage(socket)
        });
      });
    }
  }
  async getOnlineUsers(endpoint, roomName) {
    const onlineUsers = await this.#io
      .of(`/${endpoint}`)
      .in(roomName)
      .allSockets();
    this.#io
      .of(`/${endpoint}`)
      .in(roomName)
      .emit("onlineUsersCount", Array.from(onlineUsers).length);
  }
  getNewMessage(socket){
    socket.on("newMessage", async data => {
        const { endpoint, message, roomName } = data
        console.log(roomName);
        await ConversationModel.updateOne({ endpoint, "rooms.name" : roomName}, {
            $push : {
                "rooms.$.messages" : {
                    sender : "67c5eb88d02c9664d88e3aab",
                    message,
                    dateTime : Date.now()
                }
            }
        })
    })
  }
};
