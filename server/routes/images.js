const express = require('express');
const fs = require('fs');
const path = require('path')
const {verifyURLToken} = require('../middlewares/auth');

const app = express();

app.get('/images/:type/:image',verifyURLToken,(req,res)=>{

    const type = req.params.type;
    const image = req.params.image;
    const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    const imagePath = path.resolve(__dirname, `../../uploads/${type}/${image}` );

    fs.existsSync(imagePath) ? res.sendFile (imagePath) : res.sendFile (noImagePath)

});





module.exports = app;