const functions = require('firebase-functions'); // enable to create funcitons
const admin = require('firebase-admin'); // admin sdk

var serviceAccount = require("./permisions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-restapi-607c0.firebaseio.com"
});


const express = require('express'); // to create server instance
const app = express();
const db = admin.firestore();

const cors = require('cors'); // enable corsserver instance
app.use(cors({ origin: true }));

//Routes
app.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World!');
});


// Create
// post
app.post('/api/create', (req, res) => {
    (async () => {

        try {
            await db.collection('products').doc('/'  + req.body.id + '/')
            .create({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
            })
            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
        

    })();
});

// Read specific product based ID
// Get
app.get('/api/read/:id', (req, res) => {
    (async () => {

        try {
            const document = db.collection('products').doc(req.params.id);
            let product = await document.get();
            let response = product.data();
    
            return res.status(200).send(response);
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
        

    })();
});


// Read all products
// Get
app.get('/api/read', (req, res) => {
    (async () => {

        try {
            const query = db.collection('products');
            let response = [];
    
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs; // the result of the query

                for(let doc of docs)
                {
                    const selectedItem = {
                        id: doc.id,
                        name: doc.data().name,
                        description: doc.data().description,
                        price: doc.data().price
                    };
                    response.push(selectedItem);
                }
                return response; // each than should return a value
            })
            return res.status(200).send(response);
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
        

    })();
});


// update
// Put
app.put('/api/update/:id', (req, res) => {
    (async () => {

        try {
            const document = db.collection('products').doc(req.params.id);
            await document.update({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
            });
            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
        

    })();
});



// delete
// delete
app.delete('/api/delete/:id', (req, res) => {
    (async () => {

        try {
            const document = db.collection('products').doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
        

    })();
});



// export api to firebase cloud funcitons
exports.app = functions.https.onRequest(app);