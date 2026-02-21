import mongoose, { Document, Model, Schema } from 'mongoose'

import { MessageModel, MessageRole } from '~/api/messages'
import { time } from '~/utils/time'

export interface IMessage extends Document, Omit<MessageModel, 'id' | 'chatId'> {
  chatId: mongoose.Types.ObjectId
}

const MessageSchema: Schema = new Schema(
  {
    role: {
      type: String,
      enum: Object.values(MessageRole),
      required: true,
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
    content: {
      type: String,
      required: false,
      default: null,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)

export default Message
