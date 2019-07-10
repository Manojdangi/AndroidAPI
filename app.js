require('./database/connection');
const User = require('./model/user');
const Hotel = require('./model/hotel');
const Room =require('./model/room');
const Review=require('./model/review_rating');
const Booking = require('./model/booking');
const auth = require('./middleware/auth');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const cors = require('cors');
app.use(cors());
const path = require('path');
const multer = require('multer');


//to register the user
app.post('/user_register', function (req, res) {
    var fullname = req.body.fullname;
    var phone = req.body.phone;
    var address = req.body.address;
    var email = req.body.email;
    var password = req.body.password;
    var type = "normal_user";

    var user_data = new User({

        fullname: fullname,
        phone: phone,
        address: address,
        email: email,
        password: password,
        type: type

    })

    User.findOne({
        email: email
    }).then(function (data) {
        if (data) {
            res.json({ message: "exist" });
        }
        else {
            user_data.save().then(function (data) {
                res.json({ message: "not_exist" });

            })
        }

    }).catch(function (e) {
        res.send(e)

    })

})


//to register the user
app.post('/userRegister',function(req,res){
    var fullname=req.body.fullname;
    var phone=req.body.phone;
    var address=req.body.address;
    var email=req.body.email;
    var password=req.body.password;
    var type="normal_user";
    var imagename="";
    
    
    var user_data=new User({
        
            fullname:fullname,
            phone:phone,
            address:address,
            email:email,
            password:password,
            type:type,
            imagename:imagename
        
    })
    
    User.findOne({
        email:email
    }).then(function(data){
        if(data==null){
            user_data.save().then(function(data){
            res.end(JSON.stringify('User_Registered'))
    
            })
        }
    
        else{
            res.end(JSON.stringify('User_Already_Exit'))
        }
       
    }).catch(function(e){
        res.send(e)
    
    })
    
    })

//for user login
    app.post('/userLogin', function(req,res){
        var email= req.body.email;
        var pass=req.body.password;
       
        User.find({
          email:email,
          password:pass
        }).then(function(userdata){
        
            if(userdata){
                console.log(userdata);
                res.send(JSON.stringify(userdata));
            }
         else{
             res.send(JSON.stringify('Invalid_Username_Or_Password'));
         }
        }).catch(function(e){
            res.send(e);
        })
      })
    
    
    //for image upload
      app.use("/userimg",express.static("userimg"));
     
      var Image;
      var storage = multer.diskStorage(
        {destination: "userimg",
        filename: (req, file, callback) =>
        {
        let ext = path.extname(file.originalname);
          Image=file.fieldname + "-" + Date.now() + ext;
        callback(null, Image);
        }});
      
       
        var imageFileFilter = (req, file, cb) => {if
       (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
        {return cb(newError("You can upload only image files!"), false); }
        cb(null, true);};
       
        var upload = multer({
        storage: storage,
        fileFilter: imageFileFilter,
        limits: { fileSize: 5000000
        }});
      
    //for image upload    
       app.post('/uploadimg', upload.single('files'), (req, res) => {
           console.log(Image);
         res.send(JSON.stringify({
           files:Image
         }))
        
        
      
       })
      
   //to update the user 
      app.post('/updateUser/:id', function (req, res) {
        var fullname = req.body.fullname;
        var phone = req.body.phone;
        var address = req.body.address;
        var email=req.body.email;
        var imagename=req.body.imagename;
        var u_id = req.params.id;
        console.log(req.body);
        
    
        User.updateOne({_id:new ObjectID(u_id)},
        {
            $set:{
                fullname: fullname,
                phone: phone,
                address: address,
                email: email,
                imagename:imagename
    
            }
        }).then(function(){
            res.json({message:"success"})
    
        }).catch(function(){
            console.log('error')
        });
    
    })
    

 //to get user details   
app.get('/users', auth, function (req, res) {
    res.send(req.user);

})

app.post("/login", async function (req, res) {

    const user = await User.checkCrediantialsDb(req.body.email,
        req.body.password)
    
    const token = await user.generateAuthToken();
    res.send({
        token: token,
        user: user
    })


})

//to logout the user
app.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//for image upload
var Image;
app.use("/hotelimages", express.static("hotelimages"))
var storage = multer.diskStorage({
    destination: "hotelimages",
    filename: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        Image = file.fieldname + "_" + Date.now() + ext;
        callback(null, Image);
    }
});

