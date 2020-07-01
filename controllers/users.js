const JWT = require('jsonwebtoken');
const User = require('../models/users');
const { JWT_SECRET } = require('../configurations');

const signToken = (user) => {
  return JWT.sign(
    {
      iss: 'vaibhav',
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.value.body;

    const findUser = await User.findOne({ 'local.email': email });
    if (findUser) {
      return res.status(403).json({
        error: 'Email already in use',
      });
    }

    const newUser = new User({
      method: 'local',
      local: {
        email: email,
        password: password,
      },
    });
    await newUser.save();

    const token = signToken(newUser);
    res.status(200).json({ token });
  },
  signIn: async (req, res, next) => {
    //generate token
    // console.log(req.user);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },
  googleOauth: async (req, res, next) => {
    //generate token
    // console.log(req.user);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },
  facebookOauth: async (req, res, next) => {
    //generate token
    // console.log(req.user);
    const token = signToken(req.user);
    res.status(200).json({ token });
  },
  secret: async (req, res, next) => {
    res.status(200).json({ data: 'success' });
  },
};
