require("dotenv").config();

var jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports.isAuthenticated = (req, res, next) => {
  try {
    var authorization = req.header('Authorization');

    console.log({authorization})
    if (
      authorization == null ||
      authorization === '' ||
      !authorization ||
      authorization == undefined
    ) {
      return res.send({
        Success: false,
        body: null,
        error: 'Authentication token is required',
      });
    }
    var token = authorization
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, getuser) => {
      // console.log({err})
      // console.log({getuser})
      if (err) {
        return res.send({
          Success: false,
          body: null,
          error: 'Failed to authenticate token.',
        });
      }
      const userExists = await User.findById(getuser.id).select("_id")
      if (!userExists) {
        return res.send({
          Success: false,
          body: null,
          error: 'No User Exists !',
        });
      }
      req.user = getuser;
      next();
    });
  } catch (error) {
    return res.send({ Success: false, body: null, error: error.message });
  }
};




module.exports.verifyRole = function checkUserRole(expectedRole) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      console.log({userId})
      const user = await User.findById(userId).populate('role');

      if (!user) {
        return res.status(401).json({ Success : false,  error: 'User not authenticated.' });
      }

      if (user.role?.title === expectedRole) {
        return next();
      }

      return res.status(403).json({ Success : false ,  error: 'Forbidden: Insufficient permissions.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ Success : false  ,  error: 'Internal Server Error' });
    }
  };
}




module.exports.authenticateAdmin =(req, res, next) => {
  try {
    var authorization = req.header('Authorization');

    console.log({authorization})
    if (
      authorization == null ||
      authorization === '' ||
      !authorization ||
      authorization == undefined
    ) {
      return res.send({
        Success: false,
        body: null,
        error: 'Authentication token is required',
      });
    }
    var token = authorization
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, getuser) => {
      // console.log({err})
      // console.log({getuser})
      if (err) {
        return res.send({
          Success: false,
          body: null,
          error: 'Failed to authenticate token.',
        });
      }
      const userExists = await User.findById(getuser.id).select("_id role").populate('role');
    
      if (!userExists) {
        return res.send({
          Success: false,
          body: null,
          error: 'No User Exists !',
        });
      }

      if (userExists.role?.title === "ADMIN") {
        req.user = getuser;
        return next();
      }else{
        return res.status(403).json({ Success : false ,  error: 'Forbidden: Insufficient permissions.' });
      }

    });
  } catch (error) {
    return res.send({ Success: false, body: null, error: error.message });
  }
};

