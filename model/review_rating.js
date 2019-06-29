const mongoose = require('mongoose');

const reviewSchema= new mongoose.Schema({
    hotelID: {
        type: String
    },
    fullname: {
        type: String
    },

    rating:{
        type:String
    },
 
    review: {
        type: String
    }
   
})
const Review=mongoose.model('Review',reviewSchema);
module.exports=Review;
