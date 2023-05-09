const { sequelize } = require("../models");
const db = require("../models");
const { Op } = require("sequelize");
const form = {};

form.insert = async (body) => {
  const t = await sequelize.transaction();
  try {
    const data = await db.select_master.create(
      {
        select_name: body.select,
        type: body.combo,
      },
      { transaction: t }
    );
    let datas = [];
    for (let i = 0; i < body.option.length; i++) {
      const insert = {
        option_name: body.option[i],
        select_id: data.id,
      };
      datas.push(insert);
    }
    await db.option_master.bulkCreate(datas, { transaction: t });
    await t.commit();
    return { data, datas };
  } catch (err) {
    await t.rollback();
    return err;
  }
};

module.exports = { form };
