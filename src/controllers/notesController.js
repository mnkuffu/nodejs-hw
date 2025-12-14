import createHttpError from "http-errors";
import { Note } from "../models/note.js";

export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (err) {
    console.error("Error in getAllNotes:", err);
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) {
      console.error(`Note not found: ${noteId}`);
      throw createHttpError(404, "Note not found");
    }
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, content, tag } = req.body; 
    const newNote = await Note.create({ title, content, tag });
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Error in createNote:", err);
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { title, content, tag } = req.body; 
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, tag },
      { new: true }
    );
    if (!updatedNote) {
      console.error(`Note not found for update: ${noteId}`);
      throw createHttpError(404, "Note not found");
    }
    res.status(200).json(updatedNote);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      console.error(`Note not found for delete: ${noteId}`);
      throw createHttpError(404, "Note not found");
    }
    res.status(200).json(deletedNote);
  } catch (err) {
    next(err);
  }
};