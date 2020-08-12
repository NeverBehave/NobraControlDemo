const readline = require('readline');
const { setLevel, pause, isReady } = require('./play')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

console.info('[Type and Press Enter] What level would you like (0-15, e for exit)?');
rl.on('line', function (level) {
    if (!isReady()) {
        console.warn("Not ready")
        return
    }
    setLevel(level)
});