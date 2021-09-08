const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/mybrary', { useNewUrlParser: true })
mongoose.connection.once('open', () => console.log('not connected'))

const User = require('./data/users.js')

app.use(express.json())



const users = []

app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch {
    console.log('cought a penis')
    res.status(500).send()
  }

})

app.post('/users/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = new User({ username: req.body.username, email: req.body.email, password: hashedPassword })

    try {
      const newUser = await user.save()
    } catch {
      console.log('cought a penis')
    }

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