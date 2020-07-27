const jwt = require('jsonwebtoken')

// ++++++++++ Verificar Token

let verifyToken = ( req,res,next )=>{
    let token = req.get('Authorization');

    jwt.verify(token,process.env.SEED,(err,decoded)=>{

        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:"Token no valido"
                }
            });
        }

        req.user = decoded.user;
        next();
    })
};

let verifyUser = (req,res,next)=>{

    //!Usando el metodo decoded de jwt
    // let token = req.get('Authorization');
    // const decoded = jwt.decode(token);

    //Obteniendo la info desde el req guardado en la verificacion del token
    const userType = req.user.role;
        if(userType !== 'ADMIN_ROLE'){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"Usuario no autorizado"
                }
            });
        }
        next();
}


module.exports = {
    verifyToken,
    verifyUser
}