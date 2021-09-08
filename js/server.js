const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true })
mongoose.connection.once('open', () => console.log('connected'))

const User = require('./data/users.js')

app.use(express.json())


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

    const user = new User({ username: req.body.username, email: req.body.email, password: hashedPassword })

    user.save(function (err) {
      if (err) console.log('cought a penis post')
    })

    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name = req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
})

app.listen(3000)