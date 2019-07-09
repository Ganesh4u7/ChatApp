var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");

var dairySchema = require('../../public/models/diarySchema');
var dairy = mongoose.model('DairyData',dairySchema);

router.post('/DiaryPage', function (req,res) {

    var date = req.body.date;
    var subject = req.body.subject;
    var content = req.body.content;

    var dairyData = new dairy({
        subject:subject,
        content:content
    });

   dairyData.save(function (error) {

         if(error){ console.log(error);}
         else {console.log("Dairy Data Saved");}

   });
   res.send("Data Saved");

});

module.exports = router;