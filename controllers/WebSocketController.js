const Message = require('../models/Message')

module.exports = class WebSocketController {
  clients = new Map();
  constructor(app) {
    const WSServer = require('express-ws')(app);
    this.aWss = WSServer.getWss();
    app.ws('/', (ws, req) => {
      ws.on('message', msg => {
        msg = JSON.parse(msg);
        switch (msg.method) {
          case "connection":
            this.connectionHandler(ws, msg);
            break;
          case "message":
            this.messageHandler(ws, msg);
            break;
          default:
            this.broadcastConnection(ws, msg);
            break;
        }
      });
      ws.on('close', () => {
        this.userDisconnected(ws);
      });
    });
  }

messageHandler (ws, msg) {
  msg.message = {
    id: `fa${(+new Date()).toString(8)}`,
    username: msg.username,
    text: msg.message,
    date: Date.now(),
    color: msg.color
  };
  if(msg.message && msg.message.username === ws.id.split("//")[1]){
    this.saveMessage(msg.message, ws.id.split("//")[0])
  }
  this.broadcastConnection(ws, msg)
}
async saveMessage(msg, canvas_id) {
    try {
      const message = new Message({
        username: msg.username,
        date: msg.date,
        text: msg.text,
        canvas_id: canvas_id})
      return await message.save();
    }catch (e) {
      console.log(e)
    }
  
}
userDisconnected (ws) {
  console.log(`User ${ws.id} disconnected`);
  if(ws.id) {
    const [id, username] = ws.id.split("//")
    this.clients.get(id).delete(username);
    this.broadcastConnection(ws, {
      id: id,
      method: "disconnect",
      username: username
    })
  }
  
};
connectionHandler(ws, msg){
  ws.id = msg.id.toString().concat("//").concat(msg.username)
  if (this.clients.has(msg.id)) {
    const client = this.clients.get(msg.id)
    if(msg.username){
      client.add(msg.username)
    }
    this.clients.set(msg.id, client);
  }
  else {
    const users = new Set()
    if(msg.username){
      users.add(msg.username)
    }
    this.clients.set(msg.id, users)
  }
  msg.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  
  this.broadcastConnection(ws, msg);
};
broadcastConnection (ws, msg) {
  const localClient = this.clients.get(msg.id)
  const clientsAlreadySend = new Set()
  this.aWss.clients.forEach(client => {
    
    if (client.id && client.id.split("//")[0] === msg.id) {
      msg.count = localClient.size;
      msg.users = Array.from(localClient);
      if(!clientsAlreadySend.has(client.id)){
        client.send(JSON.stringify(msg));
      }
      clientsAlreadySend.add(client.id)
    }
  });
};

}