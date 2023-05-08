const { sequelize } = require("../models");
const db = require("../models");
const { Op } = require("sequelize");
const combo = {};

combo.selectinsert = async (name) => {
  const t = await sequelize.transaction();
  try {
    const insert = await db.select_master.create(
      {
        select_name: name,
      },
      { transaction: t }
    );
    await t.commit();
    return name + " id is " + insert.id;
  } catch (err) {
    console.log(err);
    await t.rollback();
  }
};

combo.optioninsert = async (id, name) => {
  const t = await sequelize.transaction();
  try {
    const insert = await db.option_master.create(
      {
        option_name: name,
        select_id: id,
      },
      { transaction: t }
    );
    await t.commit();
    return insert;
  } catch (err) {
    console.log(err);
    await t.rollback();
  }
};

combo.findselect = async (name) => {
  try {
    const display = await db.select_master.findOne({
      attributes: ["id"],
      where: { select_name: name },
    });
    return display;
  } catch (err) {
    console.log(err);
  }
};

combo.generate = async (
  id = 2,
  inputtype = "dropdown",
  name = "course",
  multiple = "no"
) => {
  try {
    if (multiple == "yes" || multiple == "true") {
      multiple = "multiple";
    }
    const display = await db.option_master.findAll({
      attributes: ["option_name", "id"],
      where: { select_id: id },
    });
    let html = "";
    if (inputtype == "dropdown" || inputtype == "combo") {
      html += `<select id="${name}" name="${name}" ${multiple}>`;
      html += `<option>select ${name}</option>`;
      display.forEach((d) => {
        html += `<option id="${d.id}" value="${d.option_name}">${d.option_name}</option>`;
      });
      html += `</select>`;
    }
    if (inputtype == "radio" || inputtype == "checkbox") {
      display.forEach((d) => {
        html += `<input type="${inputtype}" name="${name}" value="${d.option_name}"/>`;
        html += `<label for="${d.option_name}">${d.option_name}</label>`;
      });
    }
    return html;
  } catch (err) {
    return err;
  }
};

combo.selectupdate = async (id, name) => {
  try {
    const update = await db.select_master.update(
      {
        select_name: name,
      },
      { where: { id: id } }
    );
    return update;
  } catch (err) {
    return err;
  }
};

combo.optionupdate = async (id, name) => {
  try {
    const update = await db.option_master.update(
      {
        option_name: name,
      },
      { where: { id: id } }
    );
    return update;
  } catch (err) {
    return err;
  }
};

combo.destroy = async (id) => {
  const t = await sequelize.transaction();
  try {
    await db.select_master.destroy(
      {
        where: { id: id },
      },
      { transaction: t }
    );
    await db.option_master.destroy(
      {
        where: { select_id: id },
      },
      { transaction: t }
    );
    await t.commit();
    return { message: "successfully deleted" };
  } catch (err) {
    await t.rollback();
    return err;
  }
};

combo.restore = async (id) => {
  const t = await sequelize.transaction();
  try {
    await db.select_master.restore(
      {
        where: { id: id },
      },
      { transaction: t }
    );
    await db.option_master.restore(
      {
        where: { select_id: id },
      },
      { transaction: t }
    );
    await t.commit();
    return { message: "successfully restored" };
  } catch (err) {
    await t.rollback();
    return err;
  }
};

combo.selectdelete = async (id) => {
  try {
    await db.select_master.destroy({
      where: { id: id },
    });
    return { message: "successfully deleted" };
  } catch (err) {
    return err;
  }
};

combo.optiondelete = async (id) => {
  try {
    await db.option_master.destroy({
      where: { id: id },
    });
    return { message: "successfully deleted" };
  } catch (err) {
    return err;
  }
};

combo.optionrestore = async (id) => {
  try {
    await db.option_master.restore({
      where: { id: id },
    });
    return { message: "successfully restored" };
  } catch (err) {
    return err;
  }
};

combo.selectrestore = async (id) => {
  try {
    await db.select_master.restore({
      where: { id: id },
    });
    return { message: "successfully restored" };
  } catch (err) {
    return err;
  }
};

module.exports = { combo };
