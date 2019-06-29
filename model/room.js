const mongoose = require('mongoose');

const roomSchema= new mongoose.Schema({
    hotelID: {
        type: String
    },

    roomname:{
        type:String
    },

    roomtype: {
        type: String
    },
    roomnumber: {
        type: String
    },
    rate:{
        type:String
    },
    image:{
        type:String
    },
    
   
})
const Room=mongoose.model('Room',roomSchema);
module.exports=Room;
