const start = require("./connection")
let btSerial, ready = false
start().then(res => {
    btSerial = res
    ready = true
})
const levels = ['p', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o']

const setLevel = async (level) => {
    return new Promise((resolve, reject) => {
        const p = typeof level === 'number' ? level : parseInt(level)
        const l = Number.isInteger(p) ? p : null 
        if (-1 < l && l < 16) {
            btSerial.write(Buffer.from(levels[l], 'utf-8'), (err, bytesWritten) => {
                if (err) {
                    reject(new Error(`[Send Failed] Command ${level} not sent. ${err}`));
                } else {
                    console.info(`[Sent]: level ${level}(${bytesWritten} bytes sent)`)
                    resolve()
                }
            });
        } else {
            reject(new Error(`[Level] ${level} not recognized, should between 0-15`))
        }
    })
}

const pause = async () => setLevel(0)

const isReady = () => ready

module.exports = {
    setLevel,
    pause,
    isReady
}