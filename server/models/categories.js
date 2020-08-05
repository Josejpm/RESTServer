const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriesSchema = new Schema({
    description: {
        type: String,
        unique:true,
        required:[true,'La descripcion es requerida']
    },
    user:{
        type: Schema.Types.ObjectId,ref:'User'
    }

});

module.exports = mongoose.model('Categories',categoriesSchema)
