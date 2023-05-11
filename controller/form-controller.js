const { form } = require("../repository/form-repository");
const db = require("../models");

const formcreate = async (req, res) => {
  try {
    res.render("form");
  } catch (err) {
    res.send(err);
  }
};

const save = async (req, res) => {
  try {
    const { body } = req;
    const { schema, Schema, email } = await form.insert(body);
    if (Schema || schema || email) {
      let schemaerror = schema.error.details[0].message;
      let Schemaerror = schema.error.details[0].message;
      let mail = email.error.details[0].message;
      res.send({ schemaerror, Schemaerror, mail });
    } else {
      res.redirect("/show");
    }
  } catch (err) {
    res.send(err);
  }
};

const show = async (req, res) => {
  try {
    const email = req.query.email || "manoj2000bajiya@gmail.com";
    const data = await form.showall(email);
    const mail = await form.mailer(data, email);
    res.render("show", { data });
  } catch (err) {
    res.send(err);
  }
};

const email = async (req, res) => {
  try {
    let mail = req.query.mail;
    const email = await form.email(mail);
    if (email != null) {
      let message = "Email is already Exists";
      res.json(message);
    } else {
      let message = "";
      res.json(message);
    }
  } catch (err) {
    res.send(err);
  }
};

module.exports = { formcreate, save, show, email };
