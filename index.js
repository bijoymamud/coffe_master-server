const express = require('express');
const cors = require('cors')
//for hiding pass and username 
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middlewire
app.use(cors());
app.use(express.json())




//!connecting mongoDB code

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.vrgzzke.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);


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

        //! 1st for receiving data from the form after taking the values from the input 


        const database = client.db('coffeeDB');
        const coffeeCollection = database.collection('coffee');


        //create kora data gulo UI te dekhanor jonno
        //data read korar jnno
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();

            //jto gula items ache sob gula diye dbe
            const result = await cursor.toArray();
            res.send(result)

        })


        //update korar jnno specific id dhore update korbo
        //update korar jnno app.get use kore
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);

        })

        //button a click kore id/items delete kroar jonno
        //specific akta id delete korbo

        app.delete('/coffee/:id', async (req, res) => {
            //kun id delete korbo oi id ta niye nei

            const id = req.params.id;
            //ObjectId er moddhe delete howa id ta pathai dbo
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/coffee', async (req, res) => {

            //coffe ta kothai theke nibo? req.body theke
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result)
            //!1st server site theke mongoDB the data pathano hyse. akhn mongoDb theke client server a data show korbo
        })


        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const coffee = {
                $set: {

                    name: updatedCoffee.name,
                    quantity: updatedCoffee.quantity,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo

                },
            };

            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
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


//! mongoDB connention end here





//server coltase kina check er jonno
app.get('/', (req, res) => {
    res.send("Coffe Shop Server is running")
})

app.listen(port, () => {
    console.log(`Coffe Shop Server is running on port: ${port}`);
})