var mongoose = require('mongoose');
var schema= mongoose.Schema;

var usersData = new  schema({
    username:{
      type:String,
      unique:true,
      required:true
    },
    email:{
      type:String,
      unique: true,
      required: true
    },
    password:String,
    socketId:String,
    url:String,
    activity:Boolean
});

module.exports = usersData;
