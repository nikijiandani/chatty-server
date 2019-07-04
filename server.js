const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

//Create a boadcast function
SocketServer.prototype.broadcast = function(msg) {
  this.clients.forEach((c) => {
    c.send(JSON.stringify(msg));
  });
};

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (data) => {
    const myMessage = JSON.parse(data)
    console.log(`User ${myMessage.username} said ${myMessage.content}`)
    const messageWithId = {
      id: uuid(),
      username: myMessage.username,
      content: myMessage.content
    }
    wss.broadcast(messageWithId)
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => console.log('Client disconnected'));
});