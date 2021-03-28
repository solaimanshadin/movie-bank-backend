
const express = require('express');
const cors = require('cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
app.use(express.json());
app.use(cors());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

client.connect((err) => {
    if (err) {
        console.log("DB Connect Error", err)
    } else {
        const Booking = client.db('movie_bank').collection('bookings');

        app.get('/', (req, res, next) => {
            res.json({ message: "Hello world!" })
        })

        app.post('/book', (req, res, next) => {
            const data = req.body;
            Booking.insertOne(data)
            .then(data => {
                res.json({success: !!data.result.ok})
            })
        });

        app.delete('/booking/:id', (req, res, next) => {
            const id = ObjectID(req.params.id);

            Booking.findOneAndDelete({_id: id})
            .then(data => {
                res.json({success: !!data.value})
            })
        });

        app.get('/bookings', (req, res) => {
            const query = req.query;
            console.log(query)
            Booking.find(query).toArray((err, data) => {
                res.json({ data });
            })
        });


        app.use((req, res) => {
            res.status(404).json({ message: "Not found!" })
        });

    }
})

app.listen(8080, () => console.log("Server is running on port 8080"))