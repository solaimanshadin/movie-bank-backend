const {name, email} = require('./other');
const os = require('os');

const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res, next) => {
    res.json({message: "Hello world!"})
})

app.use((req, res, next) => {
    console.log("Url " , req.url)
    next()
});

app.post('/product', (req, res, next) => {
    const data = req.body;
    console.log(data)
    res.json(data)
})

app.use((req, res) => {
    res.status(404).json({message: "Not found!"})
});

app.listen(8080, () => console.log("Server is running on port 8080"))