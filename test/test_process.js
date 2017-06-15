const trap = require('../index')

trap.onExit(() => {process.send('exit')})

setTimeout(() => {process.send('normal exit')},1000);