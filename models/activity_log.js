import { Model, Sequelize } from "../config/db_config.js";

const ActivityLog = Model.define("activity_log", {
  user_id: {
    type: Sequelize.INTEGER,
  },
  data: {
    type: Sequelize.TEXT,
  },
  url:{
    type: Sequelize.STRING,
  },
  message:{
    type: Sequelize.STRING,
  }
});
ActivityLog.sync({ alter: true });
export default ActivityLog;
