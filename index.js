const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.szs3oxm.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db('petservices');
    const servicesCollection = database.collection('services');
    const orderscollection = database.collection('orders');

    // service related apis
    app.post('/services', async (req, res) => {
      const data = req.body;
      const date = new Date();
      data.CreatedAt = date;
      const result = await servicesCollection.insertOne(data);
      res.send(result);
    });

    app.get('/services', async (req, res) => {
      const { category } = req.query;
      let query = {};
      if (category) {
        query = { category: category };
      }
      const result = await servicesCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    app.get('/myservices', async (req, res) => {
      const { email } = req.query;
      const query = { email: email };
      const result = await servicesCollection.find(query).toArray();
      res.send(result);
    });

    app.put('/updateListing/:id', async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: data
      };
      const result = await servicesCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.delete('/deleteListing/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });

    // order related apis
    app.post('/orders', async (req, res) => {
      const data = req.body;
      const result = await orderscollection.insertOne(data);
      res.send(result);
    });

    app.get('/orders', async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { email: email };
      }
      const result = await orderscollection.find(query).toArray();
      res.send(result);
    });

    console.log("Connected to MongoDB");
  } finally {
    // client.close() 
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Paw Mart server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;