import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
    
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;
    const { tag, search } = req.query;

    let query = Note.find();

    if (tag) {
      query = query.where('tag').equals(tag);
    }

    if (search && search.trim() !== '') {
      query = query.where({ $text: { $search: search } });
    }

    const [totalNotes, notes] = await Promise.all([
      query.clone().countDocuments(),
      query
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec(),
    ]);
    const totalPages = Math.ceil(totalNotes / perPage) || 1;

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages,
      notes,
    });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) throw createHttpError(404, 'Note not found');
  res.status(200).json(note);
};

export const createNote = async (req, res, next) => {
  const newNote = await Note.create(req.body);
  res.status(201).json(newNote);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const updated = await Note.findByIdAndUpdate(noteId, req.body, {
    new: true,
  });

  if (!updated) throw createHttpError(404, 'Note not found');
  res.status(200).json(updated);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const deleted = await Note.findByIdAndDelete(noteId);

  if (!deleted) throw createHttpError(404, 'Note not found');
  res.status(200).json(deleted);
};