var imageFileFilter = (req, file, cb) => {
    if
        (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { return cb(newError("You can upload only image files!"), false); }
    cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5000000
    }
});


app.post('/imageupload', upload.single('imageFile'), (req, res) => {

    res.send(Image)
})


//to add the hotel
app.post('/addhotel', function (req, res) {
    var hotelname = req.body.hotelname;
    var phone = req.body.phone;
    var address = req.body.address;
    var email = req.body.email;
    var image = req.body.image;
    var description = req.body.description;
   
    var hotel_data = new Hotel({
        hotelname: hotelname,
        phone: phone,
        address: address,
        email: email,
        image: image,
        description: description

    })
    Hotel.findOne({
        hotelname: hotelname
    }).then(function (data) {
        if (data) {
            res.json({ message: "hotel_exist" });
        }
        else {
            hotel_data.save().then(function (data) {
                res.json({ message: "hotel_not_exist" })
            })

        }
    }).catch(function (e) {
        res.send(e);
    })

})

//to get the hotel details
app.get('/gethotels', function (req, res) {
    Hotel.find().then(function (hotel) {
        
            res.send(hotel)
            console.log(hotel)
    
    }).catch(function (e) {
        res.send(e)
    });
})


//to delete the hotel details
app.delete('/deletehotel/:id', function (req, res) {
    var id=req.params.id;

    Hotel.findByIdAndDelete(id).then(function () {
        res.json({ message: "hotel_deleted" })
    }).catch(function (e) {
        res.send(e)
    })

    Room.deleteMany({hotelID:id}).then(function () {
        res.json({ message: "room_deleted" })
    }).catch(function (e) {
        res.send(e)
    })

})

app.get('/edithotel/:id', function (req, res) {
    var id = req.params.id;

    Hotel.findById(id).then(function (hotel) {
       
        res.send(hotel);
    }).catch(function (e) {
        res.send(e)
    });
})


//to update the hotel details
app.post('/updatehotel', function (req, res) {
    var hotelname = req.body.hotelname;
    var phone = req.body.phone;
    var address = req.body.address;
    var email = req.body.email;
    var description = req.body.description;
    var u_id = req.body.id;


    Room.updateMany({hotelID:u_id},
    {
        $set:{
            hotelname:hotelname
        }
    }).then(function(){
        res.json({message:"success"})
        console.log('success')
    }).catch(function(){
        console.log('error')
    });

    Hotel.updateOne({_id:new ObjectID(u_id)},
    {
        $set:{
            hotelname:hotelname,
            phone:phone,
            address:address,
            email:email,
            description:description
        }
    }).then(function(){
        res.json({message:"success"})
        console.log('success')
    }).catch(function(){
        console.log('error')
    });

})


//for image upload
var Image;
app.use("/roomimages", express.static("roomimages"))
var storage = multer.diskStorage({
    destination: "roomimages",
    filename: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        Image = file.fieldname + "_" + Date.now() + ext;
        callback(null, Image);
    }
});

var imageFileFilter = (req, file, cb) => {
    if
        (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { return cb(newError("You can upload only image files!"), false); }
    cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5000000
    }
});


app.post('/roomimageupload', upload.single('imageFile'), (req, res) => {
    
    res.send(Image)
})


