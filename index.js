const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express();

//MiddleWare & Body Parser
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;



//Uri and Database String

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luy9u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

     try{

          await client.connect();
          console.log('Database Connect succesfully')

          const database = client.db("cycle_shope");
          const productsCollection = database.collection("products");
          const ordersCollection = database.collection("orders");
          const usersCollection = database.collection("users");
          const reviewsCollection = database.collection("reviews");
          
          //GET API ALL PRODUCTS
          app.get('/products', async(req, res)=>{
               const cursor = productsCollection.find({});
               const page = req.query.page;
               const size = parseInt(req.query.size);
               const count = await cursor.count()
               let products;
               if (page) {
                    products = await cursor.skip(page*size).limit(size).toArray()
               }else{
                  const products = await cursor.toArray();
               }
               
               
               res.json({
                    count,
                    products
                  })
          });

          //GET APPI DATA WITH ID
          app.get('/products/:id', async(req, res)=>{
               const id = req.params.id;
               const query = {_id: ObjectId(id)}
               const result = await productsCollection.findOne(query)
               res.json(result)
          })

          //Post order
          app.post('/addOrders', async(req, res)=>{
               const addOrder = req.body;
               const result = await ordersCollection.insertOne(addOrder)
               res.json(result)
          })
          //Post on Products collection 
          app.post('/products', async(req, res)=>{
               const product = req.body;
               const result = await productsCollection.insertOne(product)
               res.json(result)
          })

          //Get all ORders
          app.get('/allOrders', async(req, res )=> {
               const cursor = ordersCollection.find({})
               const result = await cursor.toArray()
               res.json(result)
          })
         
          //Get data with email query
          app.get('/addOrders', async(req, res)=>{
               const email = req.query.email;
               const query = {email: email};
               const cursor = ordersCollection.find(query)
               const result = await cursor.toArray()
               res.json(result)
          })

          //GET SINGLE Servise With id
          app.get('/addOrders/:id', async(req, res)=>{
          const id = req.params.id;
          console.log('Hitting the id', id);
          const query = { _id: ObjectId(id)}
          const result = await ordersCollection.findOne(query)
          res.json(result)
          })

          //Delete api
          app.delete('/addOrders/:id', async(req, res)=>{
               const id = req.params.id;
               const query = { _id: ObjectId(id)};
               const result = await ordersCollection.deleteOne(query)
               res.json(result)
          })

          //saved user on Db
          app.post('/users', async(req, res)=>{
               const user = req.body;
               const result = await usersCollection.insertOne(user)
               res.json(result)
          })

           //Upsert google login
           app.put('/users', async(req, res) =>{
               const user = req.body;
               const filter = {email: user.email};
               const options= { upsert: true};
               const updateDoc = {$set: user};
               const result = await usersCollection.updateOne(filter, updateDoc, options);
               res.json(result)
          });

          //Post Reviews
          app.post('/reviews', async(req, res)=>{
               const review = req.body;
               const result = await reviewsCollection.insertOne(review)
               res.json(result)
          })

          //Get review with email query
          app.get('/reviews', async(req, res)=>{
               const review = req.body; 
               const cursor = reviewsCollection.find(review)
               const result = await cursor.toArray()
               res.json(result)
          })

          //Make Admin
          app.put('/users/admin', async(req, res)=>{
               const user = req.body;
               const filter = {email : user.email};
               const updateDoc = {$set:{role : 'admin'}};
               const result = await usersCollection.updateOne(filter, updateDoc)
               res.json(result)
          })

          //Admin dashboard conditionally rander
          app.get('/users/:email', async(req, res) =>{
               const email = req.params.email;
               const query = {email: email};
               const user = await usersCollection.findOne(query)
                let isAdmin = false;
               if(user?.role === 'admin'){
                    isAdmin = true;
               }
               res.json({admin: isAdmin});
          })

          

     }
     finally {
     //  await client.close();
     }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
     res.send('Running On The Velo Cycle Server')
});

app.listen(port, ()=>{
     console.log('Listening  the server port', port)
})