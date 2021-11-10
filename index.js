const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express();

//MiddleWare & Body parser
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;



//Uri and Database string

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luy9u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

     try{

          await client.connect();
          console.log('Database Connect succesfully')

          const database = client.db("cycle_shope");
          const productsCollection = database.collection("products");
          
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

     }
     finally {
     //  await client.close();
     }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
     res.send('Running my Velo Cycle Server')
});

app.listen(port, ()=>{
     console.log('Listening server port', port)
})