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

const PORT = process.env.PORT || 5045;


// app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://for-you3.ru");
//   res.header("Access-Control-Allow-Credential", "true");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });


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
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};
start();

const websocket = new WebSocketController(app)