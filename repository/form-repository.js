const { sequelize } = require("../models");
const db = require("../models");
const joi = require("joi");
const nodemailer = require("nodemailer");
const form = {};

form.mailer = async (html, to) => {
  try {
    let mail = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "manoj.bajiya.2023@gmail.com",
        pass: "iylmlwplnjjbuifw",
      },
    });
    let send = await mail.sendMail({
      from: "manoj.bajiya.2023@gmail.com",
      to: to,
      subject: "Hello",
      text: "Hello",
      html: html,
    });
    console.log(send);
  } catch (err) {
    console.log(err);
  }
};

function stringvalidation(select, combo, add, emails) {
  try {
    const JoiSchema = joi
      .string()
      .regex(/^[a-zA-Z0-9\s,'-\/"]*$/)
      .required();
    const email = joi
      .string()
      .regex(/\S+@\S+\.\S+/)
      .required();
    let joischema;
    if (typeof add == "string") {
      joischema = joi.string().required();
    } else {
      joischema = joi.array().items(joi.string());
    }
    const schema = JoiSchema.validate(select, combo);
    const Schema = joischema.validate(add);
    const mail = email.validate(emails);
    return { schema, Schema, mail };
  } catch (err) {
    return err;
  }
}

form.insert = async (body) => {
  const t = await sequelize.transaction();
  try {
    let data, datas, add, select, combo, email;
    if (typeof body.select == "string") {
      add = body.add[0];
      select = body.select;
      combo = body.combo;
      email = body.email;
      const { schema, Schema, mail } = stringvalidation(
        select,
        combo,
        add,
        email
      );
      if (schema.error || Schema.error || mail.error) {
        return { schema, Schema, mail };
      } else {
        datas = [];
        if (typeof body.add[0] != "string") {
          for (let j = 0; j < body.add[0].length; j++) {
            option = { option_name: `${body.add[0][j]}` };
            datas.push(option);
          }
        } else {
          option = { option_name: `${body.add[0]}` };
          datas.push(option);
        }
        data = await db.select_master.create(
          {
            select_name: body.select,
            type: body.combo,
            email: body.email,
            option_masters: datas,
          },
          { include: [{ model: db.option_master }] },
          { transaction: t }
        );
        await t.commit();
        return { data };
      }
    } else {
      for (let i = 0; i < body.select.length; i++) {
        add = body.add[i];
        select = body.select[i];
        combo = body.combo[i];
        email = body.email;
        var { schema, Schema, mail } = stringvalidation(
          select,
          combo,
          add,
          email
        );
        if (schema.error || Schema.error || mail.error) {
          return { schema, Schema, mail };
        }
      }
      if (schema.error || Schema.error || mail.error) {
        return schema;
      } else {
        for (let i = 0; i < body.select.length; i++) {
          datas = [];
          let option;
          if (typeof body.add[i] != "string") {
            for (let j = 0; j < body.add[i].length; j++) {
              option = { option_name: `${body.add[i][j]}` };
              datas.push(option);
            }
          } else {
            option = { option_name: `${body.add[i]}` };
            datas.push(option);
          }
          data = await db.select_master.create(
            {
              select_name: body.select[i],
              type: body.combo[i],
              email: body.email,
              option_masters: datas,
            },
            { include: [{ model: db.option_master }] },
            { transaction: t }
          );
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

form.showall = async (mail) => {
  try {
    const data = await db.select_master.findAll({
      attributes: ["id", "select_name", "type"],
      where: { email: mail },
      include: [
        {
          model: db.option_master,
          attributes: ["option_name"],
        },
      ],
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
    return html;
  } catch (err) {
    return err;
  }
};

form.email = async (mail) => {
  try {
    const data = await db.select_master.findOne({
      where: { email: mail },
    });
    return data;
  } catch (err) {
    return err;
  }
};

module.exports = { form };
