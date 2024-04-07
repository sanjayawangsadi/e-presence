const express = require('express')
const session = require('express-session')

const app = express()
const port = 3000
const bodyParser = require('body-parser')

const auth = require('./routes/auth.js')
const presence = require('./routes/presence.js')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

app.use('/auth', auth)
app.use('/presences', presence)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
