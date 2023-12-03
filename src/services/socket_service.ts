import { Server } from "socket.io";

let io;

export const sendMessageToReceiver = async (userId, data) => {
  try {
    io.to(userId).emit("MessageResponse", data, (error) => {
      if (error) {
        console.error("Error sending message:", error);
      } else {
        console.log("Message sent successfully");
      }
    });
  } catch (error) {
    throw error;
  }
};

export const sendRecentMessageToReceiver = async ({
  senderId,
  receiverId,
  data,
}) => {
  try {
    io.to(senderId).to(receiverId).emit("RecentMessageResponse", data);
  } catch (error) {
    throw error;
  }
};

const listenToEvents = (socket, userId) => {
  
};



export const makeSocketConnection = async (server) => {
  try {
    io = new Server(server);

    // createRedisClientAndConnect(io);

    io.on("connection", async (socket) => {
      const userId = socket.handshake.query.userId;

      console.log(
        `-------------------- USER CONNECTED WITH SOCKET_ID : ${socket.id} and ${userId} -------------------`
      );

      socket.join(userId);

      socket.on("disconnect", () => {
        console.log(
          `-------------------- USER DISCONNECTED WITH SOCKET_ID : ${socket.id} and ${userId} -------------------`
        );
        socket.leave(userId);
      });

      listenToEvents(socket, userId);
    });
  } catch (error) {
    throw error;
  }
};
