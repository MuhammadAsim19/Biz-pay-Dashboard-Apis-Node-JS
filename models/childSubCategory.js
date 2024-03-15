let mongoose = require('mongoose');

let childsubCategorySchema = new mongoose.Schema({
    title: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
    },
    icon:{
        type:String,
        default:null
    },
    backgroundcolor:{
        type:String,
        required:true

    }
},{ timestamps: true });

module.exports = mongoose.model('Childsubcategory', childsubCategorySchema);