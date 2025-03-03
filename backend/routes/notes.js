const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all the Notes using: GET "/api/notes/fetchallnotes". Login required
//Using a middleware function "fetchuser"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        //send internal server error
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE 2: Add a new note using: POST "/api/notes/addnote". Login required
//Using a middleware function "fetchuser"
router.post('/addnote', fetchuser, [

    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),

], async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        // if there are errors, return bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //bad request with status code 400
            return res.status(400).json({ errors: errors.array() });
        };

        //Adding a new note
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.log(error.message);
        //send internal server error
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote". Login required
//Using a middleware function "fetchuser"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        //create a newnote object
        const newNote = {};
        if(title){
            newNote.title = title;
        }
        if(description){
            newNote.description = description;
        }
        if(tag){
            newNote.tag = tag;
        }

        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if(!note){
            //Not Found with status code 404
            return res.status(404).send("Not found");
        }
        //Allow updation only if user owns this note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true});
        res.json(note);

    } catch (error) {
        console.log(error.message);
        //send internal server error
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote". Login required
//Using a middleware function "fetchuser"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if(!note){
            //Not Found with status code 404
            return res.status(404).send("Not found");
        }
        //Allow deletion only if user owns this note
        if(note.user.toString() !== req.user.id){
            //Unauthorised Request with status code 401
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted", note:note});

    } catch (error) {
        console.log(error.message);
        //send internal server error
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router