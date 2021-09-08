if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const flash = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  async email => User.find({ email: email }),
  async id => User.find({ _id: id })
)
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true })
mongoose.connection.once('open', () => console.log('connected'))

const User = require('./data/users.js')

app.use(express.json())
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch {
    console.log('cought a penis get')
    res.status(500).send()
  }

})

app.post('/users/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = new User({ username: req.body.username, email: req.body.email, passwordHash: hashedPassword })

    user.save(function (err) {
      if (err) console.log(err)
    })

    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', passport.authenticate('local', {
  failureFlash: true
}))

app.listen(3000)