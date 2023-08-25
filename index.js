const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const bodyParser = require('body-parser');

const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // или конкретный домен
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // добавьте методы, которые используются в вашем приложении
  next();
});


app.use(cors());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());
app.use("/auth", authRouter);
app.use("/", userRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION);
    // const server = https.createServer(options, app);
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};
start();

const clients = new Map();

app.ws('/', (ws, req) => {
  ws.on('message', msg => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      case "connection":
        connectionHandler(ws, msg);
        break;
      default:
        broadcastConnection(ws, msg);
        break;
    }
  });
  ws.on('close', () => {
    userDisconnected(ws);
  });
});
const userDisconnected = ws => {
  console.log(`User ${ws.id} disconnected`);
};
const connectionHandler = (ws, msg) => {
  ws.id = msg.id
  if (clients.has(ws.id)) {
    const client = clients.get(ws.id)
    if(msg.username){
      client.add(msg.username)
    }
    clients.set(ws.id, client);
  }
  else {
    const users = new Set()
    if(msg.username){
      users.add(msg.username)
    }
    clients.set(ws.id, users)
  }
  
  console.log(clients)
  
  broadcastConnection(ws, msg);
};
const broadcastConnection = (ws, msg) => {
  const localClient = clients.get(msg.id)
  
  aWss.clients.forEach(client => {
    if (client.id === msg.id) {
      msg.count = localClient.size;
      client.send(JSON.stringify(msg));
    }
  });
};
