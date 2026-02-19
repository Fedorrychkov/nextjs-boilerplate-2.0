import mongoose, { Document, Model, Schema } from 'mongoose'

import { SubscriptionModel, SubscriptionStatus, SubscriptionType } from '~/api/subscription'
import { time } from '~/utils/time'

export interface ISubscription extends Document, Omit<SubscriptionModel, 'id' | 'userId'> {
  userId: mongoose.Types.ObjectId
}

const SubscriptionSchema: Schema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.ACTIVE,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(SubscriptionType),
      default: SubscriptionType.FREE,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    totalTokensLimit: {
      type: Number,
      required: true,
      default: 0,
    },
    expiresAt: {
      type: Date,
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

const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema)

export default Subscription
