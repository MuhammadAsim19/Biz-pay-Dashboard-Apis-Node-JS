let mongoose = require('mongoose');

let categorySchema = new mongoose.Schema({
    title: {
        type: String
    },
    icon: {
        type: String,
        default:null
    },
    backgroundcolor:{
        type:String,
        required:true

    },
    subCategories : [{
        type: mongoose.Types.ObjectId, ref: 'SubCategory'
    }],
    
},{ timestamps: true });

module.exports = mongoose.model('Category', categorySchema);