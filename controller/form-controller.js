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
    const data = await form.insert(body);
    if (data.error) {
      res.json(data.error.details);
    } else {
      res.redirect("/show");
    }
  } catch (err) {
    res.json(err);
  }
};

const show = async (req, res) => {
  try {
    const data = await form.showall();
    res.render("show", { data });
  } catch (err) {
    res.json(err);
  }
};

module.exports = { formcreate, save, show };
