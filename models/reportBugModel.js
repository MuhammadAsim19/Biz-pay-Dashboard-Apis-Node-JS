let mongoose = require('mongoose');

let reportBugSchema = new mongoose.Schema({
    title : String,
    description : String,
    userReff :{type: mongoose.Types.ObjectId, ref: 'User' },
    status: {type:String , enum:['pending' , 'checking' , 'solved'] , default:'pending' },
    files : [String],
    
},{ timestamps: true });

module.exports = mongoose.model('ReportBug', reportBugSchema);