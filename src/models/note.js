import { Schema } from 'mongoose';
import { model } from 'mongoose';
import {TAGS} from '../constants/tags.js';
const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    content: {
      type: String,
      trim: true,
      required: false,
      default: '',
    },
    tag: {
      type: String,
      required: false,
      enum: TAGS,
      default: 'Todo',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
noteSchema.index({ title: 'text', content: 'text' }); // Індекс для пошуку по тексту
export const Note = model('Note', noteSchema);
