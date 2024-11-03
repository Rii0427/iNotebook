import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
    const host = 'http://localhost:5000';
    const notesInitial = [];

    const [notes, setNotes] = useState(notesInitial);

    //get all notes
    const getNote = async () => {
        //API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const allNotes = await response.json();
        setNotes(allNotes);
    }

    //add a note
    const addNote = async (title, description, tag) => {
        //API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
        });
        console.log("Adding a new note");
        const note = response.json();
        setNotes(notes.concat(note));
    }

    //delete a note
    const deleteNote = async (id) => {
        //API Call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const note = await response.json();
        console.log(note);

        console.log(`Deleting the note with id: ${id}`);
        const newNotes = notes.filter((note) => { return note._id !== id });
        setNotes(newNotes);
    }

    //edit a note
    const editNote = async (id, title, description, tag) => {
        //API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
        });
        const note = await response.json();
        console.log(note);
        console.log(`Editing the note with id: ${id}`);
        
        //Edit in client
        for (let i = 0; i < notes.length; i++) {
            const element = notes[i];
            if (element._id === id) {
                notes[i].title = title;
                notes[i].description = description;
                notes[i].tag = tag;
                break;
            }
        }
        setNotes(notes);
    }


    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNote }}>
            {/* props.children renders any children of the NoteContext.Provider, allowing them to access state and update through the context. Thats why we wrap all the components of App.js in NoteContext.Provider*/}
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;