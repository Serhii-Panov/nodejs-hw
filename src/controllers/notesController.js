import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// Отримати список усіх нотаток
export const getAllNotes = async (req, res) => {
  const { search, tag, page, perPage } = req.query;
  const noteQuery = Note.find({ userId: req.user._id });
   if (search) {
    noteQuery.where({ $text: { $search: search } });
  }
  if (tag) {
    noteQuery.where({ tag });
  }
   const [totalNotes, notes] = await Promise.all([
    noteQuery.clone().countDocuments(),
    noteQuery.skip((page - 1) * perPage).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

// Отримати одну нотатку за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });

  if (!note) {
    throw new createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Cтворити нотатку 
export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id }, // Шукаємо по id та userId
    req.body,
    { new: true }, // повертаємо оновлений документ
  );

  if (!note) {
	throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};