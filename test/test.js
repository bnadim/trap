const { test } = require('ava');
const childProcess = require('child_process');

test.cb('I can execute a function when i kill process with SIGINT signal', t => {
    const child = childProcess.fork(`${__dirname}/test_process.js`);
    child.on('message', message => {
        t.deepEqual(message, 'exit')
        t.end()
    })
    setTimeout(() => {child.kill('SIGINT')},1000);
});

test.cb('I can execute a function when i kill process with SIGTERM signal', t => {
    const child = childProcess.fork(`${__dirname}/test_process.js`);
    child.on('message', message => {
        t.deepEqual(message, 'exit')
        t.end()
    })

    setTimeout(() => {child.kill('SIGTERM')},500);
});

test.cb('I can not execute a function when i kill process without SIGTERM or SIGINT signal', t => {
    const child = childProcess.fork(`${__dirname}/test_process.js`);
    child.on('message', message => {
        t.fail()
        t.end()
    })
    child.on('exit', message => {
        t.pass()
        t.end()
    })
    setTimeout(() => {child.kill('SIGALRM')},500);
});

test.cb('I can kill the process before with a max delay', t => {
    let timeout = true
    const env = { EXIT_DELAY: 2000 }
    const child = childProcess.fork(`${__dirname}/test_delay.js`, { env: env });
    child.on('exit', message => {
        t.pass()
        t.end()
        timeout = false
    })
    setTimeout(() => {child.kill('SIGTERM')},500);
    setTimeout(() => {
        if(timeout)
        {
            t.fail()
            t.end()
        }}, 2550);
});