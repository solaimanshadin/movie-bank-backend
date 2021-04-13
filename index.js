
const express = require('express');
const cors = require('cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
app.use(express.json());
app.use(cors());
const admin = require("firebase-admin");

const serviceAccount = require("./firebaseCred.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

client.connect((err) => {
    if (err) {
        console.log("DB Connect Error", err)
    } else {

        const getUser = (req) => {
            const token = req.headers.authorization;

            return admin
            .auth()
            .verifyIdToken(token)
            .then((decodedToken) => {
                return decodedToken
            })
        }

        const authCheck = (req, res, next) => {
            const token = req.headers.authorization;
            console.log(token)
            if(!token) {
                res.status(401).json({message: "Unauthorized !"})
            }else{
                admin
                .auth()
                .verifyIdToken(token)
                .then((decodedToken) => {
                    console.log(decodedToken)
                    next()
                    // ...
                })
                .catch((error) => {
                    res.status(401).json({message: "Unauthorized !"})
                });
            }

            
        }

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

        app.delete('/booking/:id', authCheck, (req, res, next) => {
            const id = ObjectID(req.params.id);
            
            Booking.findOneAndDelete({_id: id, bookedBy: user.email})
            .then(data => {
                res.json({success: !!data.value})
            })
        });

        app.get('/bookings', authCheck,  async (req, res, next) => {
            
            const user = await getUser(req);
            console.log(user)
            
            Booking.find({bookedBy: user?.email}).toArray((err, data) => {
                res.json({ data });
            })

            // next()   // This next call was the case of app crash

        });


        app.use((req, res) => {
            res.status(404).json({ message: "Not found!" })
        });

    }
})

app.listen(8080, () => console.log("Server is running on port 8080"))