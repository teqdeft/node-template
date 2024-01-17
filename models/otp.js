import { Model, Sequelize } from "../config/db_config.js";

const OTP = Model.define("otp_log", {
  user_id: {
    type: Sequelize.INTEGER,
  },
  type: {
    type: Sequelize.STRING,
  },
  otp:{
    type: Sequelize.BIGINT,
  },
  expire_at:{
    type: Sequelize.BIGINT,
  }
});
OTP.sync({ alter: true });

export default OTP;
