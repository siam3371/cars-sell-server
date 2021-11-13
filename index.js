const express = require('express')
const app = express()
const port =process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config() 
// middleware

app.use(cors())
app.use(express.json())
 const MongoClient = require('mongodb').MongoClient;  
// app.use(express.json()); 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c6mfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 

async function run(){
    try{
           await client.connect();
       const products = client.db("cars_server");
       const product = products.collection("products");   
  //  GET API
       app.get('/products', async(req, res)=> {
        const cursor = product.find({});
     const products = await cursor.toArray();
             res.send(products) 
       }) 
      } 
    finally {
        // await client.close();
    }
     }
     run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to our car sales server')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
