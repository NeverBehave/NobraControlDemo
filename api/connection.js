const btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
const DEVICE_NAME = 'Nobra Control'

const searchChannel = async (address) => {
    return new Promise((resolve, reject) => {
        btSerial.findSerialPortChannel(address, (channel) => resolve(channel), () => reject())
    })
}

const connect = async (address, channel) => {
    return new Promise((resolve, reject) => {
        btSerial.connect(address, channel, () => resolve(), () => reject())
    })
}

const verification = async () => {
    return new Promise((resolve, reject) => {
        let str = '', times = 0
        btSerial.on('data', (buffer) => {
            str += buffer.toString('utf-8');
        });
        
        const task = setInterval(() => {
            console.log("[Verification] Ping...")
            btSerial.write(Buffer.from('A', 'utf-8'), function(err, bytesWritten) {
                if (err) console.log(err);
            });
            if (str.indexOf('NoBra') === -1) {
                if (times > 30) {
                    console.error("[Verification] Failed to receive string in given time frame")
                    reject()
                }
                console.info(`[Verification] Still waiting for verification, received: ${str}`)
                times++
            } else {
                clearInterval(task)
                console.info(`[Connected] verified! Hi, ${str}`)
                resolve()
            }
        }, 1000); 
    })
}

const start = async () => {
    return new Promise((resolve, reject) => {
        console.info("[Starting] try searching device...")
        btSerial.on('found', async (address, name) => {
            console.info(`[Searching] Device Found: ${name}(${address})`)
            if (name.indexOf(DEVICE_NAME) !== -1) {
                console.info(`[Searching] Hey, it looks like we got you:  ${name}(${address}), try finding channel`)
                const channel = await searchChannel(address).catch(() => {
                    reject(new Error('[Connecting] found nothing'))
                })
                await connect(address, channel).catch(() => {
                    reject(new Error('[Disconnected] cannot connect'))
                })
                console.info('[Not-Verified] Connected, try verifing device: is it a nobra control?');
                await verification().then(() => {
                    resolve(btSerial)
                }).catch(() => {
                    reject(new Error('Verification Failed'))
                })
            }
        })
        btSerial.inquire();
    })
}

const exitHandler = () => {
    console.info("[Clean up] Clean up bluetooth connection")
    btSerial.close()
}

process.on('exit', exitHandler);

//catches ctrl+c event
process.on('SIGINT', exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

module.exports = start