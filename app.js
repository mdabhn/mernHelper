const express = require('express')

const app = express()
app.use(express.json())

const databaseConnection = require('./config/database')
databaseConnection()

const PORT = process.env.PORT || 5000
app.listen(PORT)

/** @Routing */

app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/user', require('./routes/api/user'))
app.use('/api/post', require('./routes/api/post'))
app.use('/api/profile', require('./routes/api/profile'))
