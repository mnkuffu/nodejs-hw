import { Schema, model } from 'mongoose';

const noteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: false, default: '', trim: true },
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
  }
);

noteSchema.index({ title: 'text', content: 'text' });
export const Note = mongoose.model("Note", noteSchema);