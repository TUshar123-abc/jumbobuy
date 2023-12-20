const Model = require("../models/user.model");
// const { registerSchema, registerUserSchema, registerVendorSchema, loginSchema, loginUserSchema, verifyOtpSchema, onboardInfluencerSchema, createUserSchema } = require('../Validations/auth_validation_schema')
const createError = require("http-errors");
var moment = require("moment");
const { signAccessToken, signRefreshToken } = require("../Helpers/jwt_helper");

module.exports = {
  login: async (req, res, next) => {
    try {
      const result = req.body;
      let user =
        (await Model.findOne({ email: result.email })) ||
        (await Model.findOne({ mobile: result.email }));
      if (!user) {
        throw createError.NotFound("User not registered");
      }

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch)
        throw createError.NotAcceptable("Username/password not valid");
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      res.send({
        success: true,
        msg: "Login Successfull",
        token: accessToken,
        refreshToken,
        user: {
          id: user._id,
          full_name: user.full_name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          topUser: user.topUser,
        },
      });
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest("Invalid Username/Password"));
      next(error);
    }
  },
  profile: async (req, res, next) => {
    try {
      data = {
        success: true,
        msg: "Profile Fetched",
        user: req.user,
      };
      data = JSON.parse(JSON.stringify(data));
      delete data.user.password;
      res.send(data);
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest("Invalid Username/Otp"));
      next(error);
    }
  },
};
