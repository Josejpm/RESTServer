require('./config/config') // Contiene las configuraciones del servidor
const express = require('express');
const bodyParser = require('body-parser');


//Instancia de express
const app = express();

//Configuracioon de bodyParser con x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
//Configuracioon de bodyParser con application/json
app.use(bodyParser.json());


app.get('/user', (req,res)=>{
    res.json('get user')
});
app.post('/user', (req,res)=>{
    const body=req.body;

    if(body.name === undefined){
        res.status(400).json({
            ok:false,
            msg:'Missing parameter in your request'
        })
    }else{
        res.json({
            user:body
        })
    }

    
});
app.put('/user/:id', (req,res)=>{
    //Para obtener los parametros desde el url se usa req.params.id, siendo id el definido en el URL de la peticion
    const userId = req.params.id
    res.json({
        userId
    });
    
});
app.delete('/user', (req,res)=>{
    res.json('delete user')
});




app.listen(process.env.PORT,()=>{
    console.log(`Active Port ${process.env.PORT} `)
})
