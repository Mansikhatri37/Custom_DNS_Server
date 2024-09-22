const dgram = require('node:dgram');
const dnsPacket = require('dns-packet');
const { type } = require('node:os');
const server = dgram.createSocket('udp4')

const db = {
    'piyushgarg.dev':{
        type:'A',
        data:'1.2.3.4'
    },
    'blog.piyushgarg.dev':{
        type:'CNAME',
        data:'hashnode.network'
    }
}

server.on('message', (msg, rinfo) => {
    const incomingReq = dnsPacket.decode(msg);
    const ipFromDb = db[incomingReq.questions[0].name];

    const ans = dnsPacket.encode({
        id:incomingReq.id,
        type:"response",
        flags:dnsPacket.AUTHORITATIVE_ANSWER,
        questions:incomingReq.questions,
        answers:[
            {
                type: ipFromDb.type,
                name: incomingReq.questions[0].name,
                data: ipFromDb.data,
                class:'IN'
            }
        ]
    })
    console.log({
        questions: incomingReq.questions,
        rinfo
    })
})

server.send(ans, rinfo.port, rinfo.address)
server.bind(53, () => console.log('DNS server is running on port 53'))