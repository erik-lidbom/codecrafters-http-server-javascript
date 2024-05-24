const httpResponse = (request) => {
  const headers = request.split("\r\n");
  const url = request.split(" ")[1];
  const OK_MESSAGE = "HTTP/1.1 200 OK";
  const NOT_FOUND = "HTTP/1.1 404 Not Found";

  if (url === "/") {
    return `${OK_MESSAGE}\r\n\r\n`;
  } else if (url.includes("/echo/")) {
    const body = echoMessage(url);
    const header = httpHeader(body);
    return `${OK_MESSAGE}\r\n${header}\r\n\r\n${body}`;
  } else if (url === "/user-agent") {
    const body = retrieveUserAgent(headers);
    const header = httpHeader(body);

    return `${OK_MESSAGE}\r\n${header}\r\n\r\n${body}`;
  } else {
    return `${NOT_FOUND}\r\n\r\n`;
  }
};

const httpHeader = (body) => {
  return `Content-Type: text/plain\r\nContent-Length: ${body.length}`;
};

const echoMessage = (url) => {
  const body = url.split("/echo/")[1];
  return body;
};

const retrieveUserAgent = (request) => {
  const agentValue = request
    .find((s) => s.startsWith("User-Agent"))
    .split(" ")[1];
  return agentValue;
};

module.exports = { httpResponse };
