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
  console.log("Total Number of users connected: ", wss.clients.size)

  const currentUsers = {
    type: "incomingUserCount",
    numberOfUsers: wss.clients.size,
  }
  wss.broadcast(currentUsers)
  
  ws.on('message', (data) => {
    const myMessage = JSON.parse(data)
    if(myMessage.type === 'postMessage'){
      console.log(`User ${myMessage.username} said ${myMessage.content}`)
      const messageWithIdAndDate = {
        id: uuid(),
        createdAt: new Date(),
        type: "incomingMessage",
        username: myMessage.username,
        content: myMessage.content
      }
      console.log("Sent message to client", messageWithIdAndDate)
      wss.broadcast(messageWithIdAndDate)
    } else if(myMessage.type === 'postNotification' || myMessage.type === 'postUserJoined') {
      console.log("Incoming notification from client", myMessage)
      const postMessageWithIdAndDate = {
        id: uuid(),
        createdAt: new Date(),
        type: "incomingNotification",
          content: myMessage.content
        }
        console.log("Sent notification to client", postMessageWithIdAndDate)
        wss.broadcast(postMessageWithIdAndDate)
      } else {
        console.log("I couldn't identify the incoming message")
      }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
    console.log("Total Number of users connected: ", wss.clients.size)
    const currentUsers = {
      type: "incomingUserCount",
      numberOfUsers: wss.clients.size,
    }
    wss.broadcast(currentUsers)
    wss.broadcast({
      type: "incomingNotification",
      content: 'A user has disconnected'
    })
  });
});