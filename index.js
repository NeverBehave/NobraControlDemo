const btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
const levels = ['p', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o']
const readline = require('readline');
const DEVICE_NAME = 'Nobra Control'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const startLoop = () => {
    console.info('[Type and Press Enter] What level would you like (0-15, e for exit)?');
    rl.on('line', function (level) {
        const l = parseInt(level)
        if (-1 < l && l < 16) {
            btSerial.write(Buffer.from(levels[l], 'utf-8'), (err, bytesWritten) => {
                if (err) console.warn(`[Send Failed] Command ${bytesWritten} not sent. ${err}`);
                else console.info(`[Sent]: level ${level}(${bytesWritten})`)
            });
        } else if (level === 'e') {
            shouldBreak = true
            btSerial.close()
            console.info("[Exit] goodbye")
            process.exit(0)
        } else {
            console.warn("[Type] Command not regognized")
        }
    });
}

btSerial.on('found', (address, name) => {
    console.info(`[Searching] Device Found: ${name}(${address})`)
    if (name.indexOf(DEVICE_NAME) !== -1) {
        console.info(`[Searching] Hey, it looks like we got you:  ${name}(${address}), try finding channel`)
        btSerial.findSerialPortChannel(address, (channel) => {
            btSerial.connect(address, channel, () => {
                console.info('[Not-Verified] Connected, try verifing device: is it a nobra control?');

                let str = ''
                btSerial.on('data', (buffer) => {
                    str += buffer.toString('utf-8');
                });
                
                const task = setInterval(() => {
                    console.log("[Verification] Ping...")
                    btSerial.write(Buffer.from('A', 'utf-8'), function(err, bytesWritten) {
                        if (err) console.log(err);
                    });
                    if (str.indexOf('NoBra') === -1) {
                        console.info(`[Verification] Still waiting for verification, received: ${str}`)
                    } else {
                        clearInterval(task)
                        console.info(`[Connected] verified! Hi, ${str}`)
                        startLoop()
                    }
                }, 1000); 
                
            }, function () {
                console.error('[Disconnected] cannot connect');
            });
        }, function() {
            console.error('[Connecting] found nothing');
        });
    }
});

console.info("[Starting] try searching device...")

btSerial.inquireSync();