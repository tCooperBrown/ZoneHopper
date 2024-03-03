const express = require("express");
const setRouting = require("./router/index");
const cors = require("cors");
const bodyParser = require("body-parser");

const corsConfig = {};

const app = express();
app.use(cors(corsConfig)).use(express.json()).use(bodyParser.json()); // No cookieParser yet

setRouting(app);
const port = 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
