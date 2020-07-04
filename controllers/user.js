const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
// const { config } = require('dotenv/types');
const config = require('../config');

exports.auth =  function(req, res) {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide email and password!'}]});
  }

  User.findOne({email}, function(err, user) {
    console.log(email);
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }
    if (!user) {
      return res.status(422).send({errors: [{title: 'Invalid User!', detail: 'User does not exist'}]});
    }

    if (user.hasSamePassword(password)) {
      const token = jwt.sign({
        userId: user.id,
        username: user.username,
        useremail: user.email
      }, config.SECRET, { expiresIn: 60});

      return res.json(token);
    } else {
      return res.status(422).send({errors: [{title: 'Wrong Data!', detail: 'Wrong email or password'}]});
    }
  });
}

exports.register =  function(req, res) {
  console.log(req);
  const { username, email, password, passwordConfirmation } = req.body;

  if (!password || !email) {
    return res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide email and password!'}]});
  }

  if (password !== passwordConfirmation) {
    return res.status(422).send({errors: [{title: 'Invalid passsword!', detail: 'Password is not a same as confirmation!'}]});
  }

  User.findOne({email}, function(err, existingUser) {
    if (err) {
      return res.status(422).send({errors: normalizeErrors(err.errors)});
    }

    if (existingUser) {
      return res.status(422).send({errors: [{title: 'Invalid email!', detail: 'User with this email already exist!'}]});
    }

    const user = new User({
      username,
      email,
      password
    });

    user.save(function(err) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      return res.json({'registered': true});
    })
  })
}

exports.authMiddleware = function(req, res, next) {
  
  const token = req.headers.authorization;
  console.log(token);

  if (token) {
    const user = parseToken(token);
    console.log(user,"usertoken");

    User.findById(user.userId, function(err, user) {
      if (err) {
        return res.status(422).send({errors: normalizeErrors(err.errors)});
      }

      if (user) {
        res.locals.user = user;
        next();
      } else {
        return notAuthorized(res);
      }
    })
  } else {
    return notAuthorized(res);
  }
}

function parseToken(token) {
  console.log(token,"parsetoken");
    return jwt.verify(token, config.SECRET);
}

function notAuthorized(res) {
  return res.status(401).send({errors: [{title: 'Not authorized!', detail: 'You need to login to get access!'}]});
}
