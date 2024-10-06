const express = require('express')
const server = require('http').createServer()
const app = express()

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: __dirname })
})

server.on('request', app)
server.listen(3000, function() {
    console.log('Express server listening on port 3000')
})

// Begin Websocker server
const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ server: server })

// Handle incoming WebSocket connections event
wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size
    const message = `Current visitors: ${numClients}`
    console.log({message})
    wss.broadcast(message) // Broadcast to all clients in wss
    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to the websocker server!')
    }
    ws.on('close', function close() {
        wss.broadcast(message) // Broadcast to all clients in wss
        console.log('A client disconnected')
    })
})

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data)
    })
}