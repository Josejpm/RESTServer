require('./config/config') // Contiene las configuraciones del servidor
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//Instancia de express
const app = express();

//Configuracioon de bodyParser con x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
//Configuracioon de bodyParser con application/json
app.use(bodyParser.json());

//Llamado para el uso global de las rutas
app.use(require('./routes/index'));


// Conexion del servidor a la BD con mongoose
mongoose.connect(process.env.URLDB,{
    useUnifiedTopology: true,
    useNewUrlParser: true
},(err,res)=>{
    if(err) throw err;

    console.log('Base de datos ONLINE')
})

app.listen(process.env.PORT,()=>{
    console.log(`Active Port ${process.env.PORT} `)
})
