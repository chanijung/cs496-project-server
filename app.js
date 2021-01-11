// app.js
// [LOAD PACKAGES]
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
// [CONFIGURE APP TO USE bodyParser]
//v0
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

//v1
// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//v2
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// [CONFIGURE SERVER PORT]
var port = process.env.PORT || 8080;
var User = require('./models/users');
// [CONFIGURE ROUTER]
var router = require('./routes/index')(app, User)
// [RUN SERVER]
var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
mongoose.connect('mongodb://localhost:27017/users'); // db 연결!!