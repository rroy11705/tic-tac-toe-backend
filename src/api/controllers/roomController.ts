import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import { Service } from "typedi";
import { generateUniqueRoomId } from "../../utils";

@SocketController()
@Service()
export class RoomController {
  @OnMessage("create_room")
  public async createRoom(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket
  ) {
    const newRoomId = generateUniqueRoomId(6, io);

    await socket.join(newRoomId);
    console.log("New User joining room: ", { roomId: newRoomId });
    socket.emit("room_joined", { roomId: newRoomId });
  }

  @OnMessage("join_room")
  public async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log("New User joining room: ", message);

    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    if (
      socketRooms.length > 0 ||
      (connectedSockets && connectedSockets.size === 2)
    ) {
      socket.emit("room_join_error", {
        error: "Room is full please choose another room to play!",
      });
    } else {
      await socket.join(message.roomId);
      socket.emit("room_joined", { roomId: message.roomId });

      if (io.sockets.adapter.rooms.get(message.roomId).size === 2) {
        socket.emit("start_game", { start: false, symbol: "o" });
        socket
          .to(message.roomId)
          .emit("start_game", { start: true, symbol: "x" });
      }
    }
  }

  @OnMessage("join_random_room")
  public async joinRandomRoom(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket
  ) {
    const rooms = io.sockets.adapter.sids;
    const roomsArray = Array.from(rooms);
    const availableRooms = roomsArray.filter(
      (room) => room[1].size < 2 && room[0] !== socket.id
    );
    if (availableRooms.length > 0) {
      const randomRoom =
        availableRooms[Math.floor(Math.random() * availableRooms.length)];
      await socket.join(randomRoom[0]);
      socket.emit("room_joined", { roomId: randomRoom[0] });
      if (io.sockets.adapter.rooms.get(randomRoom[0]).size === 2) {
        socket.emit("start_game", { start: false, symbol: "o" });
        socket
          .to(randomRoom[0])
          .emit("start_game", { start: true, symbol: "x" });
      }
      console.log("New User joining room: ", { roomId: randomRoom[0] });
    } else {
      const newRoomId = generateUniqueRoomId(6, io);
      await socket.join(newRoomId);
      console.log("New User joining room: ", { roomId: newRoomId });
      socket.emit("room_joined", { roomId: newRoomId });
    }
  }
}
