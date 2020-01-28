const bcrypt = require('bcryptjs');

const passport = require("passport");

const helpers = {};
//metodo de registrar
helpers.encryptPassword = async (password) => {
const salt = await bcrypt.genSalt(10); // generar un hash entre mas veces lo ejecutemos sera mas seguro pero demorara mas en ejecutar 10 es algo aceptable porque es una funcion asincrona
const hash = await bcrypt.hash(password, salt);
return hash;
};// metodo o funcion para cifrar contraseña que esta en texto plano.

//metodo de logeo cuando la contraseña esta encryptada en la base de datos
helpers.matchPassword = async (password, savedPasword) =>{
try{
  return  await bcrypt.compare(password, savedPasword);
} catch(e){
    console.log(e);
}

};
module.exports = helpers;