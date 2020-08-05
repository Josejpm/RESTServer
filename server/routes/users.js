const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const {verifyToken,verifyUser} = require('../middlewares/auth')


app.get('/user', verifyToken ,(req,res)=>{

    //Con req.query puedo recibir datos via URL o parametro en la peticion get
    let from = req.query.from || 0
    from = Number(from);
    let perPage = req.query.perPage || 0
    perPage = Number(perPage)

    // .find encuentra los documentos de una coleccion dependiendo del objeto e configuracion, en donde filtra segun los campos del documento
    // . skip salta la cantidad de documentos indicados
    // .limit muestra la cantidad de documentos indicada
    // .exec ejecuta todas las funciones
    User.find({state:true},'name email image role google state')
        .skip(from)
        .limit(perPage)
        .exec( (err,users)=>{

            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            // .count cuenta la cantidad de documetos que coincidan segun el objeto de configuracion
            User.count({state:true},(err,total)=>{

                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    users,
                    total
                })
            })

            
        } )

});

app.post('/user',[verifyToken,verifyUser], (req,res)=>{
    const body=req.body;
    
    let user = new User({
        name:body.name,
        email:body.email,
        password:bcrypt.hashSync(body.password, 10),
        role:body.role 
    });

    user.save ( (err,DBuser)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        // user.password = null;  Es una forma de no enviar el pass como respuesta
        res.json({
            ok:true,
            user:DBuser
        });
    });

});

app.put('/user/:id',[verifyToken,verifyUser], (req,res)=>{
    //Para obtener los parametros desde el url se usa req.params.id, siendo id el definido en el URL de la peticion
    const userId = req.params.id
    //const body = req.body

    //Liberia que escoge que se va a traer de un objeto, es decir lo que se permite modificar
    const body = _.pick(req.body,['name','email','image','role','state']);


    //! la siguiente sintaxis elimina del objeto los campos pass y google evitando que se mdifiquen
        //Esta forma es poco eficiente si se tienen muchos campos, por lo que se usa la libreria underscore (revisar documentacion)
    // delete body.password;
    // delete body.google;

    //!Metodo para modificar el registro en la BD
    User.findByIdAndUpdate (userId, body, {new:true,runValidators:true}, (err,userDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            userDB
        });
    });
});

app.delete('/user/:id',[verifyToken,verifyUser], (req,res)=>{
    
    let id = req.params.id;
    
    let newState = {
        state:false
    }

    User.findByIdAndUpdate(id, newState, {new:true},  (err,deletedUser)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        };

        if(!deletedUser){
            return res.json({
                ok:false,
                err:{
                    message:'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok:true,
            deletedUser
        })

    })


    //!Borrar un usuario de la base de datos
    // User.findByIdAndRemove(id, (err,deletedUser)=>{

    //     if(err){
    //         return res.status(400).json({
    //             ok:false,
    //             err
    //         });
    //     }

    //     if(deletedUser === null){
    //         return res.status(400).json({
    //             ok:false,
    //             err:{
    //                 message:'Usuario no encontrado'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok:true,
    //         deletedUser
    //     })
    // })


});

module.exports = app