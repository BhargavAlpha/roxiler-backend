const express=require('express');
const app=express();
const cors=require('cors');
const dbConnect = require('./dbConnect');
const bodyParser = require('body-parser');
const {saveProducts,getProducts} = require('./controllers/productController');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));   

dbConnect();

app.post('/save-products',saveProducts);
app.get('/get-products',getProducts);


app.listen(process.env.PORT,()=>{
    console.log('Server is running on port 5000');
})


