const express = require("express");
const route = express.Router();

const form = require("../controller/form-controller");

route.get("/", form.formcreate);

module.exports = route;
