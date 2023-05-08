const express = require("express");
const route = express.Router();

const combo = require("../controller/generate-controller");

route.get("/generate", combo.generate);
route.get("/selectcreate", combo.selectcreate);
route.get("/optioncreate", combo.optioncreate);
route.patch("/selectupdate", combo.selectupdate);
route.patch("/optionupdate", combo.optionupdate);
route.delete("/deleteall", combo.softdelete);
route.delete("/deleteselect", combo.deleteselect);
route.delete("/deleteoption", combo.deleteoption);
route.delete("/restoreall", combo.deleterestore);
route.delete("/restoreselect", combo.selectrestore);
route.delete("/restoreoption", combo.optionrestore);

module.exports = route;
