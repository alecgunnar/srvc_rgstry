const express = require('express')
const mustachExpress = require('mustache-express')

const app = express()
const port = 3000

app.engine('mst', mustachExpress())

app.set('views', __dirname + '/views')
app.set('view engine', 'mst')

app.use(express.json())
app.use(express.static('./static'))
app.use(require('./routes'))

app.listen(port)
