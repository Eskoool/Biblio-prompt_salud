import mongoose, { Document, Schema } from 'mongoose';

export interface IPrompt extends Document {
  title: string;
  content: string;
  description: string;
  tags: mongoose.Types.ObjectId[];
  aiPlatforms: mongoose.Types.ObjectId[];
  votes: number;
  isRecommended: boolean;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PromptSchema = new Schema<IPrompt>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    aiPlatforms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'AIPlatform',
      },
    ],
    votes: {
      type: Number,
      default: 0,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
PromptSchema.index({ votes: -1 });
PromptSchema.index({ isRecommended: 1 });
PromptSchema.index({ tags: 1 });
PromptSchema.index({ aiPlatforms: 1 });

export default mongoose.model<IPrompt>('Prompt', PromptSchema);
