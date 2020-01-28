const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
// hay que renderizar el index
res.render('index');    
//res.send('hello World');
});

module.exports = router;
