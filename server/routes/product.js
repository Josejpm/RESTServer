const express = require('express');
const {verifyToken, verifyUser} = require('../middlewares/auth')
const app = express();
const _=require('underscore')
let Product = require('../models/product')


module.exports = app;

//peticion get para obtener todos los prouctos
 //* trae todos los productos, usando populate cargando el usuario y la categoria, paginado

 app.get('/product',verifyToken,(req,res)=>{
    let from = req.query.from || 0
    from = Number(from);
    let perPage = req.query.perPage || 0
    perPage = Number(perPage)


    Product.find({})
        .skip(from)
        .limit(perPage)
        .populate('user','name email')
        .populate('category','description')
        .exec((err,productsDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                productsDB
            })
        })
 });

 //peticion get para obtener productos por categoria

  app.get('/product/:id',verifyToken,(req,res)=>{
    productId = req.params.id;

    Product.findById(productId)
        .populate('user','name email')
        .populate('category','description')
        .exec((err,productDB)=>{
            if(err){
                return res.status(404).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                productDB
            })
            
        })



  })

  //peticion get para busqueda de productos por parametros
  app.get('/product/search/:term',verifyToken,(req,res)=>{

    const term = req.params.term;
    const regExp = new RegExp(term,'i')

    Product.find({name:regExp})
        .populate('category','description')
        .exec((err,products)=>{

            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            // if(!products){
            //     return res.status(404).json({
            //         ok:false,
            //         err:{
            //             message:'No se encontraron resultados'
            //         }
            //     })
            // }
    
            res.json({
                ok:true,
                products
            })

        })
        

  })


  

// peticion post para crear un nuevo producto
app.post('/product',verifyToken, (req,res)=>{
    const body = req.body;
    const user = req.user._id  


    const product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.category,
        user
    });

    product.save((err,productDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            productDB
        });
    })


})

//peticion put para poder actualizar un producto

 app.put('/product/:id',verifyToken,(req,res)=>{
    const productId = req.params.id;

    Product.findByIdAndUpdate(productId,req.body,{new:true},(err,productDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            productDB
        })

    })



 })



//borrar un producto
 //* no borrarlo totalmente de la base de datos, colocarlo como deshabilitado
app.delete('/product/:id',verifyToken,verifyUser,(req,res)=>{

    productId = req.params.id;

    Product.findByIdAndUpdate(productId,{available:false},{new:true},(err,deletedDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!deletedDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            deletedDB
        })

    })



})

