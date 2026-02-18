import bcrypt from 'bcryptjs'
import mongoose, { Document, Model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import { UserModel, UserRole, UserStatus } from '~/api/user'
import { time } from '~/utils/time'

export interface IUser extends Document, Omit<UserModel, 'id'> {
  role?: UserRole
  password?: string | null
  fullName?: string | null
  email?: string | null
  actionUserId?: string | null
  status?: UserStatus | null
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  avatarUrl?: string | null
  statusMessage?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // По умолчанию не возвращаем пароль
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    fullName: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    statusMessage: {
      type: String,
      trim: true,
    },
    actionUserId: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: String,
      default: () => time().toISOString(),
    },
    updatedAt: {
      type: String,
      default: () => time().toISOString(),
    },
  },
  {
    timestamps: true,
  },
)

// Хешируем пароль перед сохранением
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  if (!this.password) {
    throw new Error('Password is required')
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Метод для сравнения паролей
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
