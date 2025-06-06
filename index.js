const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1gwegko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const plantCollection = client.db('planCareDB').collection('plants')

    const userCollection = client.db('plantCareDB').collection('users')


    app.get('/plants', async(req, res)=>{
      // const cursor = plantCollection.find();
      // const result = await cusrsor.toArray();
      // res.send(result)
      const result = await plantCollection.find().toArray();
      res.send(result)
    })
    
    
    
    app.post('/plants', async(req, res)=>{
      
      const newPlants = req.body;
      console.log(newPlants);

      const result = await plantCollection.insertOne(newPlants);
      res.send(result);
      
    })


    app.get('/plants/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await plantCollection.findOne(filter);
      res.send(result);
    });

    // ✅ PUT to update a plant
    app.put('/plants/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedPlant = req.body;
      const updatedDoc = {
        $set: updatedPlant
      };
      const result = await plantCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    app.delete('/plants/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await plantCollection.deleteOne(query);
        res.send(result);
    })




    // user related APIS
    app.get('/users', async(req, res)=>{
      const result = await userCollection.find().toArray();
      res.send(result);
    })





    app.post('/users', async(req, res)=>{
      const userProfile =req.body;
      console.log(userProfile);
      const result = await userCollection.insertOne(userProfile);
      res.send(result);
      
    })


    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Plant Care Tracker')
})

app.listen(port, ()=>{
    console.log(`plant care server is running ${port}`)
    
})