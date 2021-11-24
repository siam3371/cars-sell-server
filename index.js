// const express = require('express')
// const app = express()
// const port =process.env.PORT || 5000;
// const cors = require('cors')
// require('dotenv').config() 
// const ObjectId = require('mongodb').ObjectId;

const express = require('express');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(express.json());
app.use(cors());
//  const MongoClient = require('mongodb').MongoClient;  
// app.use(express.json()); 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c6mfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const products = client.db("cars_server");
    const product = products.collection("products");
    const reviewCollection = products.collection("allReviews");
    const ordersCollection = products.collection("orders");
    const userCollection = products.collection('users');
    //  GET API
    app.get('/products', async (req, res) => {
      const cursor = product.find({});
      const products = await cursor.toArray();
      res.send(products)
    })
    app.post('/products', async (req, res) => {
      const newService = req.body;
      const result = await product.insertOne(newService)
      console.log('add a user', result)
      res.json(result)
    })
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: ObjectId(id) };
      const result = await product.deleteOne(query);
      res.json(result);
    })
    app.post('/users', async (req, res) => {
      const users = req.body;
      users.status = 'normalUser';
      console.log('hitting ', users)
      const userResult = await userCollection.insertOne(users)
      res.json(userResult);
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const singleUser = await userCollection.findOne(query);
      let isAdmin = false;
      if (singleUser?.status === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })
       
    app.put('/users/:email', async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      console.log(filter);
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: 'admin'
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
      console.log('update is hitting', id);
    })
    //  GET API 
    app.get('/users', async (req, res) => {
      const newCursor = userCollection.find({})
      const result = await newCursor.toArray()
      res.json(result);
    })
    // POST API
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      console.log("docs hitted");
      res.json(result);
    })
    app.get('/reviews', async (req, res) => {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.json(reviews);
    })
    // my order 
    app.post('/orders/:id', async (req, res) => {
      const order = req.body;
      const id = req.params.id;
      order.id = id;
      const result = await ordersCollection.insertOne(order);
      // console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    })

    // update orders api
    app.put('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: 'Active'
        },
      };
      const result = await ordersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
      console.log('update is hitting', id);
    })

    // GET  orders api
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    })

    // DELETE API
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
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
