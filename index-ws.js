const express = require('express')
const { get } = require('http')
const server = require('http').createServer()
const app = express()

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: __dirname })
})

server.on('request', app)
server.listen(3000, function() {
    console.log('Express server listening on port 3000')
})

process.on('SIGINT', function() {
    wss.clients.forEach(function each(client) { // close all websocket connections
        client.send('Server is shutting down.')
        client.close()
        
    })
   server.close(function(){
    shutdownDB() // close the database
   }) 
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
// store visitors count in database
    db.run(`INSERT INTO visitors (count, time)
        VALUES (${numClients}, datetime('now'))`)

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
// End Websocker server
// Begin Database server
const sqlite = require('sqlite3')
const db = new sqlite.Database(':memory:') // we can save to a file instead of memory

db.serialize(function() { // check db exists before writting to it
    db.run(`CREATE TABLE visitors (
        count INTEGER,
        time TEXT
    )`)
})

function getCounts(){
    db.each(`SELECT * FROM visitors`, function(err, row) {
        console.log(row)
    })
}

function shutdownDB(){
    getCounts()
    console.log('Closing database')
    db.close()
}