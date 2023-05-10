const express = require("express");
const route = express.Router();

const form = require("../controller/form-controller");

route.get("/", form.formcreate);
route.post("/save", form.save);
route.get("/show", form.show);

module.exports = route;
