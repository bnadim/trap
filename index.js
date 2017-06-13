'use strict'

const _ = require('lodash')
const config = require('./config')
const log = require('@ekino/logger')('processHandler')

const internals = {}

internals.exitEvents = ['SIGINT', 'SIGTERM']

/**
 * @typedef {function} onExitHandler
 * @returns {Promise}
 */

/**
 *
 * @param {onExitHandler} fn
 */
exports.onExit = function(fn) {
    _.forEach(internals.exitEvents, exitEvent => {
        process.on(exitEvent, function listenerFn() {
            Promise.resolve()
                .then(() => fn())
                .then(() => {
                    process.removeListener(exitEvent, listenerFn)
                })
                .catch(error => {
                    log.warn('An error occured on process shutdown', { error })
                })
        })
    })
}

/** *******************************************************************/

// Setup kill process
_.forEach(internals.exitEvents, exitEvent => {
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
        }, config.get('maxExitDelay') || 5000)
    })
})
