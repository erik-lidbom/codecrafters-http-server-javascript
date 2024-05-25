const fs = require("fs");

const httpResponse = (request) => {
  //Request
  const statusLine = request.split(" ");
  const headers = request.split("\r\n");

  const reqMethod = statusLine[0];
  const url = statusLine[1];
  const body = headers[headers.length - 1];
  const directory = process.argv[3];

  //Messages
  const OK_MESSAGE = "HTTP/1.1 200 OK";
  const POST_MESSAGE = "HTTP/1.1 201 Created";
  const NOT_FOUND = "HTTP/1.1 404 Not Found";

  if (url === "/") {
    return `${OK_MESSAGE}\r\n\r\n`;
  } else if (url.includes("/echo/")) {
    const body = echoMessage(url);
    const header = httpHeader(body, "text/plain");
    return `${OK_MESSAGE}\r\n${header}\r\n\r\n${body}`;
  } else if (url.includes("/files/") && reqMethod === "GET") {
    const filename = url.split("/files/")[1];

    if (fs.existsSync(`${directory}/${filename}`)) {
      const content = fs.readFileSync(`${directory}/${filename}`).toString();
      const header = httpHeader(content, "application/octet-stream");

      return `${OK_MESSAGE}\r\n${header}\r\n\r\n${content}\r\n`;
    } else {
      return `${NOT_FOUND}\r\n\r\n`;
    }
  } else if (url.includes("/files/") && reqMethod === "POST") {
    const filename = url.split("/files/")[1];
    const header = httpHeader(body, "text/plain");

    fs.writeFileSync(`${directory}${filename}`, body);
    return `${POST_MESSAGE}\r\n${header}\r\n\r\n${body}\r\n`;
  } else if (url === "/user-agent") {
    const body = retrieveUserAgent(headers);
    const header = httpHeader(body, "text/plain");

    return `${OK_MESSAGE}\r\n${header}\r\n\r\n${body}`;
  } else {
    return `${NOT_FOUND}\r\n\r\n`;
  }
};

const httpHeader = (body, type) => {
  return `Content-Type: ${type}\r\nContent-Length: ${body.length}`;
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
