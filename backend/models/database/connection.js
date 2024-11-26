import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env["MYSQL_HOST"],
  username: process.env["MYSQL_USER"],
  password: process.env["MYSQL_PASSWORD"],
  database: process.env["MYSQL_DATABASE"],
  dialectOptions: {
    charset: "utf8mb4",
  },
});

export default sequelize;
