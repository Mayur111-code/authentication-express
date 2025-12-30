const express = require('express');
const { register, login, logout, profile,  } = require('../controllers/authcontrollers');
const { authMiddleware } = require('../middlewares/authmiddlware');
const router = express.Router();

// router.get('/', (req, res) => {
//     res.send("good job you get our first route...!")
// })


router.post('/register', register);
router.post('/login', login)
router.post('/logout', logout);
router.get('/profile', authMiddleware, profile);


module.exports = router;