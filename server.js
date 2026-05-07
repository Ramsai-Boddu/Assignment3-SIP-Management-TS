const express = require('express')
const app = express()
require('./utils/dbManager.js')

app.use(express.json())

app.use('/sip/invest',require('./routes/investRoutes.js'))
app.use('/sip/fund',require('./routes/fundRoutes.js'))
app.use('/sip/',require('./routes/sipRoutes.js'))

app.listen(3000, ()=>{
    console.log('Server Started')
})