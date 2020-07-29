const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user');
const app = express();

const {OAuth2Client} = require('google-auth-library');
const user = require('../models/user');
const client = new OAuth2Client(process.env.CLIENT_ID);


app.post('/login', (req,res)=>{

    const body = req.body;

    User.findOne({email:body.email},(err, userDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!userDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: ' (Usuario) o password incorrecto '
                }
            })
        }

        if ( !bcrypt.compareSync (body.password,userDB.password) ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: ' Usuario o (password) incorrecto '
                }
            })
        }

        let token = jwt.sign({
            user:userDB
        },process.env.SEED,{expiresIn: Number(process.env.TOKEN_EXPIRATION) });

        res.json({
            ok:true,
            user: userDB,
            token
        })

    })
})

//* Configuracin de google sign in

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // console.log(payload.name);
    // console.log(payload.picture);
    // console.log(payload.email);
    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    }


  }

app.post('/google', async (req,res)=>{
    let token = req.body.idtoken
    let googleUser = await verify(token)
                    .catch(err=>{
                        return res.status(403).json({
                            ok:false,
                            err:{
                                message: ' Non valid User '
                            }
                        })
                    });

    User.findOne ({email: googleUser.email}, (err,userDB)=>{
        
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (userDB){

            if(userDB.google === false){
                
                return res.status(400).json({
                    ok:false,
                    err:{message:'Ya estas registado con tu acreditacion por email'}
                });

            } else {
                let token = jwt.sign({
                    user:userDB
                }, process.env.SEED, {expiresIn: Number(process.env.TOKEN_EXPIRATION) } )

                return res.json({
                    ok:true,
                    user:userDB,
                    token
                })

            }
        } else {
            //Si el usuario no existe en la base de datos

            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.image = googleUser.image;
            user.google = true;
            user.password = ':)';

            user.save( (err,userDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }

                let token = jwt.sign({
                    user:userDB
                }, process.env.SEED, {expiresIn: Number(process.env.TOKEN_EXPIRATION) } )

                return res.json({
                    ok:true,
                    user:userDB,
                    token
                })
                
            } )

        }
    })
})



module.exports = app