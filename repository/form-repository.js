const { sequelize } = require("../models");
const db = require("../models");
const joi = require("joi");
const form = {};

function stringvalidation(select, combo, add) {
  try {
    const JoiSchema = joi
      .string()
      .regex(/^[a-zA-Z0-9\s,'-\/"]*$/)
      .required();
    const joischema = joi.array().items(joi.string());
    const schema = JoiSchema.validate(select, combo);
    const Schema = joischema.validate(add);
    return { schema, Schema };
  } catch (err) {
    return err;
  }
}

form.insert = async (body) => {
  const t = await sequelize.transaction();
  try {
    let data, datas, add, select, combo;
    if (typeof body.select == "string") {
      add = body.add[0];
      select = body.select;
      combo = body.combo;
      const { schema, Schema } = stringvalidation(select, combo, add);
      if (schema.error && Schema.error) {
        return schema;
      } else {
        data = await db.select_master.create(
          {
            select_name: body.select,
            type: body.combo,
          },
          { transaction: t }
        );
        datas = [];
        for (let j = 0; j < body.add[0].length; j++) {
          const insert = {
            option_name: body.add[0][j],
            select_id: data.id,
          };
          datas.push(insert);
        }
        await db.option_master.bulkCreate(datas, { transaction: t });

        await t.commit();
        return { data, datas };
      }
    } else {
      for (let i = 0; i < body.select.length; i++) {
        add = body.add[i];
        select = body.select[i];
        combo = body.combo[i];
        var { schema, Schema } = stringvalidation(select, combo, add);
        if (schema.error && Schema.error) {
          return schema;
        }
      }
      if (schema.error && Schema.error) {
        return schema;
      } else {
        for (let i = 0; i < body.select.length; i++) {
          data = await db.select_master.create(
            {
              select_name: body.select[i],
              type: body.combo[i],
            },
            { transaction: t }
          );
          datas = [];
          if (typeof body.add[i] != "string") {
            for (let j = 0; j < body.add[i].length; j++) {
              const insert = {
                option_name: body.add[i][j],
                select_id: data.id,
              };
              datas.push(insert);
            }
            await db.option_master.bulkCreate(datas, { transaction: t });
          } else if (typeof body.add[i] == "string") {
            // for (let j = 0; j < body.add[i].length; j++) {
            await db.option_master.create(
              {
                option_name: body.add[i],
                select_id: data.id,
              },
              { transaction: t }
            );
          }
        }
        await t.commit();
        return { data };
      }
    }
  } catch (err) {
    await t.rollback();
    return err;
  }
};

form.showall = async () => {
  try {
    const data = await db.select_master.findAll({
      include: [{ model: db.option_master }],
    });
    let html = "";
    for (let i = 0; i < data.length; i++) {
      if (data[i].type == "radio" || data[i].type == "checkbox") {
        html += `<label for="${data[i].select_name}">${data[i].select_name}</label>`;
        for (let j = 0; j < data[i].option_masters.length; j++) {
          html += `<input type="${data[i].type}" name="${data[i].select_name}" value="${data[i].option_masters[j].option_name}"/>`;
          html += `<label for="${data[i].option_masters[j].option_name}">${data[i].option_masters[j].option_name}</label>`;
        }
        html += `<br><br>`;
      }
      if (data[i].type == "dropdown") {
        html += `<select>`;
        html += `<option>select ${data[i].select_name}</option>`;
        for (let j = 0; j < data[i].option_masters.length; j++) {
          html += `<option id="${data[i].option_masters[j].id}" value="${data[i].option_masters[j].option_name}">${data[i].option_masters[j].option_name}</option>`;
        }
        html += `</select><br><br>`;
      }
    }
    // console.log(html);
    return html;
  } catch (err) {
    return err;
  }
};

module.exports = { form };
