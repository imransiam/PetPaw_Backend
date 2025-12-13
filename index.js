const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = 5000;


const app = express();
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://PawMart:1tJH9uevLwTm63tm@cluster0.szs3oxm.mongodb.net/?appName=Cluster0";

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

    const database = client.db('petservices');
    const servicesCollection = database.collection('services');

// post or save services to database
    app.post('/services', async (req, res) => {
  const data = req.body;
  const date = new Date();
  data.CreatedAt = date;
  console.log("Received:", data);
  const result = await servicesCollection.insertOne(data);
  res.status(200).send(result);
});
// get or fetch services from database

    app.get('/services', async (req, res) => {
  const { category } = req.query;  // optional query param
  let query = {};

  if (category) {
    query = { category };  // filter by category
  }

  try {
    const result = await servicesCollection.find(query).toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});


    app.get('/services/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    })

    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Paw Mart is running');
});

app.listen(port, () => {
  console.log(`Paw Mart server is running on port: ${port}`);
});