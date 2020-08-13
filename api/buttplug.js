const ButtplugNodeWebsockets = require('buttplug-node-websockets');
const ButtplugNodeBluetoothClassicManager = require('buttplug-node-bluetooth-classic-manager')
let server = new ButtplugNodeWebsockets.ButtplugNodeWebsocketServer();
server.AddDeviceManager(new ButtplugNodeBluetoothClassicManager.ButtplugNodeBluetoothClassicDeviceManager());
// Insecure hosting, on localhost:12345

const port = process.argv[2] ? process.argv[2] : 12345
console.info(`Starting server at ${port}`)
server.StartInsecureServer(port)