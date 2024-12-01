require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expPino = require('express-pino-logger');
const logger = require('./middlewares/logger');
const mongoConnect = require('./config/mongoConfig');
const productRoutes = require('./routes/productRoutes');


const app =express()

app.use(expPino({ logger }));
app.use((req, res, next) => {
    res.set('Timing-Allow-Origin', '*');
    res.set('Access-Control-Allow-Origin', '*');
    next();
});


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


// app.use('/products'.productRoutes)
app.get('/health', (req,res)=>{
    console.log(mongoConnect.mongoConnected)
    const stat={
        app:'OK',
        mongo: mongoConnect.mongoConnected,
    }

    res.json(stat)
})
app.use('/api', productRoutes); 



const port=process.env.CATALOGUE_SERVER_PORT || 8080;
app.listen(port,()=>{
    logger.info('Started on Port',port);
})