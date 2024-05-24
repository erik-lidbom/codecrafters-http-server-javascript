const { httpResponse } = require("./httpHandlers.js");
const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const response = httpResponse(data.toString());
    socket.write(response);
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
