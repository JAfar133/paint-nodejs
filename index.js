const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const messageRouter = require('./routers/messageRouter');
const bodyParser = require('body-parser');

const cors = require('cors');
const dotenv = require('dotenv');
const WebSocketController = require("./controllers/WebSocketController");
dotenv.config();

const app = express();

const PORT = 8000;

app.use(cors());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());
app.use("/auth", authRouter);
app.use("/message", messageRouter);
app.use("/", userRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION);
    // const server = https.createServer(options, app);
    app.listen(PORT, () => {
        console.log(`server started on port ${PORT}`)
        console.log(`GALLERY_PATH ${process.env.GALLERY_PATH}`)
        console.log(`IMAGES_PATH ${process.env.IMAGES_PATH}`)
    });
  } catch (e) {
    console.log(e);
  }
};
start();

const websocket = new WebSocketController(app)