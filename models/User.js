import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    userImage: { type: String },
    userName: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
  },
  {
    timestamp: true,
  }
)

export default mongoose.model('User', UserSchema)
