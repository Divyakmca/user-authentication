const express = require('express')
const router = express.Router()
const _ = require('lodash')
//const bcryptjs = require('bcryptjs')

const { User } = require('../models/User')
const { authenticateUser } = require('../middlewares/authentication')

//localhost:3000/users/register
router.post('/register',function(req,res){
   // res.send('registeration')
    const body = req.body
    const user = new User(body) // user object is created for User model
    console.log(user.isNew)

    //before saving the pre hook from model is called
    user.save() //method provided by mongoose
        .then(function(user){
            // console.log(user.isNew)
            // res.send(user)
            res.send(_.pick(user, ['_id', 'username', 'email', 'createdAt'])) //from the user object, send back only the required fields so we are using _pick(which takes 2 args i.e object and array) from lodash package 
        })
        .catch(function(err){
            res.send(err)
        })
})

//localhost:3000/users/login
router.post('/login', function(req,res){
    const body = req.body

    User.findByCredentials(body.email, body.password)
        .then(function(user){
            return user.generateToken()
        })
        .then(function(token){
               //res.send(token) sending information in the body
               //res.setHeader('x-auth',token).send({}) //sending information in the header
               //generally the token that are sent back to the user needs to send through header an not in the body
               res.send({ token })
           }) 
        .catch(function(err){
            res.send(err)
        })


      

    // User.findOne({email:body.email})
    //     .then(function(user){
    //         if(!user){
    //          res.status('404').send('invalid email')
    //         }
            
    //         bcryptjs.compare(body.password, user.password)
    //            .then(function(result){
    //                if(result){
    //                    res.send(user)
    //                }else{
    //                    res.status('404').send('invalid password')
    //                }
    //            })
            
    //     })
    //     .catch(function(err){
    //         res.send(err)
    //     })
})

//localhost:3000/users/account
router.get('/account', authenticateUser, function(req,res){
    const { user } = req
    res.send(user)
})


//localhost:3000/users/logout
router.delete('/logout', authenticateUser, function(req,res){
    const {user,token} = req
    User.findByIdAndUpdate(user._id, {$pull:{tokens:{token:token}}})
     .then(function(){
         res.send({notice: 'successfully logged out'})
     })
     .catch(function(err){
         res.send(err)
     })
})

module.exports={
    usersRouter: router
}