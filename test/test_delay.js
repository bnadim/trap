const trap = require('../index')

function wait(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        },5000);
    })
}
trap.setExitDelay(parseInt(process.env.EXIT_DELAY))

trap.onExit(async () => {await wait()})

setTimeout(() => {process.send('normal exit')},6000);