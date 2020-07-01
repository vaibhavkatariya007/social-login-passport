const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

// const router = express.Router;
const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');

const passportLocal = passport.authenticate('local', { session: false });
const passportJwtValidate = passport.authenticate('jwt', { session: false });

router.use(passport.initialize());
router
  .route('/signup')
  .post(validateBody(schemas.authSchema), UsersController.signUp);
router.route('/signin').post(
  validateBody(schemas.authSchema),
  function (req, res, next) {
    passport.authenticate('local', function (error, user, info) {
      if (error) {
        return res.status(401).json(error);
      }
      if (!user) {
        return res.status(401).json({ mesage: 'user not found' });
      }
      req.logIn(user, function (err) {
        if (err) {
          return res.status(401).json(err);
        }
        return next();
      });
    })(req, res, next);
  },
  UsersController.signIn
);

router
  .route('/oauth/google')
  .post(
    passport.authenticate('googleToken', { session: false }),
    UsersController.googleOauth
  );
router
  .route('/oauth/facebook')
  .post(
    passport.authenticate('facebookToken', { session: false }),
    UsersController.facebookOauth
  );

router.route('/secret').get(passportJwtValidate, UsersController.secret);

module.exports = router;
