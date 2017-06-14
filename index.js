'use strict'


const internals = {}

internals.exitEvents = ['SIGINT', 'SIGTERM']
internals.maxExitDelay = 5000

/**
 * @typedef {function} onExitHandler
 * @returns {Promise}
 */

/**
 *
 * @param {onExitHandler} fn
 */
exports.onExit = function(fn) {
    internals.exitEvents.forEach(exitEvent => {
        process.on(exitEvent, function listenerFn() {
            Promise.resolve()
                .then(() => fn())
                .then(() => {
                    process.removeListener(exitEvent, listenerFn)
                })
                .catch(error => {
                    console.warn('An error occurred on process shutdown', { error })
                })
        })
    })
}

/**
 *
 * @param {number} delay
 */
exports.setExitDelay = function(delay) {
    if(!isNaN(delay) && delay >= 0){
        internals.maxExitDelay = delay
    }
}


/** *******************************************************************/

// Setup kill process
internals.exitEvents.forEach(exitEvent => {
    process.on(exitEvent, () => {
        let listenersCount = process.listeners(exitEvent).length - 1
        if (listenersCount <= 0) process.exit(0)

        process.on('removeListener', eventName => {
            if (eventName === exitEvent) {
                listenersCount -= 1
                if (listenersCount <= 0) process.exit(0)
            }
        })

        setTimeout(() => {
            process.exit(0)
        }, internals.maxExitDelay)
    })
})
