const httpUrlHandler = (message) => {
  return message.startsWith("GET / ")
    ? "HTTP/1.1 200 OK\r\n\r\n"
    : "HTTP/1.1 404 Not Found\r\n\r\n";
};

module.exports = { httpUrlHandler };
