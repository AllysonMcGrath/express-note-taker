const express = require("express");
const path = require("path");
const uniqid = require("uniqid");
const fs = require("fs");


const app = express();
const {notes} = require("./db/db.json");

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
//get files like css, makes all files in the public folder static resources
app.use(express.static("public"));

function createNewNote (body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
}

function validateNote(note) {
    if (note.title === ""|| typeof note.title !== "string") {
        return false;
    }
    if (note.text === "" || typeof note.text !== "string") {
        return false;
    }
    return true
}




app.get("/api/notes", (req, res) => {
    let results = notes;
    res.json(results);
});

app.post("/api/notes", (req, res) => {
    // req.body is incoming content
    req.body.id = uniqid();

    if (!validateNote(req.body)) {
        res.status(400).send("The note is not properly formatted");
    }
    else {
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
});

app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id

    for (let i = 0; i < notes.length; i++) {
        if (noteId === notes[i].id) {
          notes.splice(noteId, 1);
          res.json(notes);
          return; 
        }
    }
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