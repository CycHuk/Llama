import sequelize from "./connection.js";

async function syncDatabase() {
  try {
    await sequelize.sync();
    console.log("Database synchronized!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
}

export default syncDatabase;
