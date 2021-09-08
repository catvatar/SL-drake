const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user' })
    }

    try {
      if (await bcrypt.compare(password, user.passwordHash)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Incorrect Password' })
      }
    } catch (e) {
      return done(e)
    }
  }
  passport.use(new LocalStrategy(authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize