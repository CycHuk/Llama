import { DataTypes } from "sequelize";
import sequelize from "../connection.js";

const chat = sequelize.define(
  "chat",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      collate: "utf8mb4",
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
      collate: "utf8mb4",
    },
    answer: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "chats",
    timestamps: false,
  }
);

export default chat;
