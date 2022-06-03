const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const dbNotes = require('./db/db.json');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    return res.json(dbNotes);
});

app.post('/api/notes', (req, res) => {
    dbNotes.push(req.body);
    const id = uuidv4();
    req.body.id = id;
    fs.writeFile('./db/db.json', JSON.stringify(dbNotes, null, 2), (err) => {
        if (err) {
            throw err;
        }
    });
    return res.json(dbNotes);
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        const newData = JSON.parse(data);
        const deleteNote = newData.filter((noteId) => noteId.id !== id)
        fs.writeFile('./db/db.json', JSON.stringify(deleteNote, null, 2), (err) => {
            if (err) {
                throw err;
            } else {
                res.json(deleteNote);
            }
        });
    });
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);