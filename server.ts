const express = require('express')
const app = express()
const port = process.env.SERVER_PORT

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})