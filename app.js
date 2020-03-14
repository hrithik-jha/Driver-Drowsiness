const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const path = require('path');
const collection = "driverDB";

app.use(express.static(path.join(__dirname, '')));

const admin = require('firebase-admin');
let serviceAccount = require(path.join(__dirname, 'credentials', 'driverdrowsiness-10-7d44a96eda05.json'));
// let serviceAccount = require(path.join('credentials/driverdrowsiness-10-7d44a96eda05.json'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


// Connection to Firestore
const port = process.env.PORT || 27017;
app.listen(port, () => {
    console.log("Connected | App Listening on 27017");
});


// == GET METHODS ==

// Checking is the server is deployed and ready
app.get('/', (req, res) => {
    res.json("App Deployed on heroku on port " + port);
});


// Get complete profile of all drivers
app.get('/getEverything', (req, res) => {
    db.collection(collection)
        .get()
        .then((documents) => {
            let itemArray = [];
            documents.forEach((item) => {
                itemArray.push(item.data());
            });
            res.json(itemArray);
        })
        .catch((err) => {
            console.log(err);
            res.json({
                error: 1,
                message: err
            })
        })
});

// Get complete profile of one user
app.get('/getProfileOf', (req, res) => {
    const userID = req.body.id;
    db.collection(collection).doc(userID).get()
        .then((doc) => {
            res.json(doc.data());
        })
});

// Get drowsiness of one user
app.get('/getDrowsyActivity', (req, res) => {
    const userID = req.body.id;
    db.collection(collection).doc(userID).get()
        .then((doc) => {
            res.json(doc.data().activity);
        })
});


// == POST METHODS ==
// Add a new driver
app.post('/addNewDriver', (req, res) => {
    db.collection(collection)
        .add({
            name: req.body.name,
            contact: req.body.contact,
            emergency1: req.body.emergency1,
            emergency2: req.body.emergency2,
            emergency3: req.body.emergency3,
            activity: []
        })
        .then((ref) => {
            console.log("Written successfully with ID : " + ref.id);
            db.collection(collection).doc(ref.id)
                .update({
                    id: ref.id
                })
                .then(() => {
                    db.collection(collection).doc(ref.id).get().then((doc) => {
                        res.json(doc.data());
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

// Add a drowsiness activity
app.put('/addActivity', (req, res) => {
    const entry = {
        time: req.body.time,
        isDrowsy: req.body.isDrowsy
    };
    db.collection(collection).doc(req.body.id)
        .update({
            activity: admin.firestore.FieldValue.arrayUnion(entry)
        })
        .then(() => {
            res.json({
                error: 0,
                message: "updated document with id : " + req.body.id
            })
        })
        .catch((err) => {
            console.log(err);
            res.json({
                error: 1,
                message: err
            })
        })
});


// == Fetching Web Pages ==
app.get('/adminHome', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/admin_home.html'));
});

app.get('/driverActivity', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/activity.html'));
});