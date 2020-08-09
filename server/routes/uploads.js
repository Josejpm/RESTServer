const express = require('express');
const fileupload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const Product = require('../models/product');
const { result } = require('underscore');

const app = express();

app.use(fileupload());

app.put('/upload/:type/:id',(req,res)=>{

    const type= req.params.type;
    const id = req.params.id

    if(!req.files){
        return res.status(400).json({
            ok:false,
            err:{
                message:'No se cargo ningun archivo'
            }
        })
    }

    //Tipos de parametros por url
    const validTypes = ['products','users',];

    if( validTypes.indexOf(type) <0 ){
        return res.status(400).json({
            ok:false,
            message:'Busqueda incorrecta, los tipos permitidos son users o products'
        })
    }

    //Extensiones permitidas
    const validExtensions = ['png','jpg','gif','jpeg'];

    const file = req.files.file;
    const fullName = file.name.split('.');
    const fileName = fullName
    let fileExtension = fullName[fileName.length-1];

    const validExt = validExtensions.filter(ext=>ext === fileExtension);
    if(validExt.length === 0) {
        return res.status(400).json({
            ok:false,
            message:'El archivo que intentas subir no esta permitido'
        })
    }

    //Nombre al archivo
    const fileN = `${id}-${new Date().getMilliseconds()}.${fileExtension}`


    file.mv(`uploads/${type}/${fileN}`,(err)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        type === 'users' ? userImage(id,res,fileN) : productImage(id,res,fileN);

    });
});

function userImage(id,res,fileName){
    User.findById(id,(err,userDB)=>{

        if (err){

            deleteFile(fileName,'users');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!userDB){
            deleteFile(fileName,'users');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no encontrado'
                }
            })
        }

        deleteFile(userDB.image,'users');

       
        userDB.image = fileName
        userDB.save((err,savedUser)=>{
            res.json({
                ok:true,
                savedUser,
                img: fileName
            })
        })

    })

}

function productImage(id,res,fileName){
    Product.findById(id, (err,productDB)=>{

        if(err){
            deleteFile(fileName,'products');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productDB){
            deleteFile(fileName,'products');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Producto no encontrado'
                }
            });
        }

        deleteFile(productDB.image,'products');


        productDB.image = fileName;
        productDB.save((err,savedProduct)=>{
            res.json({
                ok:true,
                savedProduct,
                img: fileName
            })
        })
    })

}

function deleteFile(file,folder){

     //Verificar la ruta del archivo
     const imagePath = path.resolve(__dirname , `../../uploads/${folder}/${file}`);
     if(fs.existsSync(imagePath)) fs.unlinkSync(imagePath)

}

module.exports = app