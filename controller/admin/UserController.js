import Validator from "validatorjs";
import reply from "../../helper/reply.js";
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import common_helper from "../../helper/common_helper.js";

const salt = 10;
const jwt_secret = process.env.JWT_SECRET;

export default {
    // Create and Save a new User
    async create(req, res) {
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
                res.send(reply.success(' User created Successfully'));
            })
            .catch((err) => {
                res.send(reply.failed("Some error occurred while creating the User."));
            });
    },
    async updateUser(req, res) {
        let request = req.body;
        const param = req.params;
        if(request.user_password || request.confirm_password){
            return res.send(reply.failed("password can't be updated"));
        }

        let rules = {
            email: "email",
            gender: "in:male,female"
        };

        let validation = new Validator(request, rules);
        if (validation.fails()) {
            var validation_error = reply.firstError(validation)
            return res.send(reply.failed(validation_error));
        }
        const user = await User.findOne({
            where:{
                id: param.user_id
            },
            attributes: { exclude: ['user_password','confirm_password'] },
        });
        if (!user) {
            return res.send(reply.failed("Invalid user Details"));
        }
        if(request.email){
            let email_exists = await User.findOne({
                where:{
                    email: request.email
                },
                attributes: { exclude: ['user_password','confirm_password'] },
            });
            if(email_exists){
                return res.send(reply.failed('Email Already Exists'));
            }
        }
        for(let key in request){
            console.log(key, request[key]);
            user[key] = request[key];
        }

        // Update User in the database
        await user.save();
        return res.send(reply.success('user details updated successfully',user));
    },
    async getAllUsers(req, res) {
        let users = await User.findAll({
            attributes: { exclude: ['user_password','confirm_password'] },
        });
        return res.send(reply.success('users fetched successfully',users));
    },
    async getUser(req, res) {
        const param = req.params;
        let user = await User.findOne({
            where:{
                id: param.user_id
            },
            attributes: { exclude: ['user_password','confirm_password'] },
        });
        if(!user) {
            return res.send(reply.failed('User not found'));
        }
        return res.send(reply.success('user fetched successfully',user));
    },
    async deleteUser(req, res){
        const param = req.params;
        let user = await User.findOne({
            where:{
                id: param.user_id
            }
        });
        if(!user) {
            return res.send(reply.failed('User not found'));
        }
        await user.destroy();
        return res.send(reply.success('user deleted successfully'));

    }
}