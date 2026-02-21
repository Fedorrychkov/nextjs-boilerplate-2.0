import mongoose, { Document, Model, Schema } from 'mongoose'

import { ChatModel } from '~/api/chat'
import { time } from '~/utils/time'

export interface IChat extends Document, Omit<ChatModel, 'id' | 'userId'> {
  userId: mongoose.Types.ObjectId
}

const ChatSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: false,
      default: null,
    },
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
  },
  {
    timestamps: true,
  },
)

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema)

export default Chat
