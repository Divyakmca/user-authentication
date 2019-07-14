const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator=require('validator')
const bcryptjs = require('bcryptjs') //it is used to encrypt user password
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: { 
            validator: function(value){  
                return validator.isEmail(value) //reference to validator package

            },
            message: function(){
                return 'inavalid email format'
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128
    },
    tokens:[
        {
            token:{
                type:String
            },
            createdAt:{
                type: Date,
                default: Date.now
            }
        }
    ]
    // isAdmin:{
    //     default:true
    // }

})

//pre hooks //it is both save and update
// mongoose middlewares (before saving in controller use this function)
//must use es5 function and not arrow coz v are using this
userSchema.pre('save', function(next){ 
    const user = this  //user is created in controller
    if(user.isNew){
        bcryptjs.genSalt(10)
        .then(function(salt){
            bcryptjs.hash(user.password, salt)
               .then(function(encryptedPassword){
                   user.password = encryptedPassword
                   next() //it goes to controller and the user record is now saved, it executes from user.save()
               })
        })

    }else{
        next()
    }
    
})

//own static method
userSchema.statics.findByCredentials = function(email, password){
    const User = this
    return User.findOne({email})
          .then(function(user){
              if(!user){
                  return Promise.reject({errors:'invalid email'})
              }
              return bcryptjs.compare(password, user.password)
                   .then(function(result){
                       if(result){
                           return Promise.resolve(user)
                       }else{
                           return Promise.reject('invalid password')
                       }
                   })
          })
          .catch(function(err){
              return Promise.reject(err)
              // return new Promise(function(resolve, reject){
              // reject(err)
              // })
          })
}

//own static method
userSchema.statics.findByToken = function(token){
    const User = this
    let tokenData
    // to check whether the token provided is valid or not
    //it is sa synchronous operation (promise is not used)
    try{
        tokenData = jwt.verify(token, 'jwt@123')
    
    }
    catch(err){
        return Promise.reject(err)
    }

    // to check whether particular token belongs to that user
    return User.findOne({
        _id: tokenData._id,
        'tokens.token': token
    })
}

//own instance method
userSchema.methods.generateToken = function(){
    const user = this
    const tokenData = {
        _id: user._id,
        username:user.username,
        createdAt: Number(new Date())
    }

    const token = jwt.sign(tokenData, 'jwt@123')
    user.tokens.push({
        token:token
    })

    return user.save()
          .then(function(user){
              return Promise.resolve(token)
          })
          .catch(function(err){
              return Promise.reject(err)
          })
}

const User = mongoose.model('User',userSchema)

module.exports={
    User
}