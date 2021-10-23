const express = require("express");
const path = require("path");
const uniqid = require("uniqid");

const app = express();
const {notes} = require("./db/db.json");

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
//get files like css, makes all files in the public folder static resources
app.use(express.static("public"));

app.get("/api/notes", (req, res) => {
    let results = notes;
    res.json(results);
});

app.post("/api/notes", (req, res) => {
    // req.body is incoming content
    req.body.id = notes.length.toString();

    if (!validateAnimal(req.body)) {
        res.status(400).send("The animal is not properly formatted");
    }
    else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});
})



app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});