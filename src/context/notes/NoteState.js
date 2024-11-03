import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
    const host = 'http://localhost:5000';
    const notesInitial = [
        {
            "_id": "6724edda9fab8c0dd3c51635",
            "user": "6724de6de0e2f3f025c3babb",
            "title": "My Title",
            "description": "Plaese wake me up",
            "tag": "personal",
            "date": "2024-11-01T15:03:54.143Z",
            "__v": 0
        },
        {
            "_id": "6724f3bd66ec17dfdfe4e02e",
            "user": "6724de6de0e2f3f025c3babb",
            "title": "My Title2",
            "description": "Plaese wake me up",
            "tag": "personal",
            "date": "2024-11-01T15:29:01.549Z",
            "__v": 0
        },
        {
            "_id": "672607db98f1c5437e4302f8",
            "user": "6724de6de0e2f3f025c3babb",
            "title": "My Title3",
            "description": "Hey whats up!",
            "tag": "personal",
            "date": "2024-11-02T11:07:07.392Z",
            "__v": 0
        },
        {
            "_id": "6724f3bd66ecc17dfdfe4e02e",
            "user": "6724de6de0e2f3f025c3babb",
            "title": "My Title2",
            "description": "Plaese wake me up",
            "tag": "personal",
            "date": "2024-11-01T15:29:01.549Z",
            "__v": 0
        },
        {
            "_id": "672607dbv98f1c5437e4302f8",
            "user": "6724de6de0e2f3f025c3babb",
            "title": "My Title3",
            "description": "Hey whats up!",
            "tag": "personal",
            "date": "2024-11-02T11:07:07.392Z",
            "__v": 0
        },
        {
            "_id": "6724f3bdv66ec17dfdfe4e02e",
            "user": "6724de6de0e2f3f025c3babb",
            "title": "My Title2",
            "description": "Plaese wake me up",
            "tag": "personal",
            "date": "2024-11-01T15:29:01.549Z",
            "__v": 0
        },
        {
            "_id": "672607db98f1c543v7e4302f8",
            "user": "6724de6de0e2f3f025c3babb",
            "title": "My Title3",
            "description": "Hey whats up!",
            "tag": "personal",
            "date": "2024-11-02T11:07:07.392Z",
            "__v": 0
        },
        {
            "_id": "6724f3bd6v6ec17dfdfe4e02e",
            "user": "6724de6de0e2f3f025c3babb",
            "title": "My Title2",
            "description": "Plaese wake me up",
            "tag": "personal",
            "date": "2024-11-01T15:29:01.549Z",
            "__v": 0
        },
        {
            "_id": "672607db98f1cv5437e4302f8",
            "user": "6724de6de0e2f3f025c3babb",
            "title": "My Title3",
            "description": "Hey whats up!",
            "tag": "personal",
            "date": "2024-11-02T11:07:07.392Z",
            "__v": 0
        },
    ];

    const [notes, setNotes] = useState(notesInitial);

    //add a note
    const addNote = async (title, description, tag) => {
        //API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjcyNGRlNmRlMGUyZjNmMDI1YzNiYWJiIn0sImlhdCI6MTczMDQ3MTIyOH0.Cnc82UXJZB1oNjxCaDLJydCf9igFxEe3j-wA4xVploc'
            },
            body: JSON.stringify({title, description, tag})
        });
        const json = response.json();

        console.log("Adding a new note");
        const note = {
            "_id": "672607db4798f1cv5437e4302f8",
            "user": "6724de6de0e2f3f025c3babb",
            "title": title,
            "description": description,
            "tag": tag,
            "date": "2024-11-02T11:07:07.392Z",
            "__v": 0
        }
        setNotes(notes.concat(note));
    }

    //delete a note
    const deleteNote = (id) => {
        //API call
        console.log(`Deleting the note with id: ${id}`);
        const newNotes = notes.filter((note) => { return note._id !== id });
        setNotes(newNotes);
    }

    //edit a note
    const editNote = async (id, title, description, tag) => {
        //API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjcyNGRlNmRlMGUyZjNmMDI1YzNiYWJiIn0sImlhdCI6MTczMDQ3MTIyOH0.Cnc82UXJZB1oNjxCaDLJydCf9igFxEe3j-wA4xVploc'
            },
            body: JSON.stringify({title, description, tag})
        });
        const json = response.json();
        
        //Edit in client
        for (let i = 0; i < notes.length; i++) {
            const element = notes[i];
            if (element._id === id) {
                element.title = title;
                element.description = description;
                element.tag = tag;
            }
        }
    }


    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote }}>
            {/* props.children renders any children of the NoteContext.Provider, allowing them to access state and update through the context. Thats why we wrap all the components of App.js in NoteContext.Provider*/}
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;