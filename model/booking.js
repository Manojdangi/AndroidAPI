const mongoose = require('mongoose');

const bookingSchema= new mongoose.Schema({
    hotelID: {
        type: String
    },
    hotelname: {
        type: String
    },

    userId:{
        type:String
    },

    fullname: {
        type: String
    },
    phone: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String
    }

   
})
const Booking=mongoose.model('Booking',bookingSchema);
module.exports=Booking;
