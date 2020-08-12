const WebSocket = require('ws');
const { isReady, setLevel } = require('./play');
const port = process.argv[2] ? process.argv[2] : 12123

const wss = new WebSocket.Server({
  port,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

console.info(`staring websocket server on port ${port}...`)
wss.on('connection', function connection(ws) {
    ws.send(JSON.stringify({ info: "nobra" }));
    ws.on('message', function incoming(message) {
      console.debug('received: %s', message);
      const m = JSON.parse(message)
      const { command, data } = m
      switch(command) {
          case 1:
              ws.send(JSON.stringify({ command: 1, status: isReady() }))
              break;
          case 2:
            if (!isReady()) {
                ws.send(JSON.stringify({ status: false, message: "Not ready" }))
            } else if (data) {
                setLevel(data)
            } else {
               ws.send(JSON.stringify({ status: false, message: "Not recognized" }))
            }
      }
    });
});