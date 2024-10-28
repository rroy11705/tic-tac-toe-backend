import { Server } from "socket.io";

export const generateUniqueRoomId = (length = 6, io: Server) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  while (true) {
    // Generate a random room ID
    let roomId = Array.from(
      { length },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");

    // Check if the room ID is unique
    if (!io.sockets.adapter.rooms.get(roomId)) {
      return roomId;
    }
  }
};
