
var app = require('../app');
var debug = require('debug')('angular2-nodejs:server');



var express = require('express');
var router = express.Router();

var http = require('http');

var crypto = require('crypto');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var methodOverride = require('method-override');

var mongoose = require('mongoose');
var usersDataSchema = require('../public/models/usersData');
var usersData = mongoose.model('UserData',usersDataSchema);
var chatSchema = require('../public/models/chat');
var chatData = mongoose.model('chatData',chatSchema);

var port = process.env.PORT || '3000';
app.set('port', port);

let gfs;

mongoose.connect("mongodb+srv://rf:thebest1@ecom-95a4a.mongodb.net/ecom",{ useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) {
    console.log("Connection succeeded.");
});




var server = http.createServer(app);

var io = require('socket.io').listen(server);
 var users=[];
 var userList=[];
var  RPobj = {};
var RandomPobj = {};



io.on('connection',(socket)=>{

    console.log('new connection made.');




    socket.on('enter',function (data) {


      var username = data.user;
      var id = socket.id;

      usersData.update({username: username}, {socketId: id,activity:true}, function (err2, data2) {
        if (err2) {
          console.log(err2);
        }
        else {
          console.log(data2);
        }
      });



      var key= data.user;
      var userInfo={};

      userInfo[key]=socket.id;

      userList.push(userInfo);

        users.push(data.user);
        console.log(socket.id);
        io.emit('new user entered',users);

    });
    socket.on('signup',function (data) {
      console.log('hi');
      var username = data.username;
      var email = data.email;
      var pwd = data.password;
      var url = data.url;

      usersData.find({username:username},function (err1,data1) {
        if(data1.length == 0 ) {

          var rog = new usersData({
            username: username,
            email:email,
            password:pwd,
            socketId:socket.id,
            url:url,
            activity:true
          });
          rog.save(function (error) {
            if(error){
              console.log(error);
            }
            else {
              console.log('Your data has been saved');
              socket.emit('signupStatus',{username:username,url:url,success:true});
            }
          });
        }
        else if (data1.length > 0){
            console.log(data1);
          socket.emit('signupStatus',{username:username,success:false})
        }
      })

    });

    socket.on('login',function (data) {
      var id = socket.id;
      var username = data.username;
      var pwd = data.password;
   console.log('SocID:'+socket.id +' ' + id);

      usersData.find({username:username},function (err1,data1) {
        if(err1){
          console.log(err1);
        }
        else if (data1.length > 0) {

          if (data1[0].password == pwd) {

            usersData.update({username: username}, {socketId: id,activity:true}, function (err2, data2) {
              if (err2) {
                console.log(err2);
              }
              else {
                console.log(data2);
              }
            });
            socket.emit('loginStatus', {username:username,url:data1[0].url,success: true});
          }
        }

        else if(data1.length == 0) {
            socket.emit('loginStatus', {username: username,success: false});
          }

      });
      });

    socket.on('find',function (data) {
        var username= data.user;
        var count;
        var conditions = {
            username : { $ne : username},
            activity: true
        };
        usersData.find(conditions, function (err, data1) {
            if (err) {console.error(err);}
            else if(data1.length == 0){
                usersData.find({username:username},{_id:0},function (err2,data2) {
                    if(err2){console.log(err2); }
                    else {
                        io.in(data2[0].socketId).emit('new message',{user:username,
                            message:"Sorry, There aren't any people available for this moment. Please try after few minutes "});
                    }
                });
            }

            else {
               // console.log(data1);
                count = data1.length;
                usersData.find({username:username},{_id:0},function (err2,data2) {
                    if(err2){console.log(err2); }
                    else{
                        var random = Math.floor(Math.random() * count);

                        var FoundName = data1[random].username;
                        var FSI = data1[random].socketId;
                        var FUrl = data1[random].url;
                       // console.log(FoundName);

                         RPobj={

                            to:{
                                name:FoundName,
                                id:FSI,
                               url:FUrl
                            },
                            from: {
                                name: data2[0].username,
                                id: data2[0].socketId,
                                url:data2[0].url
                            }
                        };
                         RandomPobj={
                            to: {
                                name: data2[0].username,
                                id: data2[0].socketId,
                                url:data2[0].url
                            },
                            from:{
                                name:FoundName,
                                id:FSI,
                                url:FUrl
                            }
                        };
                        var RName= data2[0].username;

                        var conditions = { 'username':{
                            $in:[
                        RName, FoundName]}}
                            , update={activity:false},options={multi: true};

                       usersData.updateMany(conditions,update,options,function (err3,data3) {
                           if (err3) {
                               console.error(err);
                           }
                           else {
                               console.log(data3);
                           }

                       });
                       console.log(socket.id,FSI);


                        io.in(FSI).emit('found person', RandomPobj);
                        io.in(data2[0].socketId).emit('found person', RPobj);
                        io.in(FSI).emit('new message',{user: RandomPobj.from.name, message: RandomPobj.to.name+ ' connected'});
                        io.in(data2[0].socketId).emit('new message',{user:RandomPobj.to.name, message: RPobj.to.name+ ' connected'});
                       // console.log(RandomPobj.to.name);

                    }
                })
            }
        });

    });


    socket.on('leave', function(data){
    var RName=data.toName,FoundName=data.fromName;
    var To=data.to,From=data.from;

      var conditions = {'username':{
          $in:[RName,FoundName]
      }},update={activity:true},options={multi:true};
      usersData.update(conditions,update,options,function (err1,data1) {

          if (err1) {
              console.error(err);
          }
          else {
              console.log(data1);
          }
      });

      //socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left the chat.',activity:false});
        io.in(To).emit('left message', {user: data.user, message: 'has left the chat.',activity:false});
        io.in(From).emit('left message', {user: data.user, message:' You left the chat.',activity:false});

      socket.leave(data.room);


    });

    socket.on('message',function(data){
        console.log(data);

                var To = data.to;
                var From= data.from;
                var toName = data.toName;
                if(toName > data.user) {
                  console.log('True');
                  var chatName = toName + data.user;

                  chatData.find({chatName: chatName}, function (err1, data1) {

                    if (data1.length > 0) {

                      var update = {
                        to: data.toName,
                        from: data.user,
                        message: data.message
                      };


                      chatData.update({chatName: chatName}, {$push:{messages: update}}, function (err2, data2) {
                        if (err2) {console.log(err2);}
                        else {console.log(data2);}
                      });
                    }
                    else {
                      var update = new chatData({
                        chatName:chatName,
                        messages:{
                          to: data.toName,
                          from: data.user,
                          message: data.message}
                      });
                      update.save(function (error) {
                        console.log("Your data has been saved!");
                        if (error) {
                          console.error(error + " enter");
                        }
                      });
                    }
                  });
                }
                else if (toName < data.user){
                  console.log('False');

                  var chatName1 = data.user + toName;

                  chatData.find({chatName: chatName1}, function (err1, data1) {

                    if (data1.length > 0) {
                      var update = {
                        to: data.toName,
                        from: data.user,
                        message: data.message
                      };
                      chatData.update({chatName: chatName1}, {$push:{messages: update}}, function (err2, data2) {
                        if (err2) {
                          console.log(err2);
                        }
                        else {
                          console.log(data2);
                        }
                      });
                    }
                    else {
                      var update = new chatData({
                        chatName:chatName1,
                        messages:{
                        to: data.toName,
                        from: data.user,
                        message: data.message}
                      });
                      update.save(function (error) {
                              console.log("Your data has been saved!");
                              if (error) {
                                  console.error(error + " enter");
                              }
                          });
                    }
                  });
                }

                console.log(To);
                io.in(To).emit('new message', {user: data.user, message: data.message});
              io.in(From).emit('new message', {user: data.user, message: data.message});


    });

socket.on('disconnect', function () {
    var id = socket.id;


    usersData.update({socketId:id},{socketId:''},function (err1,data1) {
        if(err1){console.log(err1);}
        else{console.log(data1)}
    });

});
});




server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}



function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}



function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
