const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema= new mongoose.Schema({
    fullname: {
        type: String
    },

    phone:{
        type:String
    },

    address: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    type:{
        type:String
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    imagename:{
        type:String
    }


})

userSchema.statics.checkCrediantialsDb = async (email, pass) =>{

    const user1 = await User.findOne
    ({email : email, 
      password : pass})
      
     return user1;
    }

    userSchema.methods.generateAuthToken = async function () {
        const user = this
       const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
       
       console.log(token);
        user.tokens = user.tokens.concat({ token :token })
        await user.save()
        return token;
    }

const User=mongoose.model('User',userSchema)
module.exports=User;