const express = require('express');
const app =  express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoute = require('./routes/auth.route')
dotenv.config();
connectDB()




app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/auth', authRoute);



app.get('/', (req, res) => {
    res.send('Hey form server')
});

const port = process.env.PORT
const host = process.env.HOST

 app.listen(port, host, ()=>{
    console.log(`http://${host}:${port}`)
});