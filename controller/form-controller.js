const { form } = require("../repository/form-repository");

const formcreate = async (req, res) => {
  try {
    res.render("form");
  } catch (err) {
    res.json(err);
  }
};

module.exports = { formcreate };
