const mongoose = require('mongoose');

const hotelSchema= new mongoose.Schema({
    hotelname: {
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
    image:{
        type:String
    },
    description: {
        type: String
    }
    
   
})
const Hotel=mongoose.model('Hotel',hotelSchema);
module.exports=Hotel;
