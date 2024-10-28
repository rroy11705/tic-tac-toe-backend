import { SocketControllers } from "socket-controllers";
import { Server } from "socket.io";
import Container from "typedi";

export default (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // io.on("connection", (socket) => {

  // });

  // useSocketServer(io, { controllers: [__dirname + "/api/controllers/*.ts"] });
  new SocketControllers({
    io: io,
    container: Container,
    controllers: [__dirname + "/api/controllers/*.ts"],
  });

  return io;
};
