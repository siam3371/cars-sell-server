const express = require('express')
const app = express()
const port =process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config() 
// middleware 
app.use(cors())
app.use(express.json())
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
       const reviewCollection = products.collection("allReviews");
  //  GET API
       app.get('/products', async(req, res)=> {
        const cursor = product.find({});
     const products = await cursor.toArray();
             res.send(products) 
       })
      // POST API
      app.post('/reviews', async(req, res)=>{
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        console.log("docs hitted");
        res.json(result);
      })
      app.get('/reviews', async(req, res)=>{
        const cursor = reviewCollection.find({});
        const reviews = await cursor.toArray();
        res.json(reviews);
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
