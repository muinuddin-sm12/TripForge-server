const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000

// middleware
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://tripforge-b9a10.web.app",
    "https://b9-a10-client-side-muinuddin-sm12.vercel.app/"
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ff1pkvw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const infoCollection = client.db('tripforge').collection('info')
    const countryCollection = client.db('tripforge').collection('country')


    app.post('/spot-info', async(req, res) => {
        const info = req.body;
        console.log(info)
        const result = await infoCollection.insertOne(info)
        res.send(result)
    })
    app.get('/spot-info', async(req, res) => {
        const cursor = infoCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    app.delete('/spot-info/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await infoCollection.deleteOne(query)
        res.send(result)
    })
    app.get('/spot-info/:id', async (req, res) => {
      const id = req.params.id;
      const result = await infoCollection.findOne({_id: new ObjectId(id)})
      res.send(result)
    })

    app.put('/spot-info/:id', async(req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updateData = {
         $set : {
          img_url : data.img_url,
        spotName : data.spotName,
        countryName : data.countryName,
        location : data.location,
        description : data.description,
        cost : data.cost,
        season : data.season,
        travelTime : data.travelTime,
        totalVisitors : data.totalVisitors,
        email : data.email,
        userName : data.userName
      }
    }
    const result = await infoCollection.updateOne(filter, updateData, options)
    res.send(result)
    });



    app.get('/countries', async(req, res) => {
      const countries = await countryCollection.find().toArray();
      // console.log(countries)
      res.send(countries)
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
    res.send('TripForge is running.....')
})
app.listen(port, ()=> {
    console.log(`TripForge is running on PORT: ${port}`)
})