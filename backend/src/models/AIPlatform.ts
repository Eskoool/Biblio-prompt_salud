import mongoose, { Document, Schema } from 'mongoose';

export interface IAIPlatform extends Document {
  name: string;
  description: string;
  icon?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AIPlatformSchema = new Schema<IAIPlatform>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAIPlatform>('AIPlatform', AIPlatformSchema);
