const httpResponse = (request) => {
  //Extract the url
  const url = request.split(" ")[1];

  if (url === "/") {
    return "HTTP/1.1 200 OK\r\n\r\n";
  } else if (url.includes("/echo/")) {
    const statusLine = "HTTP/1.1 200 OK";
    const body = httpBody(url);
    const header = httpHeader(body);
    return `${statusLine}\r\n${header}\r\n${body}`;
  } else {
    return "HTTP/1.1 404 Not Found\r\n\r\n";
  }
};

const httpHeader = (body) => {
  return `Content-Type: text/plain\r\nContent-Length: ${body.length}\r\n`;
};

const httpBody = (url) => {
  const body = url.split("/echo/")[1];
  return body;
};

module.exports = { httpResponse };
