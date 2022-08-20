const os = require('os-utils');
var osu = require('node-os-utils')

var app = require('express')();
var dotenv = require('dotenv').config();
var http = require('http').createServer(app);

const PORT = process.env.PORT;

//handle cors as server and client in different domain/port
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
var trim = 1;
var trim1 = 1;

io.on('connection', (socket) => {
    /* socket object may be used to send specific messages to the new connected client */
    console.log('new client connected');
    setInterval(() => {
        os.cpuUsage(cpuPercent => {
            socket.emit('cpu', {
                name: trim++,
                value: cpuPercent
            });
        })
    }, 1000)

    setInterval(() => {
        os.cpuFree(cpuFree => {
            socket.emit("freeCpu", {
                name: trim1++,
                value: cpuFree
            })
        })
    }, 1000)

    setInterval(() => {
        socket.emit("os-details", {
            platform: os.platform(),
            freemem: os.freemem(),
            totalmem: os.totalmem(),
            freememper: os.freememPercentage(),
            usedmem:os.totalmem()-os.freemem(),
            usedmemper:100-os.freememPercentage(),
            sysuptime: os.sysUptime(),
            processuptime: os.processUptime(),
            cpuavg:osu.cpu.average(),
            cpu: osu.cpu.count(),
            ostype:osu.os.type(),
            osplatform:osu.os.platform(),
            osip:osu.os.ip(),
            oshostname:osu.os.hostname(),
            osarch:osu.os.arch(),
        })
    }, 1000)

    setInterval(()=>{
        osu.mem.info()
        .then(info => {
            console.log(info)
            socket.emit("mem-details",{
                totalMemMb: info.totalMemMb,
                usedMemMb: info.usedMemMb,
                freeMemMb:info.freeMemMb,
                usedMemPercentage: info.usedMemPercentage,
                freeMemPercentage: info.freeMemPercentage
            })
        })
    },1000)

    setInterval(()=>{
        osu.mem.info()
        .then(info => {
            console.log(info)
            socket.emit("mem-details",{
                totalMemMb: info.totalMemMb,
                usedMemMb: info.usedMemMb,
                freeMemMb:info.freeMemMb,
                usedMemPercentage: info.usedMemPercentage,
                freeMemPercentage: info.freeMemPercentage
            })
        })
    },20000)
});