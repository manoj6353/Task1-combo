const { combo } = require("../repository/generate-repository");

const selectcreate = async (req, res) => {
  try {
    const name = req.params.name || req.query.name;
    const insert = await combo.selectinsert(name);
    res.status(200).json({
      status: "success",
      description: insert,
    });
  } catch (err) {
    res.json({ error: err });
  }
};

const optioncreate = async (req, res) => {
  try {
    const name = req.params.name || req.query.name;
    const id = req.params.id || req.query.id;
    const insert = await combo.optioninsert(id, name);
    res.status(200).json({
      status: "success",
      description: insert,
    });
  } catch (err) {
    res.json({ error: err });
  }
};

const generate = async (req, res) => {
  try {
    const type = req.params.type || req.query.type;
    const name = req.params.name || req.query.name || "course";
    const multiple = req.query.multiple || req.query.multiple;
    const { id } = await combo.findselect(name);
    const generates = await combo.generate(id, type, name, multiple);
    res.render("combo-generate", { generates });
  } catch (err) {
    res.json({ error: err });
  }
};

const selectupdate = async (req, res) => {
  try {
    const name = req.params.name || req.query.name;
    const id = req.params.id || req.query.id;
    const update = await combo.selectupdate(id, name);
    res.status(200).json({
      status: "success",
      description: update,
    });
  } catch (err) {
    res.json({ error: err });
  }
};

const optionupdate = async (req, res) => {
  try {
    const name = req.params.name || req.query.name;
    const id = req.params.id || req.query.id;
    const update = await combo.optionupdate(id, name);
    res.status(200).json({
      status: "success",
      description: update,
    });
  } catch (err) {
    res.json({ error: err });
  }
};

const softdelete = async (req, res) => {
  try {
    const id = req.query.id || req.params.id;
    const deletes = await combo.destroy(id);
    res.status(200).json({
      status: "success",
      description: deletes,
    });
  } catch (err) {
    res.json({ error: err });
  }
};

const deleterestore = async (req, res) => {
  try {
    const id = req.query.id || req.params.id;
    const restoredelete = await combo.restore(id);
    res.status(200).json({
      status: "success",
      description: restoredelete,
    });
  } catch (err) {
    res.json(err);
  }
};

const deleteselect = async (req, res) => {
  try {
    const id = req.query.id || req.params.id;
    const deletes = await combo.selectdelete(id);
    res.status(200).json({
      status: "success",
      description: deletes,
    });
  } catch (err) {
    res.json({ error: err });
  }
};

const deleteoption = async (req, res) => {
  try {
    const id = req.query.id || req.params.id;
    const deletes = await combo.optiondelete(id);
    res.status(200).json({
      status: "success",
      description: deletes,
    });
  } catch (err) {
    res.json({ error: err });
  }
};

const selectrestore = async (req, res) => {
  try {
    const id = req.query.id || req.params.id;
    const deletes = await combo.selectrestore(id);
    res.status(200).json({
      status: "success",
      description: deletes,
    });
  } catch (err) {
    res.json({ error: err });
  }
};

const optionrestore = async (req, res) => {
  try {
    const id = req.query.id || req.params.id;
    const deletes = await combo.optionrestore(id);
    // res.json(deletes);
    res.status(200).json({
      status: "success",
      description: deletes,
    });
  } catch (err) {
    res.json({ error: err });
  }
};

module.exports = {
  generate,
  selectcreate,
  optioncreate,
  selectupdate,
  optionupdate,
  softdelete,
  deleterestore,
  deleteselect,
  deleteoption,
  selectrestore,
  optionrestore,
};
