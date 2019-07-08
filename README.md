Chatty Server
=====================

Chatty server is a simple WebSocket server built using Node.js and Express middleware. This server enables real-time communication between clients in [Chatty App](https://github.com/nikijiandani/chatty-app).

### Usage

Clone the git repo.

```
git clone git@github.com:nikijiandani/chatty-server.git
cd chatty-server
```

Install the dependencies and start the server.

```
npm install
npm start
```
*Note: This WebSocket server will run in parallel (on port 3001) along with the webpack dev server that runs [Chatty App](https://github.com/nikijiandani/chatty-app) (on port 3000).*
