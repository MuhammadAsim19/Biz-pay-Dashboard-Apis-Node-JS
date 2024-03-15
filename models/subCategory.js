let mongoose = require('mongoose');

let subCategorySchema = new mongoose.Schema({
    title: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    icon:{
        type:String,
        default:null
    },
    backgroundcolor:{
        type:String,
        required:true

    },
    childSubCategories : [{
        type: mongoose.Types.ObjectId, ref: 'Childsubcategory'
    }],
},{ timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);