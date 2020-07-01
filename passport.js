const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');

const { JWT_SECRET } = require('./configurations');

const User = require('./models/users');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  'facebookToken',
  new FacebookTokenStrategy(
    {
      clientID: '256071119116878',
      clientSecret: '28c399bf64a825540ee863d504fae691',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('ACCESS TOKEN', accessToken);
        console.log('REFRESH TOKEN', refreshToken);
        console.log('Profile', profile);
        const existingUser = await User.findOne({ 'facebook.id': profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = new User({
          method: 'facebook',
          facebook: {
            id: profile.id,
            email: profile.emails[0].value,
          },
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

passport.use(
  'googleToken',
  new GooglePlusTokenStrategy(
    {
      clientID:
        '051210915239-0165kkdc4ujaoi0uu1fcgu34ugn36g8l.apps.googleusercontent.com',
      clientSecret: 'k66Mv_OCsgke_2SXAK6pOXSg',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('ACCESS TOKEN', accessToken);
        console.log('REFRESH TOKEN', refreshToken);
        console.log('Profile', profile);
        const existingUser = await User.findOne({ 'google.id': profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = new User({
          method: 'google',
          google: {
            id: profile.id,
            email: profile.emails[0].value,
          },
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      // here we can split Bearer keyword if it comes with
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        // find user specify in token
        const user = await User.findById(payload.sub);
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ 'local.email': email });
        if (!user) {
          return done(null, false);
        }
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
