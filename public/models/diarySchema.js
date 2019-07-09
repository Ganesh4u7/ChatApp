var mongoose = require('mongoose');
var schema = mongoose.Schema;

var diaryData = new schema({

    Date: { type : Date, default: Date.now },
    description: String,
    content: String

});

module.exports = diaryData;