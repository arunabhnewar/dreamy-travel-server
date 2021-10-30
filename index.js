// import
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
// const ObjectId = require('mongodb').ObjectId;

// port
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qi34s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("dreamy_travel");
        const vacationCollection = database.collection("vacations");
        const orderCollection = database.collection('orders');

        // GET API
        app.get('/vacations', async (req, res) => {
            const cursor = vacationCollection.find({});
            const vacations = await cursor.toArray();
            res.send(vacations);
        })
        // Add Orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.send(result);
        })
        // GET Orders API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            console.log(order);
            res.send(order);
        })
        // DELETE Orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: (id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


// root
app.get('/', (req, res) => {
    res.send('Running server successfully');
})

app.listen(port, () => {
    console.log('Running server on port', port);
})