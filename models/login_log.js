import { Model, Sequelize } from "../config/db_config.js";

const LoginLog = Model.define("login_logs", {
  user_id: {
    type: Sequelize.INTEGER,
  },
  email: {
    type: Sequelize.STRING,
  },
  token:{
    type: Sequelize.STRING,
  }
});
LoginLog.sync({ alter: true });

export default LoginLog;
