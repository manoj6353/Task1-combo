const express = require("express");
const path = require("path");
let bodyParser = require("body-parser");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "./public")));
// app.set("views", path.join(__dirname, "/views"));
const port = 8000;

const router = require("./routes/route");
app.use("/", router);

const form = require("./routes/form");
app.use("/", form);

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
