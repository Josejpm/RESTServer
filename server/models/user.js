const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let validRoles = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let userSchema = new Schema({
    name: {
        type: String,
        required:[true,'Name is required']
    },
    email:{
        type: String,
        unique:true,
        required: [true,'Email is required']
    },
    password:{
        type: String,
        required: [true,'Password id required']
    },
    image:{
        type: String,
        required: false
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum: validRoles
    },
    state:{
        type: Boolean,
        default:true
    },
    google:{
        type: Boolean,
        default:false
    }
});

//!Metodo para eliminar el password como respuesta de la BD
userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject
}

//!unique validator para dar respuesta en caso de que el email este repetido
userSchema.plugin( uniqueValidator, { message:'{PATH} debe ser unico' })

module.exports = mongoose.model('User',userSchema)