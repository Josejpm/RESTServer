const express = require('express');
let {verifyToken, verifyUser} = require('../middlewares/auth');
let Category = require('../models/categories');
const _ = require('underscore');
const app = express();

//*Todas las peticiones deben ser ejecutadas por usuarios registrados

//Peticion get que trae todas las categorias de los productos
app.get('/categories',verifyToken,(req,res)=>{

    Category.find()
            .populate('user','name state email')
            .sort('description')
            .exec((err,categoriesDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }
                res.json({
                    ok:true,
                    categoriesDB
                })
            })
})



//Peticion get que trae una categori dependiendo de su id

app.get('/categories/:id',verifyToken,(req,res)=>{
    let categoryId = req.params.id;
    console.log(categoryId)

    Category.findById(categoryId,(err,categoryDB)=>{
         if(err){
             return res.status(404).json({
                 ok:false,
                 err
             })
         }

         if(!categoryDB){
            return res.status(404).json({
                ok:false,
                err:{
                    message:'Id no valido para una categoria'
                }
            })
         }

         res.json({
             ok:true,
             categoryDB
         })

    })
});


//Peticion post para crear categorias
app.post('/categories',[verifyToken,verifyUser],(req,res)=>{
    const body = req.body
    const user = req.user._id

    const category = new Category({
        description: body.description,
        user
    })

    category.save((err, categoryDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            category:categoryDB
        })
    })


})



//Peticion put para actualizar la categoria
app.put('/categories/:id',[verifyToken,verifyUser],(req,res)=>{
    const modifyId = req.params.id;

    const body = _.pick(req.body,['description']);

    Category.findByIdAndUpdate(modifyId,body,{new:true},(err,modifiedDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            modifiedDB
        })
    })
})


//Peticion delete para eliminar una cateogria dado su id

app.delete('/categories/:id',[verifyToken,verifyUser],(req,res)=>{
    const deleteId = req.params.id;

    Category.findByIdAndDelete(deleteId,(err,deletedDB)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            deleted: deletedDB
        })

    })



})




module.exports = app;


