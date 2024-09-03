import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite", // Location of the SQLite database
  logging: false, // Disable logging for cleaner console output
});

sequelize.sync({ alter: true }).then(() => {
  console.log("Database & tables created!");
});

export default sequelize;
