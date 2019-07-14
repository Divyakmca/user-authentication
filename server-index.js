const express = require('express')
const cors=require('cors')
const {mongoose} = require('./config/database')
const {usersRouter} = require('./app/controllers/UsersController')

const app=express()
// const port=3000
const port=3001

app.use(express.json()) // express app to handle incoming data interms of json // now u can use req.body in controllers to get the requested data as response from server
app.use(cors())

app.use('/users', usersRouter)

app.listen(port, function(){
    console.log('listening to port', port)
})