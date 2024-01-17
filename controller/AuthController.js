import User from "../models/user.js";
import Validator from "validatorjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import LoginLog from "../models/login_log.js";
import OTP from "../models/otp.js";
import mailer from "../helper/mailer.js";
import common_helper from "../helper/common_helper.js";
import reply from "../helper/reply.js";

const salt = 10;
const jwt_secret = process.env.JWT_SECRET;

export default {
  // Create and Save a new User
  async register(req, res) {
    let request = req.body;

    let rules = {
      first_name: "required",
      last_name: "required",
      email: "required|email",
      mobile: "required",
      user_password: "required",
      confirm_password: "required|same:user_password",
      gender: "required|in:male,female"
    };

    let validation = new Validator(request, rules);
    console.log(validation.errors);
    if (validation.fails()) {
      var validation_error = reply.firstError(validation)
      return res.send(reply.failed(validation_error));
    }
    let user_exists = await User.findOne({
      where: {
        email: request.email,
      },
    });
    if (user_exists) {
      return res.send(reply.failed("Email Already Exists"));
    }
    //    hash password
    let hashed_password = await bcrypt.hash(request.user_password, salt);
    request.user_password = request.confirm_password = hashed_password;
    request.role = 'user';

    // Save User in the database
    User.create(request)
      .then((data) => {
        res.send(reply.success('Registration Success'));
      })
      .catch((err) => {
        res.send(reply.failed("Some error occurred while creating the User."));
      });
  },
  // Login Existing User
  async login(req, res) {
    let request = req.body;
    let rules = {
      email: "required|email",
      user_password: "required",
    };

    let validation = new Validator(request, rules);
    console.log(validation);
    if (validation.fails()) {
      var validation_error = reply.firstError(validation)
      return res.send(reply.failed(validation_error));
    }
    //check email exists in DB or not
    let user = await User.findOne({
      where: {
        email: request.email,
        role: 'user'
      },
    });
    if (!user) {
      return res.send(reply.failed("Email Does not exists"));
    }
    // Compare the password
    let password_match = await bcrypt.compare(
      request.user_password,
      user.user_password
    );
    if (!password_match) {
      return res.send(reply.failed("Password does not match"));
    }

    // check if the user already Logged in

    let login_detail = await LoginLog.findOne({
      where: {
        user_id: user.id,
        email: user.email,
      },
    });
    if (login_detail) {
      // delete current login token
      await login_detail.destroy();
    }
    //  create authentication token
    var token = jwt.sign(
      {
        data: {
          email: user.email,
          first_name: user.first_name,
          user_id: user.id
        },
      },
      jwt_secret,
      { expiresIn: "24h" }
    );
    //  create Login log
    LoginLog.create({
      token: token,
      email: request.email,
      user_id: user.id,
    })
      .then((data) => {
        res.send(reply.success("login successfully", { token: data.token }));
      })
      .catch((err) => {
        res.send(reply.failed(err.message || "Some error occurred while Logging in."));
      });
  },

  async forgotPassword(req, res) {
    let request = req.body;
    if (!request.email) {
      return res.send(reply.failed("Email is required"));
    }
    // check email exists in users or not
    let user = await User.findOne({ where: { email: request.email } });
    if (!user) {
      return res.send(reply.failed("Email Does not exist"));
    }
    let otp_exists = await OTP.findOne({
      where: {
        user_id: user.id,
        type: "forgot_password"
      }
    });
    // resend old otp
    if (otp_exists) {
      let response = await mailer.sendForgotPasswordMail(user.email, otp_exists.otp);
      if (response.accepted?.includes(user.email)) {
        common_helper.createActivity({ message: 'OTP sent for forget password', data: JSON.stringify(request), user_id: user.id, url: '/forgot_password' });
        common_helper.deleteActivity();
        return res.send(reply.success('Otp Sent to your registered email id again'));
      }
    }
    //  create otp
    const otp = Math.floor(100000 + Math.random() * 900000);

    // get Otp expiration Time
    const currentTimestamp = Date.now(); // Current timestamp in milliseconds

    // Create a new Date object for 5 minutes later
    const fiveMinutesLater = new Date(currentTimestamp + 5 * 60 * 1000);

    const expiration_time = fiveMinutesLater.getTime();
    // save otp in DB
    try {
      OTP.create({
        otp: otp,
        user_id: user.id,
        type: 'forgot_password',
        expire_at: expiration_time
      })
    } catch (err) {
      res.send(reply.failed(err.message || "Some error occurred while creating the Otp."));
    };
    let response = await mailer.sendForgotPasswordMail(user.email, otp);
    if (response.accepted?.includes(user.email)) {
      return res.send(reply.success('Otp Sent to your registered email id'));
    }
  },
  async UpdatePassword(req, res) {
    let request = req.body;
    let rules = {
      email: "required|email",
      user_password: "required",
      confirm_password: "required|same:user_password",
      otp: "required",
    };

    let validation = new Validator(request, rules);
    if (validation.fails()) {
      var validation_error = reply.firstError(validation)
      return res.send(reply.failed(validation_error));
    }
    let user = await User.findOne({ where: { email: request.email } });
    if (!user) {
      return res.send(reply.failed("Email Does not exist"));
    }
    let otp_exists = await OTP.findOne({
      where: {
        user_id: user.id,
        type: "forgot_password"
      }
    });
    if (!otp_exists) {
      return res.send(reply.failed('request for Otp First!'))
    }
    if (otp_exists.otp != request.otp) {
      return res.send(reply.failed('Invalid OTP Provided'))
    }
    if (Date.now() >= otp_exists.expire_at) {
      await otp_exists.destroy();
      return res.send(reply.failed('OTP Expired'));
    }
    //    hash password
    let hashed_password = await bcrypt.hash(request.user_password, salt);
    request.user_password = request.confirm_password = hashed_password;
    user.user_password = hashed_password;
    user.confirm_password = hashed_password;
    await user.save();
    return res.send(reply.success('Password updated Successfully'));


  },

};