//to add room details
app.post('/addroom', function (req, res) {
    var hotelID = req.body.hotelID;
    var roomname = req.body.roomname;
    var roomtype = req.body.roomtype;
    var roomnumber = req.body.roomnumber;
    var rate = req.body.rate;
    var image=req.body.image;

    var room_data = new Room({
        hotelID: hotelID,
        roomname: roomname,
        roomtype: roomtype,
        roomnumber: roomnumber,
        rate: rate,
        image: image

    })
    
    room_data.save().then(function (data) {
                res.json({ message: "register" })

            }).catch(function (e) {
                res.send(e);
        
    })
    })

  //to get the room details  
    app.get('/getrooms', function (req, res) {
        Room.find().then(function (room) {
            res.send(room);
        }).catch(function (e) {
            res.send(e)
        });
    })

    //to delete the room
    app.delete('/deleteroom/:id', function (req, res) {
        Room.findByIdAndDelete(req.params.id).then(function () {
            res.json({ message: "room_deleted" })
        }).catch(function (e) {
            res.send(e)
        })
    })

    //to edit the room details
    app.get('/editroom/:id', function (req, res) {
        var id = req.params.id;
    
        Room.findById(id).then(function (room) {
           
            res.send(room);
        }).catch(function (e) {
            res.send(e)
        });
    })
    
  
    //to update the room details
    app.post('/updateroom', function (req, res) {
        var roomname = req.body.roomname;
        var roomtype = req.body.roomtype;
        var roomnumber = req.body.roomnumber;
        var rate = req.body.rate;
        var u_id = req.body.id;
        
        Room.updateOne({_id:new ObjectID(u_id)},
        {
            $set:{
                roomname: roomname,
                roomtype: roomtype,
                roomnumber: roomnumber,
                rate: rate
            }
        }).then(function(){
            res.json({message:"success"})
    
        }).catch(function(){
            console.log('error')
        });
    
    })
    

    //to get the hotel details
    app.get('/gethotel_details/:id', function (req, res) {
        var id = req.params.id;
    
        Room.find({hotelID:new ObjectID(id)}).then(function (room) {
           
            res.send(room);
        }).catch(function (e) {
            res.send(e)
        });
    })

//to add review    
app.post('/addreview', function (req, res) {
    var hotelID = req.body.hotelID;
    var fullname = req.body.fullname;
    var rating = req.body.rating;
    var review = req.body.review;

    var review_data = new Review({
        hotelID: hotelID,
        fullname: fullname,
        rating: rating,
        review: review

    })
    
    review_data.save().then(function (data) {
                res.send(JSON.stringify('Review_Added'));

            }).catch(function (e) {
                res.send(e);
    })
    })

//to get the review details
    app.get('/getreview_details/:id', function (req, res) {
        var id = req.params.id;
    
        Review.find({hotelID:new ObjectID(id)}).then(function (review) {
           
            res.send(review);
        }).catch(function (e) {
            res.send(e)
        });
    })

//to add booking     
    app.post('/booking', function (req, res) {
        var hotelId = req.body.hotelId;
        var hotelname = req.body.hotelname;
        var userId = req.body.userId;
        var fullname = req.body.fullname;
        var phone = req.body.phone;
        var description = req.body.description;
        var status = req.body.status;
      
        var booking_data = new Booking({
    
            hotelID: hotelId,
            hotelname: hotelname,
            userId: userId,
            fullname: fullname,
            phone: phone,
            description: description,
            status: status
        })

        booking_data.save().then(function (data) {
            res.send(JSON.stringify('Booking_Query_Added'))

        }).catch(function (e) {
            res.send(e); 
})
    })

 
  //to get the booking details  
    app.get('/getbooking_details',function(req,res){
        Booking.find().then(function (booking) {
            res.send(booking);
        }).catch(function (e) {
            res.send(e)
        });
    })

 //to edit the booking   
    app.get('/editbooking/:id', function (req, res) {
        var id = req.params.id;
    
        Booking.findById(id).then(function (booking) {
           
            res.send(booking);
        }).catch(function (e) {
            res.send(e)
        });
    })

//to update the booking details
    app.post('/updatebooking', function (req, res) {
        var hotelname = req.body.hotelname;
        var fullname = req.body.fullname;
        var phone = req.body.phone;
        var status = req.body.status;
        var u_id = req.body.id;
        
    
        Booking.updateOne({_id:new ObjectID(u_id)},
        {
            $set:{
                hotelname: hotelname,
                fullname: fullname,
                phone: phone,
                status: status,
    
            }
        }).then(function(){
            res.json({message:"success"})
    
        }).catch(function(){
            console.log('error')
        });
    
    })

//to delete thr booking details    
    app.delete('/deletebooking/:id', function (req, res) {
        Booking.findByIdAndDelete(req.params.id).then(function () {
            res.json({ message: "Booking_deleted" })
        }).catch(function (e) {
            res.send(e)
        })
    })

    //to get the specific user booking details
    app.get('/get_users_booking_details/:id', function(req,res){
        var userid= req.params.id
        console.log(userid)
        console.log(req.body);
        Booking.find({
            userId:userid
        }).then(function(data){
            console.log(data)
            res.send(data)
        }).catch(function(){
            res.send('error')
        })
    })

app.listen(90);