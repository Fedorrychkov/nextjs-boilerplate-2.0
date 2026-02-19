import mongoose, { Document, Model, Schema } from 'mongoose'

import { UsageModel } from '~/api/usage'
import { time } from '~/utils/time'

export interface IUsage extends Document, Omit<UsageModel, 'id' | 'userId'> {
  userId: mongoose.Types.ObjectId
}

const UsageSchema: Schema = new Schema(
  {
    createdAt: {
      type: String,
      required: true,
      default: () => time().toISOString(),
    },
    updatedAt: {
      type: String,
      required: false,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: false,
      default: null,
    },
    totalTokens: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

const Usage: Model<IUsage> = mongoose.models.Usage || mongoose.model<IUsage>('Usage', UsageSchema)

export default Usage
