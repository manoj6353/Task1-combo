const { form } = require("../repository/form-repository");
const db = require("../models");

const formcreate = async (req, res) => {
  try {
    res.render("form");
  } catch (err) {
    res.json(err);
  }
};

const save = async (req, res) => {
  try {
    const { body } = req;
    console.log(body);
    // const data = await form.insert(body);
    // res.send(data);
  } catch (err) {
    res.json(err);
  }
};

module.exports = { formcreate, save };
