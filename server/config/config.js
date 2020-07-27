//* ================= Config del puerto

process.env.PORT = process.env.PORT || 3000;


//* ================= Config del entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


let urlDB;

if(process.env.NODE_ENV ==='dev'){
    urlDB= 'mongodb://localhost:27017/cafe'
}else{
    urlDB=process.env.MONGO_URL
}

process.env.URLDB = urlDB;


//* ================= Config del vencimiento del token
// 60 seg x 60 min x 2 horas
process.env.TOKEN_EXPIRATION = 60 * 60 * 2


//* ================= Config del seed de autenticacion
process.env.SEED = process.env.SEED || 'secret-in-development'



