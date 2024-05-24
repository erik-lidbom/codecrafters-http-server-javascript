const { httpUrlHandler } = require("./httpHandlers.js");
const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const httpResponse = httpUrlHandler(data.toString());
    socket.write(httpResponse);
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
