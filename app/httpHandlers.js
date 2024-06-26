const fs = require("fs");
const zlib = require("zlib");
const net = require("net");

const httpResponse = (request, socket) => {
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
    socket.write(`${OK_MESSAGE}\r\n\r\n`);
    return;
  } else if (url.includes("/echo/")) {
    const body = echoMessage(url);
    const header = httpHeader(body, "text/plain");

    if (headers[2].includes("Accept-Encoding")) {
      const encoding = acceptEncoding(headers[2].split(":").join());
      if (encoding.exists) {
        //
        //
        //

        const { gzipBody, gzipBodyLength } = encodeGzip(body);
        const responseHeader = httpHeader(gzipBodyLength, "text/plain", false);

        socket.write(
          `${OK_MESSAGE}\r\n${encoding.header}\r\n${responseHeader}\r\n\r\n`
        );
        socket.write(gzipBody);
        return;
      }
    }

    socket.write(`${OK_MESSAGE}\r\n${header}\r\n\r\n`);
    socket.write(body);
    return;
  } else if (url.includes("/files/") && reqMethod === "GET") {
    const filename = url.split("/files/")[1];
    if (fs.existsSync(`${directory}/${filename}`)) {
      const content = fs.readFileSync(`${directory}/${filename}`).toString();
      const header = httpHeader(content, "application/octet-stream");
      socket.write(`${OK_MESSAGE}\r\n${header}\r\n\r\n${content}\r\n`);
      return;
    } else {
      socket.write(`${NOT_FOUND}\r\n\r\n`);
      return;
    }
  } else if (url.includes("/files/") && reqMethod === "POST") {
    const filename = url.split("/files/")[1];
    const header = httpHeader(body, "text/plain");
    fs.writeFileSync(`${directory}${filename}`, body);
    socket.write(`${POST_MESSAGE}\r\n${header}\r\n\r\n${body}\r\n`);
    return;
  } else if (url === "/user-agent") {
    const body = retrieveUserAgent(headers);
    const header = httpHeader(body, "text/plain");

    socket.write(`${OK_MESSAGE}\r\n${header}\r\n\r\n${body}`);
    return;
  } else {
    socket.write(`${NOT_FOUND}\r\n\r\n`);
    return;
  }
};

const httpHeader = (body, type, countLength = true) => {
  return countLength
    ? `Content-Type: ${type}\r\nContent-Length: ${body.length}`
    : `Content-Type: ${type}\r\nContent-Length: ${body}`;
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

const acceptEncoding = (encodingHeader) => {
  const values = encodingHeader.split(", ");
  return values.includes("gzip")
    ? { header: "Content-Encoding: gzip", exists: true }
    : { header: "", exists: false };
};

const encodeGzip = (text) => {
  const bodyBuffer = Buffer.from(text, "binary");
  const gzipBody = zlib.gzipSync(bodyBuffer);
  const gzipBodyLength = gzipBody.length;

  return { gzipBody, gzipBodyLength };
};

module.exports = { httpResponse };
