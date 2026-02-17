"use strict";

const { hashPass } = require("../helpers/bcrypt.js");
const fs = require("fs").promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = JSON.parse(await fs.readFile("./data/Users.json", "utf8")).map(
      (el) => {
        delete el.id;
        el.password = hashPass(el.password);
        el.createdAt = el.updatedAt = new Date();
        return el;
      }
    );
    await queryInterface.bulkInsert("Users", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {
      restartIdentity: true,
      truncate: true,
      cascade: true,
    });
  },
};
