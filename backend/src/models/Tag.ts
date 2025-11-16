import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  description: string;
  color: string;
  category: 'specialty' | 'use-case' | 'difficulty' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#0ea5e9',
    },
    category: {
      type: String,
      enum: ['specialty', 'use-case', 'difficulty', 'other'],
      default: 'other',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITag>('Tag', TagSchema);
