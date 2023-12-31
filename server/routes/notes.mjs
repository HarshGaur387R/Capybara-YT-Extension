import express from 'express';
import {tokenAuthenticator} from '../middleware/tokenAuthenticator.mjs'
import { addNote, deleteNote, fetchNotes, updateNote } from '../controller/notes.mjs';
import { passValidUser } from '../middleware/passValidUser.mjs';
import { body, validationResult } from 'express-validator';
import https_codes from '../config/http_code.mjs';
const notesRoute = express.Router();

// ROUTE 1 : fetching user notes . Login required.
notesRoute.get('/fetch-notes',tokenAuthenticator,passValidUser,fetchNotes);


// ROUTE 2 : route to add note in database. Login required.
notesRoute.post('/add',[
    body("title", 'title is required').isLength({min:1}),
    body("description", 'description is required').isLength({ min: 1 })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
},tokenAuthenticator,passValidUser,addNote);


// ROUTE 3 : route to update a note in database. Login required.
notesRoute.put('/update',[
    body("noteId", 'Note Id is required').exists()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
},tokenAuthenticator,passValidUser,updateNote)


// ROUTE 3 : route to delete a note in database. Login required.
notesRoute.delete('/delete',[
    body("noteId", 'Note Id is required').exists()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(https_codes.BAD_REQUEST).json({ error: errors.array() });
    }
    next();
},tokenAuthenticator,passValidUser,deleteNote);

export default notesRoute;