const express = require('express');
const { register } = require('../controllers/authcontrollers');
const router = express.Router();

// router.get('/', (req, res) => {
//     res.send("good job you get our first route...!")
// })


router.post('/register', register);

module.exports = router;