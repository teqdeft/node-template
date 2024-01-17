import { Model, Sequelize } from "../config/db_config.js";

const User = Model.define("users", {
//   id: {
//     type: Sequelize.INTEGER,
//     AutoIncrement: true,
//     primaryKey: true
//   },
  role:{
    type: Sequelize.STRING,
  },
  first_name: {
    type: Sequelize.STRING,
  },
  last_name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  mobile: {
    type: Sequelize.BIGINT,
  },
  user_password: {
    type: Sequelize.STRING,
  },
  confirm_password: {
    type: Sequelize.STRING,
  },
  gender: {
    type: Sequelize.CHAR,
  }
});
User.sync({ alter: true });

export default User;
