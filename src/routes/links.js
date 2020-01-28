const express = require('express');
const router = express.Router();

//Referencia ala conexion de la Base de Datos
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

//Cuando el navegador pida una peticion get al servidor
router.get('/add', isLoggedIn, (req, res) => {
res.render('links/add');
});

router.post('/add', isLoggedIn, async (req,res) =>{ //para que await funcione esta que es la funcion principal debe tener la palabra , async 
//Destructurin--Ultimos metodos utilizados en JavaScript
const { title, url, description } = req.body;       
// Guardalos en Nuevo Objeto
const newLink = {
    title,
    url,
    description,
    user_id: req.user.id
};
await pool.query('INSERT INTO links set ?', [newLink]); //Como la conexion es asincrona tomara su tiempo en responder por eso utilizamos 
//console.log(newLink);
//console.log(req.body); //-- para ver lo que se typea..el objeto en la base de datos 
//    res.send('received'); -- Funciona para saber que el mensaje ha sido recivido
req.flash('success', 'Order saved successfully');//al utilizar flash como middliware lo utilizamos con'req.' y toma 2 parametros 1 el nombre del mensaje 2 el valor del mensaje.
res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]); //pool query consulta ala base de Datos
console.log(links); //Mensaje por consola
// re.send('Listas iran Aqui');  enviamos respuestas al servidor
res.render('links/list', { links }); // Estoy renderizando la caperta links que contiene el archivo o vista list
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
const { id } = req.params;
await pool.query('DELETE FROM links WHERE ID = ?', [id]); // pool-query eliminar con await
req.flash('success', 'Order Removed successfully');
res.redirect('/links');
//Prueba para ver si nos envia ala direccion del Id    
//console.log(req.params.id);
//res.send('Su Tarjeta Fue Eliminada Con Exito');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
const { id } = req.params;
//await pool.query('')
 const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]); // Este pool-query-asincrono nos envia el id del obejeto const id
 res.render('links/edit', {link: links[0]} ); //Renderizar/links/edit y heredar linsk de links
//console.log(links[0]); mandamos para ver en consola con un parametro.
//Prueba de Edit para verificar sinos envia recibido
//console.log(id);
//res.send('received');
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
const { id } = req.params;
const {title, url, description} = req.body;
const newLink ={
title,
url,
description
};
await pool.query('UPDATE links set ? WHERE id = ?',[newLink, id]);// actualizar los datos y el id.
req.flash('success', 'Order Updated Successfully');
res.redirect('/links');// redireccionamos a links para que se vea la actulizacion.
});
//console.log(newLink);mensaje por consola
//res.send('Update'); Message Update
module.exports = router;